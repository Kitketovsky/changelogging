#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔨 Building changelogging library...");

const binPath = path.join(__dirname, "..", "bin", "entry.js");
if (fs.existsSync(binPath)) {
  fs.chmodSync(binPath, "755");
  console.log("✅ Made entry.js executable");
}

const templateDir = path.join(__dirname, "..", "template");
if (fs.existsSync(templateDir)) {
  console.log("✅ Template directory ready");
}

console.log("✅ Build completed successfully!");
console.log("📦 Ready for publishing");
