import loadCurrentSessionPkg from "@shopify/shopify-api/dist/utils/load-current-session.js";

let loadCurrentSession = loadCurrentSessionPkg;

if (typeof loadCurrentSession !== "function") {
  loadCurrentSession = (loadCurrentSessionPkg as any).default;
}

export {
  loadCurrentSession,
};
