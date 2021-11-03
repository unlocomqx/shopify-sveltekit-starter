import { convert } from "$lib/shopify/request";

import type { ServerRequest, ServerResponse } from "@sveltejs/kit/types/hooks";
import { verifyRequest } from "$lib/helpers/shopify-auth";
import { prisma } from "$lib/prisma/client";
import { loadCurrentSession } from "$lib/helpers/shopify-api";

export async function verify(request: ServerRequest): Promise<ServerResponse> {
  const ctx = convert(request);

  const verifyFn = verifyRequest({ returnHeader: true });

  await verifyFn(ctx as any, null);

  const shop = request.query.get("shop") || process.env.SHOP;

  if (ctx.headers["x-shopify-api-request-failure-reauthorize"]) {
    return {
      status: 401,
      headers: {
        "X-Shopify-API-Request-Failure-Reauthorize": "1",
        "X-Shopify-API-Request-Failure-Reauthorize-Url": `${process.env.HOST}/?shop=${shop}`,
      },
      body: null,
    };
  }

  const session = await loadCurrentSession(ctx.req, ctx.res);

  if (session) {
    request.locals.session = session;
    request.locals.shop = await prisma.shop.findUnique({
      where: { name: session.shop },
    });
  }

  return undefined;
}
