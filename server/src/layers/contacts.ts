import { Effect } from 'effect';
import { v4 as uuidv4 } from 'uuid';
import type { DatabaseService } from '../layers/database.js';
import type { Contact, ContactCompleteness } from '../types/database.js';

export interface ContactsService {
  getAllContacts: () => Effect.Effect<Contact[], Error>;
  getContact: (id: string) => Effect.Effect<Contact | null, Error>;
  updateSwipeStatus: (id: string, status: 'left' | 'right') => Effect.Effect<Contact, Error>;
  getSwipedRightContacts: () => Effect.Effect<ContactCompleteness[], Error>;
  createContact: (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'swipe_status'>) => Effect.Effect<Contact, Error>;
}

export const ContactsService = Effect.gen(function* () {
  const { db } = yield* Effect.Tag<DatabaseService>();
  
  const getAllContacts = () =>
    Effect.try({
      try: () => {
        const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all() as Contact[];
        return contacts;
      },
      catch: (error) => new Error(`Failed to fetch contacts: ${error}`)
    });
  
  const getContact = (id: string) =>
    Effect.try({
      try: () => {
        const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id) as Contact | undefined;
        return contact || null;
      },
      catch: (error) => new Error(`Failed to fetch contact: ${error}`)
    });
  
  const updateSwipeStatus = (id: string, status: 'left' | 'right') =>
    Effect.try({
      try: () => {
        const stmt = db.prepare(`
          UPDATE contacts 
          SET swipe_status = ?, updated_at = datetime('now')
          WHERE id = ?
        `);
        stmt.run(status, id);
        
        const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id) as Contact;
        if (!contact) {
          throw new Error('Contact not found after update');
        }
        return contact;
      },
      catch: (error) => new Error(`Failed to update swipe status: ${error}`)
    });
  
  const calculateCompleteness = (contact: Contact): ContactCompleteness => {
    const hasBirthday = !!contact.birthday;
    const hasAddress = !!contact.address;
    const hasRelationship = !!contact.relationship;
    const hasSocials = !!(contact.instagram || contact.twitter || contact.facebook);
    
    const fields = [hasBirthday, hasAddress, hasRelationship, hasSocials];
    const completedFields = fields.filter(Boolean).length;
    const completenessPercentage = (completedFields / fields.length) * 100;
    
    const missingFields: string[] = [];
    if (!hasBirthday) missingFields.push('birthday');
    if (!hasAddress) missingFields.push('address');
    if (!hasRelationship) missingFields.push('relationship');
    if (!hasSocials) missingFields.push('socials');
    
    return {
      id: contact.id,
      name: contact.name,
      hasBirthday,
      hasAddress,
      hasRelationship,
      hasSocials,
      completenessPercentage,
      missingFields
    };
  };
  
  const getSwipedRightContacts = () =>
    Effect.try({
      try: () => {
        const contacts = db.prepare(
          "SELECT * FROM contacts WHERE swipe_status = 'right' ORDER BY updated_at DESC"
        ).all() as Contact[];
        
        return contacts.map(calculateCompleteness);
      },
      catch: (error) => new Error(`Failed to fetch swiped right contacts: ${error}`)
    });
  
  const createContact = (contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'swipe_status'>) =>
    Effect.try({
      try: () => {
        const id = uuidv4();
        const stmt = db.prepare(`
          INSERT INTO contacts (
            id, name, birthday, address, relationship, phone, email, 
            instagram, twitter, facebook, swipe_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `);
        
        stmt.run(
          id,
          contactData.name,
          contactData.birthday,
          contactData.address,
          contactData.relationship,
          contactData.phone,
          contactData.email,
          contactData.instagram,
          contactData.twitter,
          contactData.facebook
        );
        
        const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id) as Contact;
        return contact;
      },
      catch: (error) => new Error(`Failed to create contact: ${error}`)
    });
  
  return {
    getAllContacts,
    getContact,
    updateSwipeStatus,
    getSwipedRightContacts,
    createContact
  } as const;
});
