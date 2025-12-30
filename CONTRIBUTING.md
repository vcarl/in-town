# Contributing to In-Town

Thank you for your interest in contributing to In-Town! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Git
- Android Studio with SDK 34 (for mobile app development)
- Android device or emulator

### Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/in-town.git
   cd in-town
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```
   This starts both the backend server (port 3000) and the Expo development server.

## Development Workflow

### Code Quality Tools

We use several tools to maintain code quality:

- **ESLint** - Linting for TypeScript/JavaScript
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Husky** - Git hooks for pre-commit checks

### Available Scripts

```bash
# Development
npm run dev              # Start both server and app
npm run dev:server       # Start server only
npm run dev:app          # Start Expo app only

# Code Quality
npm run lint             # Lint all code
npm run typecheck        # Type check all code
npm run format           # Format all code with Prettier
npm run format:check     # Check formatting without making changes

# Build
npm run build            # Build server

# Maintenance
npm run clean            # Remove all node_modules and build artifacts
```

### Pre-commit Hooks

Git hooks automatically run before each commit to ensure code quality:

- **Prettier** - Formats staged files
- **ESLint** - Lints and fixes staged files

If the hooks fail, fix the issues and try committing again.

## Making Changes

### Branching Strategy

- `main` - Production-ready code
- Feature branches - `feature/your-feature-name`
- Bug fixes - `fix/issue-description`

### Commit Messages

Write clear, concise commit messages:

```
Add feature for contact search

- Implement search functionality in ContactsList screen
- Add debounced search input
- Update tests for search behavior
```

### Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**

   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "Your commit message"
   ```

   The pre-commit hooks will run automatically.

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots for UI changes
   - Wait for CI checks to pass
   - Request review from maintainers

## Project Structure

```
in-town/
├── .github/          # GitHub Actions workflows
├── .vscode/          # VS Code workspace settings
├── app/              # Expo React Native mobile app
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── screens/      # App screens
│   │   ├── services/     # API and device services
│   │   └── types/        # TypeScript type definitions
│   └── package.json
├── server/           # Minimal Effect-TS backend
│   ├── src/
│   │   ├── layers/       # Effect-TS service layers
│   │   └── index.ts      # Server entry point
│   └── package.json
└── package.json      # Root workspace configuration
```

## Code Style Guidelines

### TypeScript

- Use TypeScript's strict mode
- Avoid `any` types - use `unknown` if necessary
- Define interfaces for complex objects
- Use type inference when possible

### React/React Native

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and prop names
- Extract reusable logic into custom hooks

### Naming Conventions

- **Files**: PascalCase for components (`SwipeCard.tsx`), camelCase for utilities (`contacts.ts`)
- **Variables**: camelCase (`contactList`, `userId`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Components**: PascalCase (`ContactsList`, `SwipeScreen`)
- **Functions**: camelCase (`loadContacts`, `handleSwipe`)

### Formatting

- 2 spaces for indentation
- Single quotes for strings
- Trailing commas in multi-line objects/arrays
- 100 character line length
- Semicolons required

Prettier handles most formatting automatically.

## Testing

Currently, the project doesn't have a formal test suite. When adding tests:

- Place tests in `__tests__` directories
- Name test files with `.test.ts` or `.test.tsx` extension
- Use descriptive test names
- Test both success and error cases

## Documentation

### Code Comments

- Add comments for complex logic
- Document public APIs and interfaces
- Keep comments up-to-date with code changes
- Use JSDoc format for function documentation

### README Updates

Update the README.md if you:

- Add new features
- Change setup instructions
- Add new dependencies
- Modify configuration

## Privacy and Security

This app is privacy-focused. When contributing:

- **Never** send contact data to external servers
- Keep all personal data on-device
- Follow secure coding practices
- Report security issues privately

## Need Help?

- Check existing issues and documentation
- Open an issue for bugs or feature requests
- Be respectful and constructive in discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
