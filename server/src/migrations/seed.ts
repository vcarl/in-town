import { Effect } from 'effect';
import { DatabaseServiceLive } from '../layers/database.js';
import { ContactsService } from '../layers/contacts.js';

const sampleContacts = [
  {
    name: 'Alice Johnson',
    birthday: '1990-05-15',
    address: '123 Main St, New York, NY 10001',
    relationship: 'Friend',
    phone: '+1-555-0101',
    email: 'alice@example.com',
    instagram: '@alicejohnson',
    twitter: null,
    facebook: null
  },
  {
    name: 'Bob Smith',
    birthday: '1985-08-22',
    address: null,
    relationship: 'Colleague',
    phone: '+1-555-0102',
    email: 'bob@example.com',
    instagram: null,
    twitter: '@bobsmith',
    facebook: null
  },
  {
    name: 'Charlie Brown',
    birthday: null,
    address: '456 Oak Ave, Brooklyn, NY 11201',
    relationship: 'Family',
    phone: null,
    email: null,
    instagram: null,
    twitter: null,
    facebook: 'charlie.brown'
  },
  {
    name: 'Diana Prince',
    birthday: '1992-12-03',
    address: '789 Elm St, Queens, NY 11354',
    relationship: 'Friend',
    phone: '+1-555-0104',
    email: 'diana@example.com',
    instagram: '@dianaprince',
    twitter: '@wonderdiana',
    facebook: 'diana.prince'
  },
  {
    name: 'Ethan Hunt',
    birthday: null,
    address: null,
    relationship: 'Acquaintance',
    phone: '+1-555-0105',
    email: null,
    instagram: null,
    twitter: null,
    facebook: null
  }
];

const seedProgram = Effect.gen(function* () {
  console.log('Starting database seed...');
  
  const contactsService = yield* ContactsService;
  
  // Check if contacts already exist
  const existingContacts = yield* contactsService.getAllContacts();
  
  if (existingContacts.length > 0) {
    console.log(`\n⚠️  Database already contains ${existingContacts.length} contacts`);
    console.log('Skipping seed to avoid duplicates. Delete the database file to reseed.');
    return;
  }
  
  for (const contact of sampleContacts) {
    yield* contactsService.createContact(contact);
    console.log(`✓ Created contact: ${contact.name}`);
  }
  
  console.log('\n✨ Seed completed successfully!');
  console.log(`Created ${sampleContacts.length} sample contacts`);
});

const program = Effect.provide(seedProgram, DatabaseServiceLive);

Effect.runPromise(program).catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
