import { Router, Request, Response } from 'express';
import { Effect } from 'effect';
import type { Contact } from '../types/database.js';

export interface ContactsService {
  getAllContacts: () => Effect.Effect<Contact[], Error>;
  getContact: (id: string) => Effect.Effect<Contact | null, Error>;
  updateSwipeStatus: (id: string, status: 'left' | 'right') => Effect.Effect<Contact, Error>;
  getSwipedRightContacts: () => Effect.Effect<any[], Error>;
  createContact: (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'swipe_status'>) => Effect.Effect<Contact, Error>;
}

export const createContactsRouter = (contactsService: ContactsService) => {
  const router = Router();
  
  /**
   * @openapi
   * /contacts:
   *   get:
   *     summary: Get all contacts
   *     description: Retrieve all contacts in the system
   *     responses:
   *       200:
   *         description: List of contacts
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Contact'
   */
  router.get('/', async (req: Request, res: Response) => {
    const program = contactsService.getAllContacts();
    
    const result = await Effect.runPromise(
      Effect.either(program)
    );
    
    if (result._tag === 'Left') {
      res.status(500).json({ error: result.left.message });
    } else {
      res.json(result.right);
    }
  });
  
  /**
   * @openapi
   * /contacts/swiped-right:
   *   get:
   *     summary: Get all right-swiped contacts with completeness status
   *     description: Retrieve contacts that have been swiped right along with their profile completeness
   *     responses:
   *       200:
   *         description: List of right-swiped contacts with completeness info
   */
  router.get('/swiped-right/list', async (req: Request, res: Response) => {
    const program = contactsService.getSwipedRightContacts();
    
    const result = await Effect.runPromise(
      Effect.either(program)
    );
    
    if (result._tag === 'Left') {
      res.status(500).json({ error: result.left.message });
    } else {
      res.json(result.right);
    }
  });
  
  /**
   * @openapi
   * /contacts/{id}:
   *   get:
   *     summary: Get a contact by ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Contact details
   *       404:
   *         description: Contact not found
   */
  router.get('/:id', async (req: Request, res: Response) => {
    const program = contactsService.getContact(req.params.id);
    
    const result = await Effect.runPromise(
      Effect.either(program)
    );
    
    if (result._tag === 'Left') {
      res.status(500).json({ error: result.left.message });
    } else if (result.right === null) {
      res.status(404).json({ error: 'Contact not found' });
    } else {
      res.json(result.right);
    }
  });
  
  /**
   * @openapi
   * /contacts:
   *   post:
   *     summary: Create a new contact
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *               birthday:
   *                 type: string
   *                 format: date
   *               address:
   *                 type: string
   *               relationship:
   *                 type: string
   *               phone:
   *                 type: string
   *               email:
   *                 type: string
   *               instagram:
   *                 type: string
   *               twitter:
   *                 type: string
   *               facebook:
   *                 type: string
   *     responses:
   *       201:
   *         description: Contact created
   */
  router.post('/', async (req: Request, res: Response) => {
    const contactData = req.body as Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'swipe_status'>;
    
    if (!contactData.name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    
    const program = contactsService.createContact(contactData);
    
    const result = await Effect.runPromise(
      Effect.either(program)
    );
    
    if (result._tag === 'Left') {
      res.status(500).json({ error: result.left.message });
    } else {
      res.status(201).json(result.right);
    }
  });
  
  /**
   * @openapi
   * /contacts/{id}/swipe:
   *   put:
   *     summary: Update contact swipe status
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - status
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [left, right]
   *     responses:
   *       200:
   *         description: Swipe status updated
   */
  router.put('/:id/swipe', async (req: Request, res: Response) => {
    const { status } = req.body;
    
    if (status !== 'left' && status !== 'right') {
      res.status(400).json({ error: 'Status must be "left" or "right"' });
      return;
    }
    
    const program = contactsService.updateSwipeStatus(req.params.id, status);
    
    const result = await Effect.runPromise(
      Effect.either(program)
    );
    
    if (result._tag === 'Left') {
      res.status(500).json({ error: result.left.message });
    } else {
      res.json(result.right);
    }
  });
  
  return router;
};
