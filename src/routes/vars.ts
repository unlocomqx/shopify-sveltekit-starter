import type { EndpointOutput } from "@sveltejs/kit/types/endpoint";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";
import type { Session } from "@shopify/shopify-api/dist/auth/session/index.js";
import type { IShop } from "@interfaces/shop";

/**
 * @type {import("@sveltejs/kit").RequestHandler}
 */
export async function get(request: ServerRequest<{ session: Session, shop: IShop }>): Promise<EndpointOutput> {
  const shop = request.locals.shop;

  return {
    body: {},
  };
}
