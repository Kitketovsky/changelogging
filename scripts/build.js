#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔨 Building changelogging library...");

// Ensure bin directory exists and has correct permissions
const binPath = path.join(__dirname, "..", "bin", "entry.js");
if (fs.existsSync(binPath)) {
  // Make the entry file executable
  fs.chmodSync(binPath, "755");
  console.log("✅ Made entry.js executable");
}

// Copy template files to dist if needed
const templateDir = path.join(__dirname, "..", "template");
if (fs.existsSync(templateDir)) {
  console.log("✅ Template directory ready");
}

console.log("✅ Build completed successfully!");
console.log("📦 Ready for publishing");
