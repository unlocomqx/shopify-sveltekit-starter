import { createLogger } from "$lib/utils/logger";
import { Shopify } from "@shopify/shopify-api";
import { prisma } from "$lib/prisma/client";

const log = createLogger("APP:UTILS");

export async function uninstallApp(shop: string): Promise<boolean> {
  if (!Shopify.Utils.validateShop(shop)) {
    log.error("Invalid shop parameter provided");
    return;
  }

  try {
    await prisma.shop.delete({
      where: {
        name: shop,
      },
    });
    log.info(`App successfully uninstalled from shop: ${shop}`);
    return true;
  } catch (error) {
    log.error(error);
    log.info(
      `Unexpected error occured while uninstalling app from shop: ${shop}`,
    );
  }
  return false;
}
