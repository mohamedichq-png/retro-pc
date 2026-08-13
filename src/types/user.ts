// RETRO Qatar — User Types

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints: number;
  storeCredit: number;
  membershipLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  outstandingBalance: number;
}

export interface Employee {
  id: string;
  nameEn: string;
  nameAr: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'cashier' | 'technician' | 'warehouse';
  phone?: string;
  commissionRate: number;
  branch: string;
  isActive: boolean;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isLoggedIn: boolean;
  membershipLevel?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}
