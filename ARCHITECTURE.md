# In-Town Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        In-Town MVP System                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐                    ┌──────────────────────┐
│   Expo Mobile App    │◄──── REST API ────►│   Backend Server     │
│   (React Native)     │      (HTTP/JSON)   │   (Effect-TS)        │
└──────────────────────┘                    └──────────────────────┘
         │                                             │
         │                                             │
         ▼                                             ▼
┌──────────────────────┐                    ┌──────────────────────┐
│  React Native        │                    │  SQLite Database     │
│  Components          │                    │  (contacts.db)       │
│  • SwipeCard         │                    │                      │
│  • SwipeScreen       │                    │  Table: contacts     │
│  • ContactsList      │                    │  - id (UUID)         │
└──────────────────────┘                    │  - name              │
         │                                  │  - birthday          │
         │                                  │  - address           │
         ▼                                  │  - relationship      │
┌──────────────────────┐                    │  - socials           │
│  Gesture Handler &   │                    │  - swipe_status      │
│  Reanimated          │                    │  - timestamps        │
│  (60fps animations)  │                    └──────────────────────┘
└──────────────────────┘
```

## Backend Architecture (Effect-TS)

```
┌────────────────────────────────────────────────────────────────┐
│                      Express Web Server                         │
│                    (CORS, Helmet, JSON)                         │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                        API Routes                               │
│  GET    /api/contacts              - List all                  │
│  GET    /api/contacts/:id          - Get one                   │
│  POST   /api/contacts              - Create                    │
│  PUT    /api/contacts/:id/swipe    - Update swipe             │
│  GET    /api/contacts/swiped-right/list - Right-swiped        │
│  GET    /health                     - Health check             │
│  GET    /openapi.json              - API docs                  │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                   Effect-TS Service Layer                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              ContactsService (Business Logic)            │ │
│  │  • getAllContacts()                                      │ │
│  │  • getContact(id)                                        │ │
│  │  • createContact(data)                                   │ │
│  │  • updateSwipeStatus(id, status)                        │ │
│  │  • getSwipedRightContacts()                             │ │
│  │  • calculateCompleteness(contact) → ContactCompleteness │ │
│  └──────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │         DatabaseService (Data Access Layer)              │ │
│  │  • SQLite connection                                     │ │
│  │  • Schema initialization                                 │ │
│  │  • Transaction management                                │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ SQLite Database │
                    │  (File-based)   │
                    └─────────────────┘
```

## Mobile App Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         App.tsx                                 │
│                   (Tab Navigation)                              │
└────────────────────────────────────────────────────────────────┘
                    │                    │
          ┌─────────┴────────┐  ┌────────┴──────────┐
          │                  │  │                    │
          ▼                  │  ▼                    │
┌──────────────────┐         │  ┌──────────────────┐│
│  SwipeScreen     │         │  │ ContactsListScreen││
│                  │         │  │                    ││
│  ┌────────────┐  │         │  │  ┌─────────────┐ ││
│  │ SwipeCard  │  │         │  │  │ FlatList    │ ││
│  │            │  │         │  │  │             │ ││
│  │ • Name     │  │         │  │  │ • Contact   │ ││
│  │ • Details  │  │         │  │  │ • Complete% │ ││
│  │ • Gesture  │  │         │  │  │ • Status    │ ││
│  │ • Anim     │  │         │  │  └─────────────┘ ││
│  └────────────┘  │         │  └──────────────────┘│
└──────────────────┘         │                       │
          │                  │           │           │
          └──────────────────┼───────────┘           │
                             │                       │
                             ▼                       │
                  ┌──────────────────┐               │
                  │  API Service     │               │
                  │  (Axios)         │               │
                  │                  │◄──────────────┘
                  │  • contactsApi   │
                  │  • Error handler │
                  │  • Base URL      │
                  └──────────────────┘
```

## Data Flow: Swipe Right Action

```
1. User swipes right on contact card
   │
   ▼
2. SwipeCard detects gesture completion
   │
   ▼
3. Calls onSwipeRight(contact)
   │
   ▼
4. SwipeScreen calls API:
   PUT /api/contacts/{id}/swipe
   Body: {"status": "right"}
   │
   ▼
5. Express routes to ContactsRouter
   │
   ▼
6. ContactsService.updateSwipeStatus()
   │
   ▼
7. DatabaseService executes SQL:
   UPDATE contacts 
   SET swipe_status = 'right',
       updated_at = now()
   WHERE id = ?
   │
   ▼
8. Returns updated contact
   │
   ▼
9. SwipeScreen updates local state
   │
   ▼
10. Shows next contact or completion screen
```

## Data Flow: View Completeness

