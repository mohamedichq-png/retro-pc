// RETRO Qatar — Order Types

export interface OrderItem {
  productId: string;
  sku: string;
  nameEn: string;
  nameAr: string;
  qty: number;
  price: number;
  cost: number;
  imageUrl?: string;
}

export interface Transaction {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerPhone: string;
  employeeName: string;
  source: 'POS' | 'E-Commerce';
  branch: string;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  profitAmount: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partially Paid' | 'Refunded';
  items: OrderItem[];
  createdAt: string;
}
