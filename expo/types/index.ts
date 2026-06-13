export type UserRole = 'customer' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export type ServiceType =
  | 'wash_fold'
  | 'express'
  | 'delicate'
  | 'hypoallergenic'
  | 'hang_dry'
  | 'stain_treatment';

export interface Service {
  id: ServiceType;
  name: string;
  description: string;
  pricePerPound: number;
  icon: string;
  color: string;
  estimatedHours: number;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'driver_assigned'
  | 'driver_en_route'
  | 'picked_up'
  | 'at_facility'
  | 'washing'
  | 'drying'
  | 'folding'
  | 'ready_for_delivery'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  driverId?: string;
  status: OrderStatus;
  services: ServiceType[];
  pickupAddress: Address;
  deliveryAddress: Address;
  pickupSlot: TimeSlot;
  deliverySlot?: TimeSlot;
  estimatedPounds: number;
  actualPounds?: number;
  specialInstructions?: string;
  estimatedPrice: number;
  finalPrice?: number;
  tip?: number;
  promoCode?: string;
  discount?: number;
  rating?: number;
  review?: string;
  pickupPhoto?: string;
  deliveryPhoto?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusUpdate[];
}

export interface StatusUpdate {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  totalDeliveries: number;
  vehicleType: string;
  vehiclePlate: string;
  isOnline: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  read: boolean;
  orderId?: string;
  createdAt: string;
}

export interface PromoCode {
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  minOrder: number;
  expiresAt: string;
  isActive: boolean;
}

export interface EarningsSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalJobs: number;
  avgRating: number;
}
