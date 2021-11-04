import { browser } from "$app/env";
import type { AppConfigV1, AppConfigV2, ClientApplication } from "@shopify/app-bridge";
import { createApp, Redirect } from "$lib/helpers/app-bridge";

let app = null;

export function getApp(shop = null, host = null): ClientApplication<any> {
  if (app) {
    return app;
  }

  if (typeof window !== "undefined") {
    if (!shop) {
      const urlParams = new URLSearchParams(window.location.search);
      shop = urlParams.get("shop");
    }
    if (!host) {
      const urlParams = new URLSearchParams(window.location.search);
      host = urlParams.get("host");
    }
  }

  if (Number(process.env.TEST)) {
    shop = process.env.HOST;
    host = process.env.ID_HOST;
  }

  try {
    const clientApplication = createApp({
      apiKey: process.env.SHOPIFY_API_KEY,
      shopOrigin: shop,
      host,
      forceRedirect: false,
    } as AppConfigV1 & AppConfigV2);

    app = clientApplication;

    return clientApplication;
  } catch (e) {
    console.error("Could not create app", e.message);
  }
}

export function initAppBridge() {
  if (!browser) {
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const shop = urlParams.get("shop");
  const host = urlParams.get("host");

  if (!shop && !host) {
    throw new Error("Please open the app from the shop admin interface");
    return;
  }

  if (host) {
    const createAppFn = typeof createApp === "function" ? createApp : (createApp as any).default;
    createAppFn({
      // replaced by vite-plugin-replace in svelte.config.js
      apiKey: process.env.SHOPIFY_API_KEY,
      host,
      forceRedirect: true,
    });
  } else {
    const permissionUrl =
      `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=read_products,read_content&redirect_uri=${process.env.HOST}/auth/callback`;

    // If the current window is the 'parent', change the URL by setting location.href
    if (window.top == window.self) {
      window.location.assign(permissionUrl);

      // If the current window is the 'child', change the parent's URL with Shopify App Bridge's Redirect action
    } else {
      const app = getApp(shop, host);
      Redirect.create(app).dispatch(Redirect.Action.REMOTE, permissionUrl);
    }
  }
}
