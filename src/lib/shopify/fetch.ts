import { getApp } from "$lib/shopify/bridge";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions/index.js";
import { browser } from "$app/env";

function shopifyFetch(fetchFn = fetch): (uri: RequestInfo, options?: RequestInit | undefined) => Promise<Response> {
  if (Number(process.env.TEST)) {
    return fetchFn;
  }

  let shop = process.env.SHOP;

  if (browser) {
    const urlParams = new URLSearchParams(window.location.search);
    shop = urlParams.get("shop");
  }

  const app = getApp(shop);

  const fetchFunction = authenticatedFetch(app, fetchFn);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1") {
      Redirect.create(app)
        .dispatch(Redirect.Action.REMOTE, `${process.env.HOST}/auth?shop=${shop}`);
      return null;
    }

    return response;
  };
}

export { shopifyFetch as authenticatedFetch };
