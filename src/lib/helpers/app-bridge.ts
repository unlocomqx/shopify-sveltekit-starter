import * as appBridgePkg from "@shopify/app-bridge";
import type { ClientApplicationCreator } from "@shopify/app-bridge/client/types";
import * as actions_pkg from "@shopify/app-bridge/actions/index.js";

const createApp: ClientApplicationCreator = appBridgePkg.createApp;
const { Redirect } = actions_pkg;

export {
  createApp,
  Redirect,
};
