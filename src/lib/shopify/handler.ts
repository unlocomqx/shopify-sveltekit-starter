import { initContext } from "$lib/shopify/context";
import { convert } from "$lib/shopify/request";
import { createLogger } from "$lib/utils/logger";
import { RegisterReturn, Shopify } from "@shopify/shopify-api";
import dotenv from "dotenv";
import { createShopifyAuth } from "$lib/helpers/shopify-auth";
import { prisma } from "$lib/prisma/client";
import { getShop, storeShop } from "$lib/cache/app";
import { resolve } from "path";
import { getOfflineToken } from "$lib/database/models/OfflineSession";

dotenv.config(Number(process.env.TEST) ? { path: resolve(process.cwd(), ".env.test") } : null);

initContext();

const log = createLogger("DB:SESSION");

const offlineAuth = createShopifyAuth({
  accessMode: "offline",
  async afterAuth(ctx) {
    // Access token and shop available in ctx.state.shopify
    const { shop, accessToken, scope } = ctx.state.shopify;
    const host = ctx.query.host;
    storeShop(shop, { name: shop, scope, host });
    try {
      const shopData = getShop(shop);
      await prisma.shop.upsert({
        where: {
          name: shop,
        },
        update: shopData,
        create: shopData,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }

    const webhooks = ["APP_UNINSTALLED", "PRODUCTS_UPDATE", "PRODUCTS_DELETE"];

    const responses: RegisterReturn[] = await Promise.all(webhooks.map(webhook => Shopify.Webhooks.Registry.register({
      shop,
      accessToken,
      path: "/webhooks",
      topic: webhook,
      webhookHandler: async () => {
        return;
      },
    })));

    responses.forEach((res, index) => {
      if (!res.success) {
        log.error(`Failed to register ${webhooks[index]} webhook: ${res.result}`);
      }
    });

    // Redirect to app with shop parameter upon auth
    ctx.redirect(`/?shop=${shop}&host=${host}`);
  },
});

const onlineAuth = createShopifyAuth({
  accessMode: "online",
  afterAuth(ctx) {
    const { shop } = ctx.state.shopify;
    const host = ctx.query.host;
    // Redirect to app with shop parameter upon auth
    ctx.redirect(`/?shop=${shop}&host=${host}`);
  },
});

/** @type {import("@sveltejs/kit").Handle} */
export async function handle({ request }) {
  let shop = request.query.get("shop");
  const host = request.query.get("host");

  let activeShop = getShop(shop);

  // if not saved to memory, fetch from db
  if (shop && !activeShop) {
    activeShop = await prisma.shop.findUnique({
      where: {
        name: shop,
      },
    });
  }

  if (request.path === "/") {
    if (!activeShop || activeShop.scope !== process.env["SCOPES"]) {
      return {
        status: 301,
        headers: {
          location: `${process.env["HOST"]}/auth?shop=${shop}`,
        },
      };
    }

    if (!host && activeShop && activeShop.host) {
      return {
        status: 301,
        headers: {
          location: `${process.env["HOST"]}/?shop=${activeShop.name}&host=${activeShop.host}`,
        },
      };
    }
  }

  if (["/auth", "/auth/inline", "/auth/callback", "/auth/enable_cookies"].includes(request.path)) {
    const ctx = convert(request);

    try {
      if (!await getOfflineToken(shop)) {
        await offlineAuth(ctx as any, () => {
          return true;
        });
      } else {
        await onlineAuth(ctx as any, () => {
          return true;
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }

    return ctx;
  }

  return null;
}
