// RETRO Qatar — Cart Types

import { Product, ProductVariation } from './product';

export interface CartItem {
  product: Product;
  qty: number;
  variation?: ProductVariation;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  zone: string; // Qatar zones
  country: string;
  notes?: string;
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  vat: number;
  total: number;
}
