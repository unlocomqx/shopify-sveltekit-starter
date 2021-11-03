import { config } from "../../config";
import { exec } from "child-process-promise";
import chalk from "chalk";

export async function seed(spec) {
  const sql_command = `psql --username postgres ${config.e2e_database} < ./cypress/seeds/${spec}.sql`;
  const command = sql_command;
  try {
    const res = await exec(command);
    if (res.stderr.toLowerCase().includes("error")) {
      console.log(chalk.red(spec));
      console.error(res.stderr);
    }
    return res;
  } catch (e) {
    console.error(e);
  }
}
