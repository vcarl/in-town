# Quick Start Guide

## Prerequisites
- Node.js 20+ and npm
- For Android: Android Studio with SDK 34

## Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend
```bash
cd server
npm run dev
```
The server will start on http://localhost:3000

### 3. Seed the Database
In a new terminal:
```bash
cd server
npx tsx src/migrations/seed.ts
```
This creates 5 sample contacts.

### 4. Test the API
```bash
curl http://localhost:3000/api/contacts
```

### 5. Start the Mobile App
In a new terminal:
```bash
cd app
npm start
```

Press `a` to open in Android emulator, or scan the QR code with Expo Go on your Android device.

## Usage

### Swipe Screen
- **Swipe left**: Not interested in visiting this person
- **Swipe right**: Would like to visit this person
- Progress through all contacts

### To Visit Screen
- View all contacts you swiped right on
- See profile completeness percentage
- Check which information is missing:
  - ✅ Birthday
  - ✅ Address  
  - ✅ Relationship
  - ✅ Socials (Instagram/Twitter/Facebook)

## API Endpoints

```bash
# Get all contacts
GET http://localhost:3000/api/contacts

# Get a specific contact
GET http://localhost:3000/api/contacts/:id

# Create a new contact
POST http://localhost:3000/api/contacts
Content-Type: application/json
{
  "name": "John Doe",
  "birthday": "1990-01-01",
  "address": "123 Main St",
  "relationship": "Friend",
  "phone": "+1-555-0100",
  "email": "john@example.com",
  "instagram": "@johndoe",
  "twitter": null,
  "facebook": null
}

# Update swipe status
PUT http://localhost:3000/api/contacts/:id/swipe
Content-Type: application/json
{"status": "right"}  # or "left"

# Get right-swiped contacts with completeness
GET http://localhost:3000/api/contacts/swiped-right/list
```

## Troubleshooting

### Can't connect from physical device
Update the API URL in `app/src/services/api.ts` to use your computer's IP:
```typescript
const API_BASE_URL = 'http://192.168.1.x:3000/api';
```

### Port already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Reset database
```bash
rm -f server/data/contacts.db
cd server && npx tsx src/migrations/seed.ts
```

## Development

### Run tests
```bash
cd server
npm test
```

### Type checking
```bash
npm run typecheck
```

### Lint code
```bash
npm run lint
```
