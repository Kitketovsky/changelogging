import fs from 'fs';
import { dirname, join } from 'path';
import { exit } from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  PACKAGE_JSON_PATH: join(__dirname, 'input.json'),
  UPDATES_TXT_PATH: join(__dirname, 'updates.txt'),
  OUTPUT_JSON_PATH: join(__dirname, 'data.json'),
};

async function main() {
  const packagesUpdatesString = getPackagesUpdatesString();
  const packagesUpdatesParsedObject = await getPackageUpdatesParsedObject(packagesUpdatesString);

  fs.writeFileSync(config.OUTPUT_JSON_PATH, JSON.stringify(packagesUpdatesParsedObject, null, 2));

  exit(0);
}

function getPackagesUpdatesString() {
  const isUpdatesFileExists = fs.existsSync(config.UPDATES_TXT_PATH);

  if (!isUpdatesFileExists) {
    throw new Error(`File '${config.UPDATES_TXT_PATH}' does not exist.`);
  }

  const updatesRaw = fs.readFileSync(config.UPDATES_TXT_PATH);
  const updatesString = updatesRaw.toString();

  return updatesString;
}

function parsePackage(packageRaw) {
  const [name, currentVersion, _, latestVersion] = packageRaw.trim().split(/\s+/);

  return {
    link: `https://registry.npmjs.org/${name}`,
    name,
    currentVersion: currentVersion.replace('^', ''),
    latestVersion: latestVersion.replace('^', ''),
  };
}

async function getRegistryPackageInfo(item) {
  try {
    const response = await fetch(item.link);

    if (!response.ok) {
      console.error(
        `Error fetching registry for '${item.name}'. Status: ${response.status}. Reason: ${response.statusText}`,
      );

      return null;
    }

    const data = await response.json();

    if (!data.repository) {
      console.warn(`Package '${item.name}' does not have its own public repository.`);
      return null;
    }

    const rawRepositoryName =
      typeof data.repository === 'object' && 'url' in data.repository
        ? new URL(data.repository.url).pathname
        : data.repository;

    const [owner, repo] = rawRepositoryName
      .replace('git+', '')
      .replace('.git', '')
      .split('/')
      .filter(Boolean);

    const type =
      typeof data.repository === 'string' || 'directory' in data.repository
        ? 'package'
        : 'repository';

    return {
      type,
      repository_url: `https://github.com/${owner}/${repo}`,
      owner,
      repo,
    };
  } catch (error) {
    console.error(`Failed to fetch '${item.name}' Reason: ${error.message}`);
    return null;
  }
}

async function getPackageUpdatesParsedObject(updatesString) {
  const batches = updatesString.split(/\n\n/g).slice(1, -1);

  if (batches.length === 0) {
    throw new Error(`No updates has been found!`);
  }

  const packagesData = [];

  for (const batch of batches) {
    const [sectionTitleRaw, ...packages] = batch.split(/\n/g);
    const [category, description] = sectionTitleRaw
      .split(/([A-Z][^A-Z]+)\s+([A-Z].+)/gm)
      .filter(Boolean);

    const categoryData = {
      category: category.trim(),
      description: description.trim(),
      items: [],
    };

    for (const packageRaw of packages) {
      const packageAbout = parsePackage(packageRaw);
      const registryPackageInfo = await getRegistryPackageInfo(packageAbout);

      categoryData.items.push({
        exists: !!registryPackageInfo,
        ...packageAbout,
        ...(registryPackageInfo || {}),
      });
    }

    packagesData.push(categoryData);
  }

  return packagesData;
}

main();
