import fs from 'fs'
import { exit } from 'process'
import { UPDATES_TXT_PATH, OUTPUT_JSON_PATH } from './config.js'

async function main() {
  const packagesUpdatesString = getPackagesUpdatesString()
  const packagesUpdatesParsedObject = await getPackageUpdatesParsedObject(packagesUpdatesString)

  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(packagesUpdatesParsedObject, null, 2))

  exit(0)
}

function getPackagesUpdatesString() {
  const isUpdatesFileExists = fs.existsSync(UPDATES_TXT_PATH)

  if (!isUpdatesFileExists) {
    throw new Error(`File '${UPDATES_TXT_PATH}' does not exist.`)
  }

  const updatesRaw = fs.readFileSync(UPDATES_TXT_PATH)
  const updatesString = updatesRaw.toString()

  return updatesString
}

function parsePackage(packageRaw) {
  const [name, currentVersion, _, latestVersion] = packageRaw.trim().split(/\s+/)

  return {
    link: `https://registry.npmjs.org/${name}`,
    name,
    currentVersion: currentVersion.replace('^', ''),
    latestVersion: latestVersion.replace('^', ''),
  }
}

async function getRegistryPackageInfo(item) {
  try {
    const response = await fetch(item.link)

    if (!response.ok) {
      console.error(
        `Error fetching registry for '${item.name}'. Status: ${response.status}. Reason: ${response.statusText}`,
      )

      return null
    }

    const data = await response.json()

    if (!('repository' in data)) {
      console.error(`Package ${item.name} does not have a repository.`)
      return null
    }

    if (data.repository.type !== 'git') {
      // FIXME: if it's here it has old format where version number is a key in object
      console.error(
        `Package ${item.name} is not a git package. Received '${data.repository.type}'.`,
      )
      return null
    }

    const [owner, repo] = data.repository.url
      .replace('git+', '')
      .replace('.git', '')
      .split('/')
      .slice(-2)

    if (!owner) {
      console.log('null owner', data.repository.url)
    }

    return {
      owner,
      repo,
    }
  } catch (error) {
    console.error(`Failed to fetch '${item.name}' Reason: ${error.message}`)
    return null
  }
}

async function getPackageUpdatesParsedObject(updatesString) {
  const batches = updatesString.split(/\n\n/g).slice(1, -1)

  // TODO: check ncu output if all packages are up-to-date
  if (batches.length === 0) {
    throw new Error(`No updates has been found!`)
  }

  const packagesData = {}

  for (const batch of batches) {
    const [sectionTitleRaw, ...packages] = batch.split(/\n/g)
    const [category, ...description] = sectionTitleRaw.split(/\s+/g)

    if (!packagesData[category]) {
      packagesData[category] = {
        description: description.join(' '),
        items: [],
      }
    }

    for (const packageRaw of packages) {
      const packageAbout = parsePackage(packageRaw)
      const registryPackageInfo = await getRegistryPackageInfo(packageAbout)

      if (!registryPackageInfo) {
        packagesData[category].items.push({
          exists: false,
          ...packageAbout,
        })

        continue
      }

      packagesData[category].items.push({
        exists: true,
        ...packageAbout,
        ...registryPackageInfo,
      })
    }
  }

  return packagesData
}

main()
