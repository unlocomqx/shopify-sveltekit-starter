/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import chalk from "chalk";
import fse from "fs-extra";
import "cypress-watch-and-reload/plugins";
import { seed } from "./seeder";

/**
 * @type {Cypress.PluginConfig}
 */
export default (on, cfg) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("task", {
    "db:seed": async ({ spec }) => {
      return seed(spec);
    },

    "copy:fixtures": () => {
      console.log(chalk.green(`Copying fixture files`));
      fse.copySync("./cypress/fixtures/copy", ".");
      return true;
    },
  });
}
