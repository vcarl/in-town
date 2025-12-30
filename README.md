# in-town

A privacy-focused Expo Android app that helps you complete your personal contacts by swiping through them. Uses Effect-TS for a minimal backend ready for authentication.

## Overview

This app helps you maintain a complete personal rolodex by:

1. **Reading contacts from your Android device** - Your contacts never leave your device
2. **Swiping left/right** - Quick decisions on who you'd like to visit
3. **Tracking completeness** - See which contacts are missing key information (birthday, address, phone, email)
4. **Storing locally** - All swipe decisions saved in device storage

The app works **completely offline** for contact management. The backend is minimal, currently just providing health checks and ready for future authentication features.

## Project Structure

```
in-town/
├── server/          # Minimal Effect-TS backend (health check + future auth)
│   ├── src/
│   │   ├── layers/      # Effect-TS service layers (database ready for auth)
│   │   └── index.ts     # Server entry point
│   └── package.json
├── app/             # Expo React Native mobile app (Android-focused)
│   ├── src/
│   │   ├── components/  # SwipeCard component
│   │   ├── screens/     # Swipe and ContactsList screens
│   │   ├── services/    # Device contacts + local storage
│   │   └── types/       # TypeScript types
│   └── package.json
└── package.json     # Root workspace configuration
```

## Features

### Mobile App (Primary Focus)

- **Device Contact Integration** using expo-contacts
- **Swipe Interface** with React Native Gesture Handler and Reanimated
- **Local Storage** via AsyncStorage for swipe decisions
- **Two Screens**:
  - Swipe Screen: Review contacts one by one
  - To Visit Screen: See right-swiped contacts with completeness indicators
- **Completeness Tracking** for:
  - Birthday
  - Home address
  - Phone number
  - Email address

### Backend (Minimal)

- **Health Check** endpoint
- **Kysely Database Layer** ready for future authentication tables
- **Effect-TS** functional programming patterns

## Setup Instructions

### Prerequisites

- Node.js 20+ and npm
- Android Studio with SDK 34 (for Android development)
- Android device or emulator

### Installation

1. **Clone and install**

   ```bash
   cd in-town
   npm install
   ```

2. **Start both server and app**

   ```bash
   npm run dev
   ```

   This starts the backend server on port 3000 and the Expo development server.

3. **Run on Android**
   - Press `a` in the Expo terminal to run on Android emulator
   - Or scan the QR code with Expo Go app on your Android device

### Permissions

The app will request permission to access your contacts on first launch. This is required for the core functionality.

## Development

### Run Commands

```bash
npm run dev          # Start both server and app
npm run dev:server   # Start server only
npm run dev:app      # Start Expo app only
npm run build        # Build server
npm run lint         # Lint all code
npm run typecheck    # Type check all code
npm run format       # Format code with Prettier
npm run clean        # Clean all build artifacts
```

### Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

### Code Quality

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Husky** for pre-commit hooks

Format your code before committing:

```bash
npm run format
```

### Architecture Highlights

**Device-First Design**

- All contact data stays on your Android device
- Swipe decisions stored in AsyncStorage (local to device)
- No contact data sent to server
- Works completely offline

**Minimal Backend**

- Currently just health check endpoint
- Database layer using Kysely, ready for authentication
- Effect-TS for functional composition

## Technology Stack

### Mobile

- **Expo SDK 54** - React Native framework
- **expo-contacts** - Access device contacts
- **AsyncStorage** - Local data persistence
- **React Native Gesture Handler** - Swipe gestures
- **React Native Reanimated** - 60fps animations
- **TypeScript** - Type safety

### Backend

- **Effect-TS** - Functional programming framework
- **Express** - Web server
- **Kysely** - SQL query builder for future migrations
- **SQLite** - Embedded database (for future auth)
- **TypeScript** - Type safety

## Privacy

- ✅ Contact data never leaves your device
- ✅ Swipe decisions stored locally
- ✅ No analytics or tracking
- ✅ Open source

## Troubleshooting

### Dependencies won't install

```bash
# Clean everything and reinstall
npm run clean
npm install
```

### Server won't start

1. Check if port 3000 is already in use:

   ```bash
   lsof -ti:3000 | xargs kill -9  # Unix/Mac
   # Or specify a different port in server/.env
   ```

2. Ensure dependencies are installed:
   ```bash
   npm install
   ```

### Expo app won't start

1. Make sure you have Expo CLI installed:

   ```bash
   npm install -g expo-cli
   ```

2. Clear Expo cache:
   ```bash
   cd app
   npx expo start -c
   ```

### Can't access contacts in the app

Make sure you granted contacts permission in Android settings:

- Settings > Apps > Expo Go (or your app) > Permissions > Contacts

### Type checking errors

If you see TypeScript errors:

```bash
npm run typecheck
```

This will show all type errors across the project.

### Linting errors

To automatically fix many linting issues:

```bash
npm run lint -- --fix  # Fix all workspaces
cd server && npm run lint -- --fix  # Fix server only
cd app && npm run lint -- --fix  # Fix app only
```

### Git hooks not running

Reinitialize husky:

```bash
npx husky install
```

## Future Enhancements

Planned features (not in MVP):

1. User authentication
2. Cloud backup of swipe decisions (opt-in)
3. Contact editing within app
4. Reminder system for visits
5. Notes on contacts

## License

MIT
