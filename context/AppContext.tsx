import React, { createContext, useContext, useReducer, ReactNode, useEffect, PropsWithChildren } from 'react';
import { Order, Product, Table, Shift, OrderItem, OrderStatus, Staff } from '../types';
import { PRODUCTS, INITIAL_TABLES, INITIAL_STAFF } from '../constants';
import { TRANSLATIONS, Language } from '../translations';

// --- State Definition ---
interface AppState {
  products: Product[];
  tables: Table[];
  orders: Order[];
  shift: Shift;
  activeTableId: string | null;
  cart: OrderItem[];
  view: 'POS' | 'KDS' | 'ADMIN';
  theme: 'light' | 'dark';
  language: Language;
  staff: Staff[];
}

// --- Actions ---
type Action =
  | { type: 'START_SHIFT'; payload: { cashier: string; amount: number; role: 'MANAGER' | 'CASHIER' } }
  | { type: 'END_SHIFT' }
  | { type: 'SET_VIEW'; payload: 'POS' | 'KDS' | 'ADMIN' }
  | { type: 'SELECT_TABLE'; payload: string | null }
  | { type: 'ADD_TO_CART'; payload: OrderItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QTY'; payload: { id: string; delta: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SUBMIT_ORDER'; payload: { paymentMethod?: string; customerName?: string } }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'UPDATE_STOCK'; payload: { productId: string; amount: number } }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'ADD_STAFF'; payload: Staff }
  | { type: 'UPDATE_STAFF'; payload: Staff }
  | { type: 'DELETE_STAFF'; payload: string };

// --- Initial State ---
const initialState: AppState = {
  products: PRODUCTS,
  tables: INITIAL_TABLES,
  orders: [],
  shift: {
    isOpen: false,
    startTime: null,
    startCash: 0,
    totalSales: 0,
    cashierName: '',
    role: 'CASHIER'
  },
  activeTableId: null,
  cart: [],
  view: 'POS',
  theme: 'dark',
  language: 'en',
  staff: INITIAL_STAFF,
};

// --- Reducer ---
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'START_SHIFT':
      return {
        ...state,
        shift: {
          isOpen: true,
          startTime: Date.now(),
          startCash: action.payload.amount,
          totalSales: 0,
          cashierName: action.payload.cashier,
          role: action.payload.role,
        },
        view: action.payload.role === 'MANAGER' ? 'ADMIN' : 'POS'
      };
    case 'END_SHIFT':
      return {
        ...state,
        shift: { ...initialState.shift },
        view: 'POS'
      };
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'SELECT_TABLE':
      return { ...state, activeTableId: action.payload };
    case 'ADD_TO_CART': {
      const existingIndex = state.cart.findIndex(item => item.productId === action.payload.productId && JSON.stringify(item.modifiers) === JSON.stringify(action.payload.modifiers));
      if (existingIndex > -1) {
        const newCart = [...state.cart];
        newCart[existingIndex].quantity += action.payload.quantity;
        return { ...state, cart: newCart };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }
    case 'UPDATE_CART_QTY': {
      const newCart = state.cart.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, quantity: Math.max(0, item.quantity + action.payload.delta) };
        }
        return item;
      }).filter(item => item.quantity > 0);
      return { ...state, cart: newCart };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SUBMIT_ORDER': {
      const total = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        tableId: state.activeTableId,
        items: [...state.cart],
        total: total,
        status: OrderStatus.PENDING,
        timestamp: Date.now(),
        paymentMethod: action.payload.paymentMethod as any,
        customerName: action.payload.customerName
      };

      const newProducts = state.products.map(p => {
        const cartItem = state.cart.find(c => c.productId === p.id);
        if (cartItem) {
          return { ...p, stock: p.stock - cartItem.quantity };
        }
        return p;
      });

      let newTables = state.tables;
      if (state.activeTableId && state.activeTableId !== 'TAKEAWAY') {
        newTables = state.tables.map(t => 
          t.id === state.activeTableId ? { ...t, status: 'OCCUPIED', currentOrderId: newOrder.id } : t
        );
      }

      return {
        ...state,
        orders: [...state.orders, newOrder],
        products: newProducts,
        tables: newTables as any,
        cart: [],
        activeTableId: null,
        shift: { ...state.shift, totalSales: state.shift.totalSales + total }
      };
    }
    case 'UPDATE_ORDER_STATUS': {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      let newTables = state.tables;
      
      if (order && order.tableId && action.payload.status === OrderStatus.COMPLETED) {
         newTables = state.tables.map(t => 
            t.id === order.tableId ? { ...t, status: 'AVAILABLE', currentOrderId: undefined } : t
         );
      }

      const newOrders = state.orders.map(o => 
        o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o
      );

      return { ...state, orders: newOrders, tables: newTables as any };
    }
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PRODUCT':
      return {
          ...state,
          products: state.products.filter(p => p.id !== action.payload)
      };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'ADD_STAFF':
      return { ...state, staff: [...state.staff, action.payload] };
    case 'UPDATE_STAFF':
      return {
        ...state,
        staff: state.staff.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_STAFF':
      return {
        ...state,
        staff: state.staff.filter(s => s.id !== action.payload)
      };
    default:
      return state;
  }
};

// --- Context Setup ---
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
} | null>(null);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persistence
  useEffect(() => {
    const savedState = localStorage.getItem('resto-state');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            if (parsed.theme) dispatch({ type: 'TOGGLE_THEME' });
            if (parsed.language) dispatch({ type: 'SET_LANGUAGE', payload: parsed.language });
            // Hydrate complex objects if they exist in storage, else default
            // Note: In a real app, use a more robust hydration strategy
        } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('resto-state', JSON.stringify({ 
        shift: state.shift, 
        orders: state.orders,
        theme: state.theme,
        language: state.language,
        products: state.products, // Persist product changes
        staff: state.staff // Persist staff changes
    }));
  }, [state.shift, state.orders, state.theme, state.language, state.products, state.staff]);

  // Apply Side Effects (Theme & Lang)
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Theme
    root.classList.remove('light', 'dark');
    root.classList.add(state.theme);

    // Language & Direction
    root.lang = state.language;
    root.dir = state.language === 'ar' ? 'rtl' : 'ltr';

  }, [state.theme, state.language]);

  const t = (key: keyof typeof TRANSLATIONS['en']) => {
    return TRANSLATIONS[state.language][key] || key;
  };

  return (
    <AppContext.Provider value={{ state, dispatch, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};