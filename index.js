#!/usr/bin/env node

/**
 * Changelogging - A Vue-based changelog management tool for npm packages
 *
 * This library provides:
 * - CLI commands for creating, developing, and building changelog projects
 * - Vue-based UI for managing package information and changelogs
 * - Automatic package.json data extraction
 * - Package update tracking
 */

export { default as Changelogging } from "./template/src/App.vue";

// Export utility functions
export const utils = {
  /**
   * Extract package data from a package.json file
   * @param {string} packageJsonPath - Path to package.json
   * @returns {Object} Parsed package data
   */
  extractPackageData: (packageJsonPath) => {
    try {
      const fs = require("fs");
      const packageContent = fs.readFileSync(packageJsonPath, "utf8");
      return JSON.parse(packageContent);
    } catch (error) {
      console.error("Error reading package.json:", error);
      return null;
    }
  },

  /**
   * Generate changelog entry
   * @param {string} version - Version number
   * @param {Array} changes - Array of change descriptions
   * @returns {string} Formatted changelog entry
   */
  generateChangelogEntry: (version, changes) => {
    const date = new Date().toISOString().split("T")[0];
    let entry = `## [${version}] - ${date}\n\n`;

    changes.forEach((change) => {
      entry += `- ${change}\n`;
    });

    entry += "\n";
    return entry;
  },
};

// CLI commands
export const commands = {
  create: "changelogging create",
  dev: "changelogging dev",
  build: "changelogging build",
};

export default {
  utils,
  commands,
  version: "1.0.0",
};
