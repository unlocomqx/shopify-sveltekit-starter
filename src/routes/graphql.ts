import { initContext } from "$lib/shopify/context";
import { GraphqlClient } from "@shopify/shopify-api/dist/clients/graphql/index.js";
import type { ServerResponse } from "@sveltejs/kit/types/hooks";
import { getOfflineToken } from "$lib/database/models/OfflineSession";
import type { ServerRequestWithLocals } from "@interfaces/kit";

initContext();

/**
 * @type {import("@sveltejs/kit").RequestHandler}
 */
export async function get(): Promise<Partial<ServerResponse>> {
  return {
    status: 401,
  };
}

/**
 * @type {import("@sveltejs/kit").RequestHandler}
 */
export async function post(request: ServerRequestWithLocals): Promise<Partial<ServerResponse>> {
  const token = await getOfflineToken(request.locals.shop.name);

  const client = new GraphqlClient(request.locals.shop.name, token);

  try {
    const response = await client.query({
      data: request.body as string,
    });

    const headers = Object.fromEntries(response.headers);

    delete headers["content-encoding"];

    return {
      status: 200,
      body: JSON.stringify(response.body),
    };
  } catch (e) {
    let status;
    switch (e.constructor.name) {
      case "MissingRequiredArgument":
        status = 400;
        break;
      case "HttpResponseError":
        status = e.code;
        break;
      case "HttpThrottlingError":
        status = 429;
        break;
      default:
        status = 500;
    }

    return {
      status,
      body: e.message,
    };
  }
}
