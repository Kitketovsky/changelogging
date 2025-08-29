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

const CONFIG = {
  scaffoldFolder: ".changelogging",
  templateFolder: "template",
  packageJson: "package.json",
  defaultPackageManager: "npm",
  execDevCommand: "changelogging:dev",
  devCommand: "changelogging dev",
  execBuildCommand: "changelogging:build",
  buildCommand: "changelogging build",
};

const program = new Command();

program
  .name("changelogging")
  .description(
    "A local-first Vue-based package.json report tool for outdated dependencies"
  )
  .version("1.0.0");

program
  .command("create")
  .description("Scaffold .changelogging project")
  .action(async () => {
    const rootDir = process.cwd();
    const targetDir = join(rootDir, CONFIG.scaffoldFolder);
    const templateDir = join(__dirname, "..", CONFIG.templateFolder);
    const rootPackageJsonFile = join(rootDir, CONFIG.packageJson);

    // Check if .changelogging folder already exists
    if (fs.existsSync(targetDir)) {
      console.error(
        chalk.red(
          `❌ Folder ${CONFIG.scaffoldFolder} already exists. Remove it first.`
        )
      );
      process.exit(1);
    }

    const spinner = ora("Creating changelogging project...").start();

    const pm = (await detect()) || {
      agent: CONFIG.defaultPackageManager,
      name: CONFIG.defaultPackageManager,
    };

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

      packageJson.scripts[CONFIG.execDevCommand] = CONFIG.devCommand;
      packageJson.scripts[CONFIG.execBuildCommand] = CONFIG.buildCommand;

      fs.writeFileSync(
        rootPackageJsonFile,
        JSON.stringify(packageJson, null, 2)
      );

      console.log(
        chalk.green(
          `✅ Changelogging project created successfully in '${targetDir}'`
        )
      );

      const normalizedDevCommand = normalizeCommand(
        resolveCommand(pm.agent, "run", CONFIG.execDevCommand)
      );

      const normalizedBuildCommand = normalizeCommand(
        resolveCommand(pm.agent, "run", CONFIG.execBuildCommand)
      );

      console.log(chalk.blue(`📝 Added scripts to package.json:`));
      console.log(chalk.cyan(`   ${normalizedDevCommand}`));
      console.log(chalk.cyan(`   ${normalizedBuildCommand}`));
      console.log(chalk.yellow(`\n🚀 To view changelogs UI:`));
      console.log(chalk.yellow(`   ${normalizedDevCommand}`));
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
    const EXPECTED_CHANGELOGGING_PATH = join(
      process.cwd(),
      CONFIG.scaffoldFolder
    );

    if (!fs.existsSync(EXPECTED_CHANGELOGGING_PATH)) {
      console.error(
        chalk.red(
          `❌ No ${CONFIG.scaffoldFolder} folder has been found in '${EXPECTED_CHANGELOGGING_PATH}'`
        )
      );

      process.exit(1);
    }

    const pm = (await detect()) || {
      agent: CONFIG.defaultPackageManager,
      name: CONFIG.defaultPackageManager,
    };

    console.log(chalk.blue(`🚀 Starting changelogging...`));

    const normalizedDevCommand = normalizeCommand(
      resolveCommand(pm.agent, "run", ["dev"])
    );

    try {
      execSync(normalizedDevCommand, {
        cwd: EXPECTED_CHANGELOGGING_PATH,
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
