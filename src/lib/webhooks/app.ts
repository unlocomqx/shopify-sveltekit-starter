import type { ServerRequest, ServerResponse } from "@sveltejs/kit/types/hooks";
import { prisma } from "$lib/prisma/client";
import { deleteShop } from "$lib/cache/app";

export async function processAppUninstalled(request: ServerRequest): Promise<Partial<ServerResponse>> {
  const shop_name = request.headers["x-shopify-shop-domain"];

  const shop = await prisma.shop.findUnique({
    where: { name: shop_name },
  });

  if (!shop) {
    return {
      status: 401,
      body: "Access denied!",
    };
  }

  await prisma.shop.delete({
    where: {
      name: shop_name,
    },
  });

  deleteShop(shop_name);

  return {
    body: "OK",
  };
}
