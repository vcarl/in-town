import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Effect } from 'effect';
import { DatabaseServiceLive } from './layers/database.js';
import { ContactsService } from './layers/contacts.js';
import { createContactsRouter } from './api/contacts.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// OpenAPI documentation endpoint
app.get('/openapi.json', (_req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'In-Town Contacts API',
      version: '1.0.0',
      description: 'API for managing contacts with swipe functionality'
    },
    paths: {
      '/api/contacts': {
        get: {
          summary: 'Get all contacts',
          responses: {
            '200': {
              description: 'List of contacts'
            }
          }
        },
        post: {
          summary: 'Create a new contact',
          responses: {
            '201': {
              description: 'Contact created'
            }
          }
        }
      },
      '/api/contacts/{id}': {
        get: {
          summary: 'Get a contact by ID',
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }],
          responses: {
            '200': {
              description: 'Contact details'
            }
          }
        }
      },
      '/api/contacts/{id}/swipe': {
        put: {
          summary: 'Update contact swipe status',
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['left', 'right']
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Swipe status updated'
            }
          }
        }
      },
      '/api/contacts/swiped-right/list': {
        get: {
          summary: 'Get right-swiped contacts with completeness',
          responses: {
            '200': {
              description: 'List of right-swiped contacts'
            }
          }
        }
      }
    }
  });
});

// Initialize Effect-TS layers and start server
const main = Effect.gen(function* () {
  console.log('Initializing services...');
  
  const contactsService = yield* ContactsService;
  
  // Set up API routes
  app.use('/api/contacts', createContactsRouter(contactsService));
  
  // Start server
  yield* Effect.promise(() => {
    return new Promise<void>((resolve) => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📖 API documentation: http://localhost:${PORT}/openapi.json`);
        console.log(`❤️  Health check: http://localhost:${PORT}/health`);
        resolve();
      });
    });
  });
});

// Run the program
const program = Effect.provide(main, DatabaseServiceLive);

Effect.runPromise(program).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
