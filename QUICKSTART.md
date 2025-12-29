# Quick Start Guide

## Prerequisites
- Node.js 20+ and npm
- Android device or emulator

## Setup (2 minutes)

### 1. Install Dependencies
```bash
cd in-town
npm install
```

### 2. Start Everything
```bash
npm run dev
```
This starts both the backend server (port 3000) and Expo development server.

### 3. Run on Android
Press `a` in the Expo terminal to open in Android emulator, or scan the QR code with Expo Go on your Android device.

### 4. Grant Permissions
On first launch, the app will request permission to access your contacts. Grant this permission to use the app.

## Usage

### Swipe Screen
- **Swipe left**: Not interested in visiting this person
- **Swipe right**: Would like to visit this person
- Progress through all your device contacts

### To Visit Screen
- View all contacts you swiped right on
- See profile completeness percentage
- Check which information is missing:
  - ✅ Birthday
  - ✅ Address  
  - ✅ Phone
  - ✅ Email

## Data Storage

- **Contacts**: Read from your Android device (never uploaded)
- **Swipe decisions**: Stored locally in AsyncStorage on your device
- **Privacy**: All data stays on your device

## Troubleshooting

### Can't access contacts
Make sure you granted contacts permission in Android settings:
Settings > Apps > Expo Go > Permissions > Contacts

### Server won't start
Check if port 3000 is already in use:
```bash
lsof -ti:3000 | xargs kill -9
```

## Development

### Run individual components
```bash
npm run dev:server  # Backend only
npm run dev:app     # Expo app only
```

### Type checking
```bash
npm run typecheck
```

### Lint code
```bash
npm run lint
```
