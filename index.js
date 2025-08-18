const fs = require("fs");
const path = require("path");
const { exit } = require("process");

const UPDATES_FILE = path.join(__dirname, "updates.txt");

const isUpdatesFileExists = fs.existsSync(UPDATES_FILE);

if (!isUpdatesFileExists) {
  throw new Error(`File '${UPDATES_FILE} does not exist.'`);
}

const updatesRaw = fs.readFileSync(UPDATES_FILE);
const updatesString = updatesRaw.toString();

// intro, ...patches, end
const batches = updatesString.split(/\n\n/g).slice(1, -1);

// TODO: check ncu output if all packages are up-to-date
if (batches.length === 0) {
  throw new Error(`No updates has been found!`);
}

const packagesData = new Map();

for (const batch of batches) {
  const [sectionTitleRaw, ...packages] = batch.split(/\n/g);
  const [category, ...description] = sectionTitleRaw.split(/\s+/);

  for (const packageRaw of packages) {
    const [name, currentVersion, _, latestVersion] = packageRaw
      .trim()
      .split(/\s+/);

    if (!packagesData.has(category)) {
      packagesData.set(category, {
        description: description.join(" "),
        items: [],
      });
    }

    packagesData.get(category).items.push({
      link: `https://registry.npmjs.org/${name}`,
      name,
      currentVersion,
      latestVersion,
    });
  }
}

// TODO: get owner and repo names

// if response.type === 'git' => response.url (starts with git+https) => remove git+
// response.versions keys => version, value => data

// https://api.github.com/repos/eslint/eslint/compare/v8.42.0...v9.33.0

exit(0);
