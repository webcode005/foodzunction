import { Order } from '../types/store';
import { OrderIssue, OrderIssueStatus, OrderIssueType, User } from '../types/auth';

export const SUPER_ADMIN_CREDENTIALS = {
  email: 'admin@foodzunction.com',
  password: 'FoodZunction@2026',
  name: 'Super Admin (FoodZunction Master)',
  phone: '9845000000',
};

export const DEMO_CUSTOMER_CREDENTIALS = {
  email: 'customer@foodzunction.com',
  password: 'Customer@123',
  name: 'Basant M',
  phone: '9845012345',
};

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  pincode?: string;
}

export function validateRegistrationInput(data: RegistrationData): { isValid: boolean; error?: string } {
  if (!data.name || data.name.trim().length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  const phoneClean = data.phone.trim().replace(/\D/g, '');
  if (phoneClean.length !== 10) {
    return { isValid: false, error: 'Mobile number must be exactly 10 digits.' };
  }

  if (!data.password || data.password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long.' };
  }

  return { isValid: true };
}

export function authenticate(
  loginIdentifier: string,
  pass: string,
  customUsers: { user: User; pass: string }[]
): { success: boolean; user?: User; error?: string } {
  const cleanId = loginIdentifier.trim().toLowerCase();

  // Check Super Admin credentials
  if (
    cleanId === SUPER_ADMIN_CREDENTIALS.email.toLowerCase() &&
    pass === SUPER_ADMIN_CREDENTIALS.password
  ) {
    const adminUser: User = {
      id: 'usr-super-admin',
      name: SUPER_ADMIN_CREDENTIALS.name,
      email: SUPER_ADMIN_CREDENTIALS.email,
      phone: SUPER_ADMIN_CREDENTIALS.phone,
      role: 'admin',
      defaultPincode: '560034',
      createdAt: '2026-01-01',
    };
    return { success: true, user: adminUser };
  }

  // Check Demo Customer credentials
  if (
    (cleanId === DEMO_CUSTOMER_CREDENTIALS.email.toLowerCase() ||
      cleanId === DEMO_CUSTOMER_CREDENTIALS.phone) &&
    pass === DEMO_CUSTOMER_CREDENTIALS.password
  ) {
    const demoCust: User = {
      id: 'usr-demo-cust',
      name: DEMO_CUSTOMER_CREDENTIALS.name,
      email: DEMO_CUSTOMER_CREDENTIALS.email,
      phone: DEMO_CUSTOMER_CREDENTIALS.phone,
      role: 'customer',
      savedAddresses: ['Flat 402, Royal Residency, 12th Main Road, Sector 4, Bengaluru'],
      defaultPincode: '560034',
      createdAt: '2026-02-15',
    };
    return { success: true, user: demoCust };
  }

  // Check registered custom users
  const match = customUsers.find(
    (u) =>
      (u.user.email.toLowerCase() === cleanId || u.user.phone === cleanId) &&
      u.pass === pass
  );

  if (match) {
    return { success: true, user: match.user };
  }

  return { success: false, error: 'Invalid email/phone or password. Please check your credentials.' };
}

export function createOrderIssueTicket(params: {
  orderId: string;
  user: User;
  issueType: OrderIssueType;
  subject: string;
  description: string;
}): OrderIssue {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toISOString().split('T')[0];

  return {
    id: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
    orderId: params.orderId,
    customerId: params.user.id,
    customerName: params.user.name,
    customerPhone: params.user.phone,
    customerEmail: params.user.email,
    issueType: params.issueType,
    subject: params.subject.trim(),
    description: params.description.trim(),
    status: 'open',
    createdAt: `${dateStr} ${timeStr}`,
    updatedAt: `${dateStr} ${timeStr}`,
  };
}

export function filterOrdersForUser(orders: Order[], user: User | null): Order[] {
  if (!user) return [];
  if (user.role === 'admin') return orders;
  return orders.filter(
    (o) =>
      o.customerEmail.toLowerCase() === user.email.toLowerCase() ||
      o.customerPhone === user.phone
  );
}

export function getIssueTypeLabel(type: OrderIssueType): string {
  switch (type) {
    case 'cold_chain_temp':
      return 'Cold-Chain Temperature / Thaw Concern';
    case 'wrong_cut':
      return 'Incorrect Butchery Cut Received';
    case 'delivery_delay':
      return 'Delivery Delay / Rider Coordination';
    case 'damaged_packaging':
      return 'Damaged / Broken Vacuum Seal';
    case 'quality_issue':
      return 'Freshness or Quality Observation';
    default:
      return 'General Butchery Inquiry';
  }
}
