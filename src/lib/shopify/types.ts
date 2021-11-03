import type { ProductVariant } from "shopify-admin-api-typings";

export type VariantWithHandle = ProductVariant & { handle: string; }

export type ShopifyProductVariant = {
  available: boolean
  barcode: string
  compare_at_price: string
  featured_image: string
  id: number
  inventory_management: string
  name: string
  option1: string
  option2: string
  option3: string
  options: string[]
  price: number
  public_title: string
  requires_shipping: boolean
  sku: string
  taxable: boolean
  title: string
  weight: number
}
