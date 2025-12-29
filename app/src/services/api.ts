import axios from 'axios';
import type { Contact, ContactCompleteness } from '../types/contact';

// Use your server URL - update this when deploying
const API_BASE_URL = 'http://localhost:3000/api';

export const contactsApi = {
  getAllContacts: async (): Promise<Contact[]> => {
    const response = await axios.get(`${API_BASE_URL}/contacts`);
    return response.data;
  },
  
  getContact: async (id: string): Promise<Contact> => {
    const response = await axios.get(`${API_BASE_URL}/contacts/${id}`);
    return response.data;
  },
  
  updateSwipeStatus: async (id: string, status: 'left' | 'right'): Promise<Contact> => {
    const response = await axios.put(`${API_BASE_URL}/contacts/${id}/swipe`, { status });
    return response.data;
  },
  
  getSwipedRightContacts: async (): Promise<ContactCompleteness[]> => {
    const response = await axios.get(`${API_BASE_URL}/contacts/swiped-right/list`);
    return response.data;
  }
};
