export interface Sweet {
  id: string;
  name: string;
  description: string;
  category: 'mithai' | 'chaat' | 'drinks' | 'combos' | 'dishes';
  price: number;
  weightText: string;
  rating: number;
  image: string;
  tags: string[];
  color: string; // Used for UI colors and sweet packing simulation
  emoji?: string;
  ingredients?: string[];
}

export interface CartItem {
  id: string; // unique cart item id
  sweetId: string;
  name: string;
  price: number;
  quantity: number;
  isCustomBox?: boolean;
  boxSize?: 'small' | 'medium' | 'large';
  boxContents?: { [key: number]: Sweet };
}

export interface CustomBoxSize {
  id: 'small' | 'medium' | 'large';
  name: string;
  slots: number; // e.g. 4, 9, 16
  dimensionsText: string;
  price: number;
  weightText: string;
  description: string;
}

export interface BookingDetails {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  requestType: 'table' | 'catering' | 'bulk_sweet_box';
  notes?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
}
