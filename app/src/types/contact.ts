export interface Contact {
  id: string;
  name: string;
  birthday: string | null;
  address: string | null;
  relationship: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  twitter: string | null;
  facebook: string | null;
  swipe_status: 'pending' | 'left' | 'right';
  created_at: string;
  updated_at: string;
}

export interface ContactCompleteness {
  id: string;
  name: string;
  hasBirthday: boolean;
  hasAddress: boolean;
  hasRelationship: boolean;
  hasSocials: boolean;
  completenessPercentage: number;
  missingFields: string[];
}
