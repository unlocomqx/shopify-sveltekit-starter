// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
/// <reference types="cypress" />

import "cypress-watch-and-reload/support";
import "cypress-wait-until";
import "cypress-file-upload";
import "@foreachbe/cypress-tinymce";

// Import commands.js using ES2015 syntax:
import "./commands";

Cypress.on("uncaught:exception", (error) => {
  if (error.message.includes("Cannot read property 'createRange' of undefined")) {
    return false;
  }
});
