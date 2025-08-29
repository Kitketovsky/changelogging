# Changelogging

## About

Vue-based interface to list all outdated packages in root project `package.json` file, show
commits diff / history between their versions or ask AI for a report of the changes
with code examples.

## Why

I have a couple of years old project and before I decide to update packages, first of all I need to know what changes
I need to work with. I found such tools like `npm-check-updates` to get outdated dependencies and their current version,
but to see what actually is different and if there are any breaking changes, I need to go to each package's documentation.

To speed up the process, I built that library to traverse each package commit history and ability to use ChatGPT to make
it`s own summary.

## Status

- I'm more than certain that there are tools or libraries that solve mentioned problem far better than this library.
- It's far from production ready and it's my first time building a library. Don't expect much at all.

## Installation

```bash
# Using pnpm (recommended)
pnpm create changelogging@latest

# Using npm
npm create changelogging@latest

# Using yarn
yarn create changelogging@latest
```

## Usage

### 1. Create a new changelog project

```bash
changelogging create
```

This will:

- Create a `.changelogging` folder in your project
- Copy the Vue template with all dependencies
- Install dependencies using your package manager
- Add convenience scripts to your root `package.json`

### 2. Start development server

```bash
changelogging dev
# or
npm run changelogging:dev
```

### 3. Build for production

```bash
changelogging build
# or
npm run changelogging:build
```

## CLI Commands

present
| Command | Description |
| ---------------------- | ---------------------------------- |
| `changelogging create` | Create a new changelogging project |
| `changelogging dev` | Start the development server |
| `changelogging build` | Build the project for production |

## Project Structure

After running `changelogging create`, you'll have:

```
your-project/
├── .changelogging/          # Changelogging project folder
│   ├── src/                 # Vue source files
│   ├── public/              # Static assets
│   ├── package.json         # Dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── index.js             # Data extraction script
│   └── data.json            # Generated package data
├── package.json             # Your root package.json
```

## Data Extraction

- Using `npm-check-updates` library, get list of outdated packages and their latest versions
- From NPM registry get Github information about each of the packages
- Get commit history using Github API `compare` endpoint
- Package gathered information in unifed format and present it on Vue frontend

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
