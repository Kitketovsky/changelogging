#!/usr/bin/env node
import { Command } from "commander";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import chalk from "chalk";
import ora, { spinners } from "ora";
import fsExtra from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

// !WARNING: it all works if user has pnpm, we need to check for other package managers

program
  .name("changelogging")
  .description("A Vue-based changelog management tool for npm packages")
  .version("1.0.0");

program
  .command("create")
  .description("Create a new changelogging project")
  .action(async () => {
    const targetDir = join(process.cwd(), ".changelogging");
    const templateDir = join(__dirname, "..", "template");
    const rootDir = process.cwd();
    const rootPackageJsonFile = join(rootDir, "package.json");

    // Check if package.json exists
    if (!fs.existsSync(rootPackageJsonFile)) {
      console.error(
        chalk.red(`❌ No package.json file found in the root directory.`)
      );
      process.exit(1);
    }

    // Check if .changelogging folder already exists
    if (fs.existsSync(targetDir)) {
      console.error(
        chalk.red(`❌ Folder .changelogging already exists. Remove it first.`)
      );
      process.exit(1);
    }

    const spinner = ora("Creating changelogging project...").start();

    try {
      // Copy template files
      await fsExtra.copy(templateDir, targetDir);
      spinner.succeed("Project files copied");

      // Install dependencies
      spinner.start("Installing dependencies...");
      execSync(`cd ${targetDir} && pnpm install`, { stdio: "pipe" });
      spinner.succeed("Dependencies installed");

      // Read and update root package.json
      const packageJsonContent = fs.readFileSync(rootPackageJsonFile, "utf8");
      const packageJson = JSON.parse(packageJsonContent);

      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }

      packageJson.scripts["changelogging"] = "changelogging dev";
      packageJson.scripts["build-changelogging"] = "changelogging build";

      fs.writeFileSync(
        rootPackageJsonFile,
        JSON.stringify(packageJson, null, 2)
      );

      console.log(
        chalk.green(
          `✅ Changelogging project created successfully in ${targetDir}`
        )
      );
      console.log(chalk.blue(`📝 Added scripts to package.json:`));
      console.log(chalk.cyan(`   npm run changelogging:dev`));
      console.log(chalk.cyan(`   npm run changelogging:build`));
      console.log(chalk.yellow(`\n🚀 To start development:`));
      console.log(chalk.yellow(`   cd .changelogging && pnpm dev`));
    } catch (error) {
      spinner.fail("Failed to create project");
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

  function generatePackagesChangelogInformation(packageJsonFilePath) {
    const spinner = ora('Parsing package.json file for outdated packages...').start();

     try {
       if (!packageJsonFilePath) {
         packageJsonFilePath = join(process.cwd(), 'package.json');
       }

       if (!fs.existsSync(packageJsonFilePath)) {
        throw new Error(`❌ Provided invalid package.json file path`)
       }

       execSync(`pnpm dlx npm-check-updates --packageFile ${packageJsonFilePath} --format group > ./.changelogging/updates.txt`)
       spinner.succeed();

       spinner.text('Fetching NPM registry about outdated packages...')
       execSync(`node ./changelogging/index.js`);
       spinner.succeed()
     } catch (error) {
      spinner.fail(error.message)
     } finally {
      spinner.stop();
     }
  }

program
  .command("dev")
  .description("Start the changelogging development server")
  .action(() => {
    // Look for changelogging project in current directory or parent
    let changeloggingDir = null;
    let currentDir = process.cwd();

    // First check if we're in a changelogging project
    if (
      fs.existsSync(join(currentDir, "package.json")) &&
      fs.existsSync(join(currentDir, "vite.config.js"))
    ) {
      changeloggingDir = currentDir;
    }
    // Then check for .changelogging folder
    else if (fs.existsSync(join(currentDir, ".changelogging"))) {
      changeloggingDir = join(currentDir, ".changelogging");
    }
    // Finally check parent directory for .changelogging
    else if (fs.existsSync(join(currentDir, "..", ".changelogging"))) {
      changeloggingDir = join(currentDir, "..", ".changelogging");
    }

    if (!changeloggingDir) {
      console.error(chalk.red(`❌ No changelogging project found.`));
      console.error(
        chalk.yellow(
          `   Make sure you're in a changelogging project directory or run 'changelogging create' first.`
        )
      );
      process.exit(1);
    }

    console.log(
      chalk.blue(
        `🚀 Starting changelogging development server in ${changeloggingDir}...`
      )
    );

    try {
      // Change to changelogging directory and start dev server
      process.chdir(changeloggingDir);
      execSync("pnpm dev", { stdio: "inherit" });
    } catch (error) {
      console.error(
        chalk.red(`❌ Error starting dev server: ${error.message}`)
      );
      process.exit(1);
    }
  });

program
  .command("build")
  .description("Build the changelogging project for production")
  .action(() => {
    // Look for changelogging project in current directory or parent
    let changeloggingDir = null;
    let currentDir = process.cwd();

    // First check if we're in a changelogging project
    if (
      fs.existsSync(join(currentDir, "package.json")) &&
      fs.existsSync(join(currentDir, "vite.config.js"))
    ) {
      changeloggingDir = currentDir;
    }
    // Then check for .changelogging folder
    else if (fs.existsSync(join(currentDir, ".changelogging"))) {
      changeloggingDir = join(currentDir, ".changelogging");
    }
    // Finally check parent directory for .changelogging
    else if (fs.existsSync(join(currentDir, "..", ".changelogging"))) {
      changeloggingDir = join(currentDir, "..", ".changelogging");
    }

    if (!changeloggingDir) {
      console.error(chalk.red(`❌ No changelogging project found.`));
      console.error(
        chalk.yellow(
          `   Make sure you're in a changelogging project directory or run 'changelogging create' first.`
        )
      );
      process.exit(1);
    }

    console.log(
      chalk.blue(`🔨 Building changelogging project in ${changeloggingDir}...`)
    );

    try {
      // Change to changelogging directory and build
      process.chdir(changeloggingDir);
      execSync("pnpm build", { stdio: "inherit" });
      console.log(chalk.green("✅ Build completed successfully!"));
    } catch (error) {
      console.error(chalk.red(`❌ Build failed: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();
