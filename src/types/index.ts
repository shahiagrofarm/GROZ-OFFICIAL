export type Language = 'en' | 'bn';
export type Theme = 'dark' | 'bright';
export type NavRoute = 'home' | 'shop' | 'cart' | 'checkout' | 'about' | 'contact' | 'admin';

export type ProductCategory = 'all' | 'outerwear' | 'leather' | 'accessories' | 'timepieces';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type PaymentMethod = 'bkash' | 'nagad' | 'upay' | 'rocket';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Unverified' | 'Verified' | 'Refunded';

export interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  subtitleEn: string;
  subtitleBn: string;
  category: 'outerwear' | 'leather' | 'accessories' | 'timepieces';
  priceBDT: number;
  salePriceBDT?: number;
  image: string;
  gallery: string[];
  descriptionEn: string;
  descriptionBn: string;
  specifications: {
    labelEn: string;
    labelBn: string;
    valueEn: string;
    valueBn: string;
  }[];
  materialsStatusEn: string;
  materialsStatusBn: string;
  dimensionsEn: string;
  dimensionsBn: string;
  colors: string[];
  sizes: string[];
  stockStatus: StockStatus;
  stockQuantity: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isSale: boolean;
  isPublished: boolean;
  imageAlt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface PaymentInfo {
  id: PaymentMethod;
  name: string;
  number: string;
  accountType: 'Personal' | 'Merchant';
  brandColor: string;
  instructionEn: string;
  instructionBn: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  priceBDT: number;
  quantity: number;
  color?: string;
  size?: string;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryArea: 'inside_noakhali' | 'outside_noakhali';
  deliveryChargeBDT: number;
  items: OrderItem[];
  subtotalBDT: number;
  totalBDT: number;
  paymentMethod: PaymentMethod;
  paymentNumber: string;
  transactionId?: string;
  customerNotes?: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormState {
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

export interface AdminUser {
  username: string;
  role: 'admin';
  token: string;
}
