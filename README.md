# in-town

An Effect-TS based REST API service paired with an Expo Android app for managing contacts with swipe functionality.

## Overview

This MVP allows you to swipe left/right on contacts to indicate whether you would visit them. Contacts that are swiped right are collected into a list and checked for profile completeness (birthday, address, relationship details, socials, etc.).

## Project Structure

```
in-town/
├── server/          # Effect-TS backend with OpenAPI REST API
│   ├── src/
│   │   ├── api/         # API route handlers
│   │   ├── layers/      # Effect-TS service layers
│   │   ├── migrations/  # Database setup and seeds
│   │   └── types/       # TypeScript type definitions
│   └── package.json
├── app/             # Expo React Native mobile app
│   ├── src/
│   │   ├── components/  # Reusable UI components (SwipeCard)
│   │   ├── screens/     # App screens (Swipe, ContactsList)
│   │   ├── services/    # API client
│   │   └── types/       # TypeScript types
│   └── package.json
└── package.json     # Root workspace configuration
```

## Features

### Backend (Effect-TS + OpenAPI)
- **Effect-TS** for functional programming with composable services
- **SQLite** database for contact storage
- **OpenAPI** documentation available at `/openapi.json`
- RESTful API endpoints:
  - `GET /api/contacts` - Fetch all contacts
  - `GET /api/contacts/:id` - Get specific contact
  - `POST /api/contacts` - Create new contact
  - `PUT /api/contacts/:id/swipe` - Update swipe status (left/right)
  - `GET /api/contacts/swiped-right/list` - Get right-swiped contacts with completeness

### Mobile App (Expo + React Native)
- **Swipe functionality** using React Native Gesture Handler and Reanimated
- **Two screens**:
  - Swipe Screen: Swipe left (nope) or right (would visit) on contacts
  - To Visit Screen: View right-swiped contacts with completeness indicators
- **Completeness tracking** for:
  - Birthday
  - Home address
  - Relationship details
  - Social media profiles (Instagram, Twitter, Facebook)

## Setup Instructions

### Prerequisites
- Node.js 20+ and npm
- For Android development: Android Studio with SDK

### Installation

1. **Clone the repository**
   ```bash
   cd in-town
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the server**
   ```bash
   cd server
   npm install
   ```

4. **Initialize the database with sample data**
   ```bash
   npm run db:migrate
   ```
   This will create the SQLite database and seed it with 5 sample contacts.

5. **Set up the mobile app**
   ```bash
   cd ../app
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on http://localhost:3000

2. **In a new terminal, start the Expo app**
   ```bash
   cd app
   npm start
   ```

3. **Run on Android**
   - Press `a` in the Expo terminal to run on Android emulator
   - Or scan the QR code with Expo Go app on your Android device
   - Note: If using a physical device, update the API URL in `app/src/services/api.ts` to your computer's IP address

## API Documentation

Access the OpenAPI documentation at: http://localhost:3000/openapi.json

### Example API Calls

```bash
# Get all contacts
curl http://localhost:3000/api/contacts

# Swipe right on a contact
curl -X PUT http://localhost:3000/api/contacts/{id}/swipe \
  -H "Content-Type: application/json" \
  -d '{"status": "right"}'

# Get all right-swiped contacts with completeness info
curl http://localhost:3000/api/contacts/swiped-right/list
```

## Development

### Server Development
```bash
cd server
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm run test       # Run tests
npm run typecheck  # Type checking
```

### App Development
```bash
cd app
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run lint       # Lint code
npm run typecheck  # Type checking
```

## Technology Stack

### Backend
- **Effect-TS** - Functional programming framework
- **Express** - Web server
- **SQLite** (better-sqlite3) - Database
- **TypeScript** - Type safety
- **Kysely** - SQL query builder

### Mobile
- **Expo** - React Native framework
- **React Native Gesture Handler** - Gesture system
- **React Native Reanimated** - Animation library
- **TypeScript** - Type safety
- **Axios** - HTTP client

## License

MIT