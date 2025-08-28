# Changelogging

A Vue-based changelog management tool for npm packages that automatically extracts package information and provides a beautiful UI for managing changelogs.

## Features

- 🚀 **Quick Setup**: Create a changelog project with a single command
- 📦 **Auto Data Extraction**: Automatically reads from your root `package.json`
- 🎨 **Beautiful Vue UI**: Modern, responsive interface built with Vue 3
- 🔧 **CLI Commands**: Easy-to-use commands for development and building
- 📝 **Package Updates**: Track and manage package updates
- 🎯 **Changelog Management**: Create and manage changelog entries

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
- Install dependencies using pnpm
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

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `changelogging create` | Create a new changelogging project |
| `changelogging dev`    | Start the development server       |
| `changelogging build`  | Build the project for production   |

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
└── CHANGELOG.md            # Your changelog file
```

## Data Extraction

The tool automatically extracts the following information from your root `package.json`:

- Package name, version, and description
- Author and license information
- Repository and homepage URLs
- Dependencies and devDependencies
- Scripts and engine requirements
- Package manager information

## Customization

### Adding Custom Data

You can modify the `template/index.js` file to extract additional data or modify the extraction logic.

### Styling

The Vue app uses Tailwind CSS and PrimeVue components. You can customize the styling by modifying the CSS files in the template.

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Local Development

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Build the library: `pnpm run build`
4. Link locally: `pnpm link --global`
5. Test in a project: `changelogging create`

## Publishing

```bash
# Build the library
pnpm run build

# Publish to npm
npm publish
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
