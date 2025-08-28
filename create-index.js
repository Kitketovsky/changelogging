#!/usr/bin/env node
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the project name from command line arguments
const projectName = process.argv[2];

if (!projectName) {
  console.error("❌ Please provide a project name:");
  console.error("   pnpm create changelogging@latest my-project");
  process.exit(1);
}

const targetDir = join(process.cwd(), projectName);
const templateDir = join(__dirname, "template");

// Check if folder already exists
if (fs.existsSync(targetDir)) {
  console.error(`❌ Folder ${projectName} already exists.`);
  process.exit(1);
}

console.log(`🚀 Creating changelogging project: ${projectName}`);

try {
  // Copy template files
  fs.cpSync(templateDir, targetDir, { recursive: true });
  console.log(`✅ Project files copied to ${targetDir}`);

  // Change to the project directory
  process.chdir(targetDir);

  // Install dependencies
  console.log(`📦 Installing dependencies...`);
  execSync("pnpm install", { stdio: "inherit" });

  // Extract package data
  console.log(`🔍 Extracting package data...`);
  execSync("node index.js", { stdio: "inherit" });

  console.log(`\n🎉 Changelogging project created successfully!`);
  console.log(`\n📁 Project location: ${targetDir}`);
  console.log(`\n🚀 To start development:`);
  console.log(`   cd ${projectName}`);
  console.log(`   pnpm dev`);
  console.log(`\n🔨 To build for production:`);
  console.log(`   pnpm build`);
} catch (error) {
  console.error(`❌ Error creating project: ${error.message}`);
  process.exit(1);
}
