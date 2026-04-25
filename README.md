# Rodrigo

A mobile-first social platform built with React Native, designed for our university campus.

[![React Native](https://img.shields.io/badge/React%20Native-0.85.1-61DAFB?style=flat-square&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.11.0-brightgreen?style=flat-square&logo=node.js)](https://nodejs.org)

---

## Table of Contents

- [Motivation](#motivation)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Design System](#design-system)
- [Privacy & Ethics](#privacy--ethics)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## Motivation

Our campus is a busy, fragmented place. Students across different departments rarely interact, clubs struggle to reach people outside their immediate circle, and important announcements get buried or missed entirely. Most people have no idea what events, workshops, or competitions are happening — let alone how to get involved.

Rodrigo was built to fix that. It is a single place where students can post, share, and talk across the entire campus — not just within their department or friend group. The Chronicle feed surfaces official updates, club activities, fests, and alerts in a structured timeline so nothing slips through. The Aura system rewards genuine participation, giving visibility to people who contribute to the community rather than just consume it.

Starting here, with one university. Where it goes from there, we will see.

---

## Features

| Feature | Description |
|---|---|
| Aura System | A reputation score that rises and falls with community engagement. Posts, comments, and interactions all contribute. |
| Feed | Scrollable post feed with animated up/down voting, comment sheets, bookmarking, and sharing. |
| Stories | Horizontal story rings with unread indicators and a full-screen story viewer. |
| Reels | Short-form vertical video feed. |
| Chronicle | A timeline-style board for official announcements, events, competitions, and alerts — with optional Aura bonus rewards. |
| Profile | Customisable gradient profile themes, post grid, follower/following stats, and bio. |
| Custom Tab Bar | Fully custom bottom navigation with smooth transitions. |
| Dark-first Design | Deep background with a lavender, cyan, and gold accent palette and glassmorphic card surfaces. |

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React Native 0.85 |
| Language | TypeScript 5.8 |
| Navigation | React Navigation 7 (Stack + Bottom Tabs) |
| Animations | React Native Reanimated 4 + Worklets |
| Gestures | React Native Gesture Handler 2 |
| Icons | Phosphor React Native |
| Gradients | React Native Linear Gradient |
| Blur | @react-native-community/blur |
| SVG | React Native SVG |
| Safe Area | React Native Safe Area Context |

---

## Project Structure

```
src/
├── components/       # Reusable UI components (PostCard, StoryRing, AuraBadge, CommentSheet)
├── data/             # Mock database and TypeScript type definitions
├── navigation/       # Stack + Tab navigators, custom tab bar
├── screens/          # HomeScreen, ExploreScreen, ReelsScreen, UpdatesScreen, ProfileScreen, StoryViewerScreen
└── theme/            # Centralised design tokens (colors, typography, spacing, radii)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 22.11.0
- A configured [React Native environment](https://reactnative.dev/docs/set-up-your-environment) for Android and/or iOS
- For iOS: Ruby and CocoaPods

### Installation

```sh
git clone https://github.com/your-username/rodrigo.git
cd rodrigo
npm install
```

For iOS, install native dependencies:

```sh
bundle install
bundle exec pod install
```

### Running the App

Start the Metro bundler:

```sh
npm start
```

Then, in a separate terminal, run on your target platform:

```sh
# Android
npm run android

# iOS
npm run ios
```

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Metro dev server |
| `npm run android` | Build and run on Android |
| `npm run ios` | Build and run on iOS |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Jest test suite |

---

## Design System

All design tokens live in `src/theme/theme.ts` and are imported across the app. Avoid hardcoding colors, spacing, or typography values outside of this file.

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#B392F0` | Interactive elements, active states |
| `secondary` | `#F2C94C` | Highlights |
| `accent` | `#00F0FF` | Aura indicators, verified badges |
| `background` | `#0D0E15` | App background |
| `surface` | `#161824` | Card and sheet backgrounds |
| `surfaceLight` | `#222536` | Elevated surfaces, pill buttons |

---

## Privacy & Ethics

Rodrigo is built privacy-first. This is not a policy checkbox — it is a core design principle that shapes every feature and technical decision.

**What this means in practice:**

- **Minimal data collection.** We only collect what is strictly necessary for the platform to function. No silent tracking, no behavioural profiling, no selling or sharing of user data with third parties.
- **Transparency.** Users are always informed about what data is collected, why it is collected, and how long it is retained. No dark patterns, no buried consent flows.
- **User control.** Users can view, export, and delete their data at any time. Account deletion is permanent and complete.
- **Safe by default.** Privacy-protective settings are the default, not an opt-in. Users should not have to dig through settings to protect themselves.
- **Online safety.** The platform is designed to be a safe space for students. Harassment, hate speech, and harmful content are not tolerated. Reporting and moderation tools are a first-class feature, not an afterthought.
- **Ethical design.** We do not use manipulative engagement mechanics — no infinite scroll traps, no notification spam engineered to maximise time-on-app at the expense of wellbeing. The Aura system rewards genuine contribution, not addictive behaviour.
- **No dark patterns.** Interfaces are honest. Buttons do what they say. Consent is informed and freely given.

**For contributors:** Any feature that touches user data, content moderation, or engagement mechanics must be reviewed against these principles before merging. If you are unsure whether something aligns, open a discussion first.

---

## Roadmap

The next major milestone is an open-source theme marketplace for profile pages. Instead of the generic, identical profiles you get on platforms like Instagram or Facebook, users will be able to install, share, and publish custom profile themes — built by the community, for the community. Developers will be able to contribute themes directly to the marketplace as open-source packages.

---

## Contributing

Contributions are welcome. Please open an issue first to discuss the change you have in mind, then submit a pull request against `main`.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org): `git commit -m 'feat: add your feature'`
4. Push the branch and open a pull request

Please make sure your code passes linting and tests before submitting:

```sh
npm run lint
npm test
```

---

## Security

To report a security vulnerability, please refer to [SECURITY.md](SECURITY.md). Do not open a public issue for security-related matters.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