```
1. User taps "To Visit" tab
   │
   ▼
2. ContactsListScreen calls API:
   GET /api/contacts/swiped-right/list
   │
   ▼
3. ContactsService.getSwipedRightContacts()
   │
   ▼
4. Queries database for swipe_status='right'
   │
   ▼
5. For each contact, calculates:
   • hasBirthday: birthday IS NOT NULL
   • hasAddress: address IS NOT NULL
   • hasRelationship: relationship IS NOT NULL
   • hasSocials: (instagram OR twitter OR facebook) IS NOT NULL
   • completenessPercentage: (completed / 4) * 100
   • missingFields: array of missing field names
   │
   ▼
6. Returns array of ContactCompleteness objects
   │
   ▼
7. ContactsListScreen renders FlatList
   │
   ▼
8. Each item shows:
   • Name
   • Completeness percentage
   • Status icons (✅/⭕)
   • Missing fields list
```

## Effect-TS Layer Composition

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│  (Express HTTP handlers, routes, middleware)            │
└─────────────────────────────────────────────────────────┘
                          │
                          │ depends on
                          ▼
┌─────────────────────────────────────────────────────────┐
│               ContactsService Layer                      │
│  (Business logic, validation, orchestration)            │
└─────────────────────────────────────────────────────────┘
                          │
                          │ depends on
                          ▼
┌─────────────────────────────────────────────────────────┐
│              DatabaseService Layer                       │
│  (Data access, connection management)                   │
└─────────────────────────────────────────────────────────┘
                          │
                          │ manages
                          ▼
                  ┌───────────────┐
                  │   SQLite DB   │
                  └───────────────┘

Effect.provide(
  ContactsService,
  DatabaseServiceLive
)
```

## Type System Flow

```
TypeScript Types (Shared)
├── Contact
│   ├── id: string
│   ├── name: string
│   ├── birthday: string | null
│   ├── address: string | null
│   ├── relationship: string | null
│   ├── phone: string | null
│   ├── email: string | null
│   ├── instagram: string | null
│   ├── twitter: string | null
│   ├── facebook: string | null
│   ├── swipe_status: 'pending' | 'left' | 'right'
│   ├── created_at: string
│   └── updated_at: string
│
└── ContactCompleteness
    ├── id: string
    ├── name: string
    ├── hasBirthday: boolean
    ├── hasAddress: boolean
    ├── hasRelationship: boolean
    ├── hasSocials: boolean
    ├── completenessPercentage: number
    └── missingFields: string[]

These types are:
1. Defined in server/src/types/database.ts
2. Duplicated in app/src/types/contact.ts
3. Enforced at compile time
4. Validated at runtime (API boundaries)
```

## Deployment Architecture (Future)

```
┌─────────────────┐         ┌──────────────────┐
│  Expo EAS       │         │   Cloud Server   │
│  (Android APK)  │◄────────┤   (API + DB)     │
└─────────────────┘   API   └──────────────────┘
                      calls           │
                                      │
                              ┌───────┴────────┐
                              │  PostgreSQL    │
                              │  or similar    │
                              └────────────────┘
```

## Security Architecture

```
Mobile App
   │
   │ HTTPS (TLS 1.3)
   │ API Key (future)
   │
   ▼
Backend Server
   │
   ├─► CORS (configured origins)
   ├─► Helmet (security headers)
   ├─► Rate Limiting (future)
   │
   ▼
Database
   │
   ├─► Prepared Statements (SQL injection prevention)
   ├─► Input Validation (TypeScript types)
   └─► File permissions (SQLite)
```

## Key Architectural Decisions

### Why Effect-TS?
- Functional programming patterns
- Composable services via Context.Tag
- Type-safe error handling
- Dependency injection
- Testability

### Why SQLite?
- Zero configuration
- File-based (easy backup)
- Good performance for MVP
- Can migrate to PostgreSQL later

### Why Expo?
- Fast development
- Built-in tooling
- Easy Android deployment
- Cross-platform ready (iOS future)

### Why Monorepo?
- Shared types
- Single version control
- Coordinated releases
- Simplified dependency management

## Performance Considerations

### Backend
- Database queries use indexes
- Prepared statements (cached)
- Minimal middleware stack
- No ORMs (direct SQL for speed)

### Mobile
- 60fps animations (Reanimated)
- Optimized re-renders (React.memo potential)
- Lazy loading (future pagination)
- Image optimization (future)

## Testing Strategy

```
Unit Tests
├── Service layer logic
├── Completeness calculation
├── Database operations
└── Type safety

Integration Tests (Future)
├── API endpoint flows
├── Error handling
└── Authentication

E2E Tests (Future)
├── Swipe workflow
├── List viewing
└── Data persistence
```
