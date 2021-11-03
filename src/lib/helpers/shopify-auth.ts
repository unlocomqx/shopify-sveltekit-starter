import KoaShopifyAuth from "@shopify/koa-shopify-auth";
import { default as verifyRequest } from "@shopify/koa-shopify-auth/dist/src/verify-request/index.js";

let verifyFn = verifyRequest;

if (typeof verifyFn !== "function") {
  verifyFn = (KoaShopifyAuth as any).verifyRequest;
}

let createShopifyAuth = KoaShopifyAuth;
if (typeof createShopifyAuth !== "function") {
  createShopifyAuth = (KoaShopifyAuth as any).default;
}

export { createShopifyAuth, verifyFn as verifyRequest };
