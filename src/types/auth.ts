export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  savedAddresses?: string[];
  defaultPincode?: string;
  createdAt: string;
}

export type OrderIssueType =
  | 'cold_chain_temp'
  | 'wrong_cut'
  | 'delivery_delay'
  | 'quality_issue'
  | 'damaged_packaging'
  | 'other';

export type OrderIssueStatus =
  | 'open'
  | 'under_review'
  | 'resolved'
  | 'refund_issued';

export interface OrderIssue {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  issueType: OrderIssueType;
  subject: string;
  description: string;
  status: OrderIssueStatus;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}
