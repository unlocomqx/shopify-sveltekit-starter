const ACTIVE_SHOPIFY_SHOPS = {};

export function storeShop(shop: string, data) {
  ACTIVE_SHOPIFY_SHOPS[shop] = data;
}

export function getShop(shop: string) {
  return ACTIVE_SHOPIFY_SHOPS[shop];
}

export function deleteShop(shop: string) {
  delete ACTIVE_SHOPIFY_SHOPS[shop];
}
