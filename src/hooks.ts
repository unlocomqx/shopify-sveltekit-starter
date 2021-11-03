import { handle as shopifyHandle } from "$lib/shopify/handler";
import { verify } from "$lib/shopify/verify";
import type { ServerRequest, ServerResponse } from "@sveltejs/kit/types/hooks";
import { createLogger } from "@utils/logger";
import { checkHmacValidity } from "shopify-hmac-validation";
import { prisma } from "$lib/prisma/client";

const log = createLogger("APP:SESSION");

/** @type {import("@sveltejs/kit").Handle} */
export async function handle<Locals>({ request, resolve }: {
  request: ServerRequest<Locals>;
  resolve: (request: ServerRequest<Locals>) => ServerResponse | Promise<ServerResponse>;
}) {

  if (request.path === "/webhooks" ||
    request.path.startsWith("/api/") ||
    request.path.startsWith("/front")) {
    return resolve(request);
  }

  if (!Number(process.env.TEST)) {
    try {
      const shopifyRes = await shopifyHandle({ request });
      if (shopifyRes) {
        return shopifyRes;
      }
    } catch (error) {
      log.error(error);
    }

    // validate hmac of get requests
    if (request.method === "GET" && request.query.get("hmac")) {
      if (!checkHmacValidity(
        process.env.SHOPIFY_API_SECRET,
        Object.fromEntries(request.query as any))
      ) {
        const shop = request.query.get("shop") || process.env.SHOP;
        return {
          status: 401,
          headers: {
            location: `/auth?shop=${shop}`,
          },
        };
      } else {
        return resolve(request);
      }
    }

    if (request.path !== "/") {
      // every other request must have a session
      const redirectToAuth = await verify(request);
      if (redirectToAuth) {
        return redirectToAuth;
      }
    }
  } else {
    const shop = await prisma.shop.findUnique({
      where: { name: process.env.SHOP },
    });
    const session = await prisma.offlineSession.findFirst({
      where: {
        id_shop: shop.id,
      },
    });
    (request.locals as any) = { shop, session };
  }

  return resolve(request);
}
