
export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  ONLINE = 'ONLINE',
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string; // English Name
  nameAr: string; // Arabic Name
  price: number;
  category: string;
  image: string;
  stock: number;
  sku: string;
  availableModifiers?: Modifier[];
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: Modifier[];
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string | null;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  timestamp: number;
  paymentMethod?: PaymentMethod;
  customerName?: string;
}

export interface Table {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
  currentOrderId?: string;
  seats: number;
}

export interface Shift {
  isOpen: boolean;
  startTime: number | null;
  startCash: number;
  totalSales: number;
  cashierName: string;
  role: 'MANAGER' | 'CASHIER';
}

export interface SalesData {
  name: string;
  value: number;
}

export interface Staff {
  id: string;
  name: string;
  role: 'MANAGER' | 'CASHIER' | 'CHEF' | 'WAITER';
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
}
