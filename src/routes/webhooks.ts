import { createLogger } from "$lib/utils/logger";
import type { ServerRequest, ServerResponse } from "@sveltejs/kit/types/hooks";

import { checkWebhookHmacValidity } from "shopify-hmac-validation";
import { processAppUninstalled } from "$lib/webhooks/app";

const log = createLogger("DB:WEBHOOKS");

/**
 * @type {import("@sveltejs/kit").RequestHandler}
 */
export async function post(request: ServerRequest): Promise<Partial<ServerResponse>> {
  const hmac = request.headers["x-shopify-hmac-sha256"];

  const isValidRequest = checkWebhookHmacValidity(
    process.env.SHOPIFY_API_SECRET,
    request.rawBody,
    hmac,
  );

  if (!isValidRequest) {
    log.error("Invalid webhook request");
    return {
      status: 401,
      body: "Access denied!",
    };
  }

  try {
    switch (request.headers["x-shopify-topic"]) {
      case "app/uninstalled":
        return await processAppUninstalled(request);
        break;
      default:
        return {
          status: 401,
          body: "Access denied!",
        };
    }
  } catch (e) {
    log.error(e);
    console.error(e.message);
  }
  return {
    body: "OK",
  };
}
