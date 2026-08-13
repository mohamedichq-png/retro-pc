// RETRO Qatar — Repair Types

export interface RepairTicket {
  id: string;
  ticketId: string;
  customerName: string;
  customerPhone: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  serialNumber?: string;
  problemDescription: string;
  technicianNotes?: string;
  status: 'Received' | 'Diagnosing' | 'Waiting for Parts' | 'In Progress' | 'Testing' | 'Ready' | 'Collected' | 'Cancelled';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  estimatedCost: number;
  finalCost: number;
  paidAmount: number;
  warrantyMonths: number;
  warrantyExpiry?: string;
  technicianId?: string;
  imagesUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RepairBookingData {
  customerName: string;
  customerPhone: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  serialNumber?: string;
  problemDescription: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  estimatedCost: number;
  warrantyMonths: number;
  imagesUrls?: string[];
}
