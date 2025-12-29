import { describe, it, expect, beforeAll } from 'vitest';
import { Effect } from 'effect';
import { DatabaseServiceLive } from '../layers/database.js';
import { ContactsService } from '../layers/contacts.js';

describe('Contacts Service', () => {
  let service: any;
  
  beforeAll(async () => {
    // Set up test database
    process.env.DATABASE_PATH = ':memory:';
    
    const program = Effect.gen(function* () {
      return yield* ContactsService;
    });
    
    service = await Effect.runPromise(
      Effect.provide(program, DatabaseServiceLive)
    );
  });
  
  it('should create a contact', async () => {
    const contactData = {
      name: 'Test User',
      birthday: '1990-01-01',
      address: '123 Test St',
      relationship: 'Friend',
      phone: '+1-555-0100',
      email: 'test@example.com',
      instagram: '@testuser',
      twitter: null,
      facebook: null
    };
    
    const result = await Effect.runPromise(
      service.createContact(contactData)
    );
    
    expect(result.name).toBe('Test User');
    expect(result.swipe_status).toBe('pending');
    expect(result.id).toBeDefined();
  });
  
  it('should get all contacts', async () => {
    const result = await Effect.runPromise(
      service.getAllContacts()
    );
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
  
  it('should update swipe status', async () => {
    // First create a contact
    const contact = await Effect.runPromise(
      service.createContact({
        name: 'Swipe Test',
        birthday: null,
        address: null,
        relationship: null,
        phone: null,
        email: null,
        instagram: null,
        twitter: null,
        facebook: null
      })
    );
    
    // Then update swipe status
    const result = await Effect.runPromise(
      service.updateSwipeStatus(contact.id, 'right')
    );
    
    expect(result.swipe_status).toBe('right');
  });
  
  it('should get swiped right contacts with completeness', async () => {
    // Create a contact with full details
    const fullContact = await Effect.runPromise(
      service.createContact({
        name: 'Complete Contact',
        birthday: '1990-01-01',
        address: '123 Test St',
        relationship: 'Friend',
        phone: '+1-555-0101',
        email: 'complete@example.com',
        instagram: '@complete',
        twitter: null,
        facebook: null
      })
    );
    
    // Swipe right
    await Effect.runPromise(
      service.updateSwipeStatus(fullContact.id, 'right')
    );
    
    // Get swiped right contacts
    const result = await Effect.runPromise(
      service.getSwipedRightContacts()
    );
    
    const contact = result.find(c => c.id === fullContact.id);
    expect(contact).toBeDefined();
    expect(contact?.hasBirthday).toBe(true);
    expect(contact?.hasAddress).toBe(true);
    expect(contact?.hasRelationship).toBe(true);
    expect(contact?.hasSocials).toBe(true);
    expect(contact?.completenessPercentage).toBe(100);
  });
  
  it('should calculate partial completeness', async () => {
    // Create a contact with partial details
    const partialContact = await Effect.runPromise(
      service.createContact({
        name: 'Partial Contact',
        birthday: '1990-01-01',
        address: null,
        relationship: 'Friend',
        phone: null,
        email: null,
        instagram: null,
        twitter: null,
        facebook: null
      })
    );
    
    // Swipe right
    await Effect.runPromise(
      service.updateSwipeStatus(partialContact.id, 'right')
    );
    
    // Get swiped right contacts
    const result = await Effect.runPromise(
      service.getSwipedRightContacts()
    );
    
    const contact = result.find(c => c.id === partialContact.id);
    expect(contact).toBeDefined();
    expect(contact?.hasBirthday).toBe(true);
    expect(contact?.hasAddress).toBe(false);
    expect(contact?.hasRelationship).toBe(true);
    expect(contact?.hasSocials).toBe(false);
    expect(contact?.completenessPercentage).toBe(50);
    expect(contact?.missingFields).toEqual(['address', 'socials']);
  });
});
