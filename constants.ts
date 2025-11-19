
import { Product, Table, Modifier, Staff } from './types';

export const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Drinks', 'Sides', 'Desserts'];

// Common Modifiers
const BURGER_MODS: Modifier[] = [
    { id: 'm1', name: 'Extra Cheese', price: 1.5 },
    { id: 'm2', name: 'No Onion', price: 0 },
    { id: 'm3', name: 'Double Patty', price: 4.0 },
    { id: 'm4', name: 'Spicy Sauce', price: 0.5 },
];

const DRINK_MODS: Modifier[] = [
    { id: 'd1', name: 'No Ice', price: 0 },
    { id: 'd2', name: 'Extra Ice', price: 0 },
    { id: 'd3', name: 'Lemon Slice', price: 0.2 },
];

const PIZZA_MODS: Modifier[] = [
    { id: 'p1', name: 'Extra Mozzarella', price: 2.0 },
    { id: 'p2', name: 'Thin Crust', price: 0 },
    { id: 'p3', name: 'Stuffed Crust', price: 3.0 },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Cheese Burger',
    nameAr: 'برجر كلاسيك بالجبن',
    price: 12.50,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    stock: 50,
    sku: '101',
    availableModifiers: BURGER_MODS
  },
  {
    id: '2',
    name: 'Double Bacon BBQ',
    nameAr: 'برجر باربيكيو مزدوج',
    price: 15.00,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80',
    stock: 35,
    sku: '102',
    availableModifiers: BURGER_MODS
  },
  {
    id: '13',
    name: 'Crispy Chicken Burger',
    nameAr: 'برجر دجاج مقرمش',
    price: 11.50,
    category: 'Burgers',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=400&h=300&fit=crop',
    stock: 40,
    sku: '103',
    availableModifiers: BURGER_MODS
  },
  {
    id: '14',
    name: 'Mushroom Swiss Burger',
    nameAr: 'برجر مشروم سويسري',
    price: 13.50,
    category: 'Burgers',
    image: 'https://images.pexels.com/photos/2282528/pexels-photo-2282528.jpeg?w=400&h=300&fit=crop',
    stock: 25,
    sku: '104',
    availableModifiers: BURGER_MODS
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    nameAr: 'بيتزا مارجريتا',
    price: 14.00,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
    stock: 20,
    sku: '201',
    availableModifiers: PIZZA_MODS
  },
  {
    id: '4',
    name: 'Pepperoni Feast',
    nameAr: 'بيتزا بيبيروني',
    price: 16.50,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
    stock: 15,
    sku: '202',
    availableModifiers: PIZZA_MODS
  },
  {
    id: '15',
    name: 'Veggie Supreme Pizza',
    nameAr: 'بيتزا خضروات',
    price: 13.00,
    category: 'Pizza',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?w=400&h=300&fit=crop',
    stock: 18,
    sku: '203',
    availableModifiers: PIZZA_MODS
  },
  {
    id: '16',
    name: 'BBQ Chicken Pizza',
    nameAr: 'بيتزا دجاج باربيكيو',
    price: 17.00,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    stock: 12,
    sku: '204',
    availableModifiers: PIZZA_MODS
  },
  {
    id: '5',
    name: 'Cola Zero',
    nameAr: 'كولا زيرو',
    price: 3.00,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80',
    stock: 100,
    sku: '301',
    availableModifiers: DRINK_MODS
  },
  {
    id: '6',
    name: 'Orange Juice',
    nameAr: 'عصير برتقال',
    price: 4.50,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&q=80',
    stock: 40,
    sku: '302',
    availableModifiers: DRINK_MODS
  },
  {
    id: '10',
    name: 'Mineral Water',
    nameAr: 'مياه معدنية',
    price: 1.50,
    category: 'Drinks',
    image: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?w=400&h=300&fit=crop',
    stock: 150,
    sku: '303',
    availableModifiers: DRINK_MODS
  },
  {
    id: '17',
    name: 'Lemon Mint Juice',
    nameAr: 'ليمون بالنعناع',
    price: 5.00,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
    stock: 30,
    sku: '304',
    availableModifiers: DRINK_MODS
  },
  {
    id: '18',
    name: 'Iced Tea',
    nameAr: 'شاي مثلج',
    price: 4.00,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
    stock: 45,
    sku: '305',
    availableModifiers: DRINK_MODS
  },
  {
    id: '7',
    name: 'French Fries',
    nameAr: 'بطاطس مقلية',
    price: 5.00,
    category: 'Sides',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?w=400&h=300&fit=crop',
    stock: 200,
    sku: '401',
    availableModifiers: [{ id: 's1', name: 'Large Size', price: 1.5 }, { id: 's2', name: 'No Salt', price: 0 }]
  },
  {
    id: '9',
    name: 'Chicken Caesar Salad',
    nameAr: 'سلطة سيزر دجاج',
    price: 10.50,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80',
    stock: 25,
    sku: '402'
  },
  {
    id: '11',
    name: 'Buffalo Wings',
    nameAr: 'أجنحة دجاج حارة',
    price: 9.00,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80',
    stock: 30,
    sku: '403',
    availableModifiers: [{ id: 'w1', name: 'Extra Spicy', price: 0.5 }, { id: 'w2', name: 'Ranch Dip', price: 0.5 }]
  },
  {
    id: '19',
    name: 'Onion Rings',
    nameAr: 'حلقات بصل',
    price: 6.00,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&q=80',
    stock: 50,
    sku: '404',
    availableModifiers: [{ id: 'o1', name: 'Spicy Mayo', price: 0.5 }]
  },
   {
    id: '8',
    name: 'Chocolate Lava Cake',
    nameAr: 'كيكة الشوكولاتة',
    price: 8.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80',
    stock: 12,
    sku: '501'
  },
  {
    id: '12',
    name: 'Strawberry Cheesecake',
    nameAr: 'تشيز كيك فراولة',
    price: 7.50,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
    stock: 15,
    sku: '502'
  },
  {
    id: '21',
    name: 'Vanilla Ice Cream',
    nameAr: 'آيس كريم فانيليا',
    price: 4.50,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&q=80',
    stock: 50,
    sku: '503'
  },
  {
    id: '22',
    name: 'Tiramisu',
    nameAr: 'تيراميسو',
    price: 8.50,
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/221143/pexels-photo-221143.jpeg?w=400&h=300&fit=crop',
    stock: 10,
    sku: '504'
  }
];

export const INITIAL_TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: `t-${i + 1}`,
  name: `T${i + 1}`,
  status: 'AVAILABLE',
  seats: i < 4 ? 2 : 4,
}));

export const INITIAL_STAFF: Staff[] = [
  { id: '1', name: 'Ahmed Ali', role: 'MANAGER', phone: '0123456789', status: 'ACTIVE' },
  { id: '2', name: 'Sarah Johnson', role: 'CASHIER', phone: '0112233445', status: 'ACTIVE' },
  { id: '3', name: 'Mike Ross', role: 'CHEF', phone: '0100000000', status: 'ACTIVE' },
];
