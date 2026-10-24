import test from 'node:test';
import assert from 'node:assert/strict';
import {
  authenticate,
  createOrderIssueTicket,
  filterOrdersForUser,
  validateRegistrationInput,
  SUPER_ADMIN_CREDENTIALS,
  DEMO_CUSTOMER_CREDENTIALS,
} from './auth-rules';
import { User } from '../types/auth';
import { Order } from '../types/store';

test('validateRegistrationInput enforces valid names, emails, 10-digit phone, and min 6-char password', () => {
  // Valid
  const validRes = validateRegistrationInput({
    name: 'Khurram Siddiqui',
    email: 'khurram@example.com',
    phone: '9845012345',
    password: 'securePassword123',
  });
  assert.equal(validRes.isValid, true);

  // Invalid email
  const badEmail = validateRegistrationInput({
    name: 'Khurram',
    email: 'invalid-email',
    phone: '9845012345',
    password: 'securePassword123',
  });
  assert.equal(badEmail.isValid, false);
  assert.match(badEmail.error || '', /valid email/i);

  // Short password
  const shortPass = validateRegistrationInput({
    name: 'Khurram',
    email: 'khurram@example.com',
    phone: '9845012345',
    password: '123',
  });
  assert.equal(shortPass.isValid, false);
  assert.match(shortPass.error || '', /at least 6 characters/i);

  // Invalid phone length
  const badPhone = validateRegistrationInput({
    name: 'Khurram',
    email: 'khurram@example.com',
    phone: '12345',
    password: 'securePassword123',
  });
  assert.equal(badPhone.isValid, false);
  assert.match(badPhone.error || '', /10 digits/i);
});

test('authenticate authenticates Super Admin with proper role and credentials', () => {
  const result = authenticate(
    SUPER_ADMIN_CREDENTIALS.email,
    SUPER_ADMIN_CREDENTIALS.password,
    []
  );

  assert.equal(result.success, true);
  assert.equal(result.user?.role, 'admin');
  assert.equal(result.user?.email, 'admin@foodzunction.com');

  // Wrong password
  const failResult = authenticate(
    SUPER_ADMIN_CREDENTIALS.email,
    'WrongPassword!',
    []
  );
  assert.equal(failResult.success, false);
  assert.equal(failResult.user, undefined);
});

test('authenticate authenticates Demo Customer credentials', () => {
  const result = authenticate(
    DEMO_CUSTOMER_CREDENTIALS.email,
    DEMO_CUSTOMER_CREDENTIALS.password,
    []
  );

  assert.equal(result.success, true);
  assert.equal(result.user?.role, 'customer');
  assert.equal(result.user?.name, 'Basant M');
});

test('createOrderIssueTicket creates open ticket with unique ID and timestamps', () => {
  const user: User = {
    id: 'usr-1',
    name: 'Basant M',
    email: 'basant@example.com',
    phone: '9845012345',
    role: 'customer',
    createdAt: '2026-01-01',
  };

  const ticket = createOrderIssueTicket({
    orderId: 'FZ-918234',
    user,
    issueType: 'wrong_cut',
    subject: 'Received Biryani cut instead of Curry cut',
    description: 'Pieces are larger than expected for a gravy dish.',
  });

  assert.match(ticket.id, /^TKT-\d+/);
  assert.equal(ticket.orderId, 'FZ-918234');
  assert.equal(ticket.status, 'open');
  assert.equal(ticket.issueType, 'wrong_cut');
  assert.equal(ticket.customerName, 'Basant M');
});

test('filterOrdersForUser filters customer orders by customer email/phone or shows all for admin', () => {
  const mockOrders: Order[] = [
    {
      id: 'FZ-1',
      createdAt: '10:00 AM',
      customerName: 'Basant M',
      customerPhone: '9845012345',
      customerEmail: 'basant@example.com',
      deliveryAddress: 'Road 1',
      pincode: '560034',
      city: 'BLR',
      items: [],
      subtotal: 500,
      discount: 0,
      deliveryFee: 0,
      packagingFee: 15,
      total: 515,
      deliveryType: 'express',
      deliverySlot: '90m',
      paymentMethod: 'cod',
      status: 'pending',
    },
    {
      id: 'FZ-2',
      createdAt: '11:00 AM',
      customerName: 'Fatima',
      customerPhone: '9820011223',
      customerEmail: 'fatima@example.com',
      deliveryAddress: 'Road 2',
      pincode: '400050',
      city: 'MUM',
      items: [],
      subtotal: 900,
      discount: 0,
      deliveryFee: 0,
      packagingFee: 15,
      total: 915,
      deliveryType: 'scheduled',
      deliverySlot: 'slot',
      paymentMethod: 'upi',
      status: 'delivered',
    },
  ];

  const customerUser: User = {
    id: 'u-1',
    name: 'Basant M',
    email: 'basant@example.com',
    phone: '9845012345',
    role: 'customer',
    createdAt: '2026-01-01',
  };

  const adminUser: User = {
    id: 'u-admin',
    name: 'Admin',
    email: 'admin@foodzunction.com',
    phone: '9845000000',
    role: 'admin',
    createdAt: '2026-01-01',
  };

  const customerFiltered = filterOrdersForUser(mockOrders, customerUser);
  assert.equal(customerFiltered.length, 1);
  assert.equal(customerFiltered[0].id, 'FZ-1');

  const adminFiltered = filterOrdersForUser(mockOrders, adminUser);
  assert.equal(adminFiltered.length, 2);
});
