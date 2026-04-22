# Contributing to Rodrigo

Thanks for taking the time to contribute! Here's everything you need to get started.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Style](#code-style)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Getting Started

1. **Fork** the repository and clone your fork:
   ```sh
   git clone https://github.com/your-username/rodrigo.git
   cd rodrigo
   npm install
   ```

2. Create a feature branch off `main`:
   ```sh
   git checkout -b feat/your-feature-name
   ```

3. Set up your local environment:
   ```sh
   # Copy the keystore template (Android local builds only)
   cp android/keystore.properties.example android/keystore.properties
   ```

4. Start developing and run the app:
   ```sh
   npm start          # Metro bundler
   npm run android    # Android
   npm run ios        # iOS
   ```

---

## Development Workflow

- All work happens on feature branches — never commit directly to `main`
- Keep PRs focused and small — one feature or fix per PR
- Make sure `npm run lint` and `npm test` pass before opening a PR
- The CI workflow will run both automatically on your PR

---

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org):

```
<type>: <short description>
```

| Type | When to use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | Formatting, missing semicolons, etc. |
| `docs` | Documentation only changes |
| `test` | Adding or updating tests |
| `ci` | CI/CD configuration changes |
| `chore` | Build process or tooling changes |

Examples:
```
feat: add dark mode toggle to profile screen
fix: resolve crash on story viewer swipe
docs: update contributing guide
```

---

## Pull Request Guidelines

- Fill in the PR template completely
- Link any related issues with `Closes #123`
- Add screenshots or screen recordings for UI changes
- Keep the PR description clear about *what* changed and *why*
- Request a review — don't merge your own PRs without review

---

## Code Style

- TypeScript strict mode is enabled — no `any` unless absolutely necessary
- ESLint + Prettier are configured — run `npm run lint` to check
- Components go in `src/components/`, screens in `src/screens/`
- Use the centralised theme from `src/theme/theme.ts` — no hardcoded colors or spacing values

---

## Reporting Bugs

Open a [Bug Report issue](../../issues/new?template=bug_report.md) and include:

- Device / OS version
- Steps to reproduce
- Expected vs actual behaviour
- Screenshots if applicable

---

## Suggesting Features

Open a [Feature Request issue](../../issues/new?template=feature_request.md) with:

- A clear description of the problem it solves
- How you'd expect it to work
- Any relevant mockups or references

---

## Security Issues

**Do not open public issues for security vulnerabilities.** See [SECURITY.md](SECURITY.md) for the responsible disclosure process.
