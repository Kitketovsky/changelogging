#!/usr/bin/env node

import { Command } from "commander";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";

import { detect } from "package-manager-detector/detect";
import { resolveCommand } from "package-manager-detector/commands";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function normalizeCommand({ command, args }) {
  return `${command} ${args.join(" ")}`.trim();
}

const program = new Command();

program
  .name("changelogging")
  .description("A Vue-based changelog management tool for npm packages")
  .version("1.0.0");

program
  .command("create")
  .description("Create a new changelogging project")
  .action(async () => {
    const rootDir = process.cwd();
    const targetDir = join(rootDir, ".changelogging");
    const templateDir = join(__dirname, "..", "template");
    const rootPackageJsonFile = join(rootDir, "package.json");

    // Check if .changelogging folder already exists
    if (fs.existsSync(targetDir)) {
      console.error(
        chalk.red(`❌ Folder .changelogging already exists. Remove it first.`)
      );
      process.exit(1);
    }

    const spinner = ora("Creating changelogging project...").start();

    const pm = (await detect()) || { agent: "npm", name: "npm" };

    try {
      // Copy template files
      await fs.copy(templateDir, targetDir);
      spinner.succeed(`Template from ${templateDir} copied to ${targetDir}`);

      // Install dependencies
      spinner.start("Installing dependencies...");
      const installDepsCommandRaw = resolveCommand(pm.agent, "install");
      execSync(normalizeCommand(installDepsCommandRaw), {
        stdio: "pipe",
        cwd: targetDir,
      });
      spinner.succeed("Dependencies installed");

      // Read and update root package.json
      const packageJsonContent = fs.readFileSync(rootPackageJsonFile, "utf8");
      const packageJson = JSON.parse(packageJsonContent);

      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }

      packageJson.scripts["changelogging:dev"] = "changelogging dev";
      packageJson.scripts["changelogging:build"] = "changelogging build";

      fs.writeFileSync(
        rootPackageJsonFile,
        JSON.stringify(packageJson, null, 2)
      );

      console.log(
        chalk.green(
          `✅ Changelogging project created successfully in '${targetDir}'`
        )
      );

      const devCommand = normalizeCommand(
        resolveCommand(pm.agent, "run", "changelogging:dev")
      );

      const buildCommand = normalizeCommand(
        resolveCommand(pm.agent, "run", "changelogging:build")
      );

      console.log(chalk.blue(`📝 Added scripts to package.json:`));
      console.log(chalk.cyan(`   ${devCommand}`));
      console.log(chalk.cyan(`   ${buildCommand}`));
      console.log(chalk.yellow(`\n🚀 To view changelogs UI:`));
      console.log(chalk.yellow(`   ${devCommand}`));
    } catch (error) {
      spinner.fail("Failed to create project");
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command("dev")
  .description("Start the changelogging development server")
  // .option("-p, --path <path>", "package.json file path", "./package.json")
  .action(async (args) => {
    const EXPECTED_CHANGELOGGING_PATH = join(process.cwd(), ".changelogging");

    if (!fs.existsSync(EXPECTED_CHANGELOGGING_PATH)) {
      console.error(
        chalk.red(
          `❌ No .changelogging folder has been found in '${EXPECTED_CHANGELOGGING_PATH}'`
        )
      );

      process.exit(1);
    }

    const pm = (await detect()) || { agent: "npm", name: "npm" };

    console.log(chalk.blue(`🚀 Starting changelogging...`));

    const devCommand = normalizeCommand(
      resolveCommand(pm.agent, "run", ["dev"])
    );

    try {
      execSync(devCommand, {
        cwd: join(process.cwd(), ".changelogging"),
        stdio: "inherit",
      });
    } catch (error) {
      console.error(
        chalk.red(`❌ Error starting Changelogging UI: ${error.message}`)
      );
      process.exit(1);
    }
  });

program.parse();
