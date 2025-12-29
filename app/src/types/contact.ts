// Types for device contacts with swipe status
export interface Contact {
  id: string;
  name: string;
  phoneNumbers?: Array<{ number?: string; label?: string }>;
  emails?: Array<{ email?: string; label?: string }>;
  addresses?: Array<{ street?: string; city?: string; region?: string; postalCode?: string }>;
  birthday?: { year?: number; month?: number; day?: number };
  imageAvailable?: boolean;
  image?: { uri?: string };
}

export interface SwipeData {
  contactId: string;
  status: 'left' | 'right' | 'pending';
  timestamp: string;
}

export interface ContactWithSwipe extends Contact {
  swipeStatus: 'left' | 'right' | 'pending';
}

export interface ContactCompleteness {
  id: string;
  name: string;
  hasBirthday: boolean;
  hasAddress: boolean;
  hasPhone: boolean;
  hasEmail: boolean;
  completenessPercentage: number;
  missingFields: string[];
}
