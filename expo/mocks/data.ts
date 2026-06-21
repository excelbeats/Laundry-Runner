import { Address, Driver, EarningsSummary, Notification, Order, PromoCode, Service, TimeSlot } from '@/types';

export const mockAddresses: Address[] = [
  {
    id: 'addr_1',
    label: 'Home',
    street: '742 Evergreen Terrace',
    apt: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    lat: 37.7749,
    lng: -122.4194,
    isDefault: true,
  },
  {
    id: 'addr_2',
    label: 'Office',
    street: '1 Market Street',
    apt: 'Suite 500',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    lat: 37.7937,
    lng: -122.3950,
    isDefault: false,
  },
  {
    id: 'addr_3',
    label: "Partner's Place",
    street: '456 Valencia St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    lat: 37.7651,
    lng: -122.4217,
    isDefault: false,
  },
];

export const mockServices: Service[] = [
  {
    id: 'wash_fold',
    name: 'Wash & Fold',
    description: 'Standard wash, dry, and fold service',
    pricePerPound: 1.99,
    icon: 'shirt',
    color: '#0B5E8A',
    estimatedHours: 24,
  },
  {
    id: 'express',
    name: 'Express Service',
    description: 'Same-day turnaround guaranteed',
    pricePerPound: 3.49,
    icon: 'zap',
    color: '#F59E0B',
    estimatedHours: 6,
  },
  {
    id: 'delicate',
    name: 'Delicate Care',
    description: 'Gentle cycle for sensitive fabrics',
    pricePerPound: 2.99,
    icon: 'feather',
    color: '#EC4899',
    estimatedHours: 36,
  },
  {
    id: 'hypoallergenic',
    name: 'Hypoallergenic',
    description: 'Free & clear detergent, no fragrances',
    pricePerPound: 2.49,
    icon: 'shield-check',
    color: '#10B981',
    estimatedHours: 28,
  },
  {
    id: 'hang_dry',
    name: 'Hang Dry',
    description: 'Air dried to preserve fabric quality',
    pricePerPound: 2.79,
    icon: 'wind',
    color: '#8B5CF6',
    estimatedHours: 48,
  },
  {
    id: 'stain_treatment',
    name: 'Stain Treatment',
    description: 'Pre-treatment for tough stains',
    pricePerPound: 3.29,
    icon: 'sparkles',
    color: '#F97316',
    estimatedHours: 30,
  },
];

export const mockDriver: Driver = {
  id: 'driver_1',
  name: 'Marcus Johnson',
  phone: '+1 (415) 555-0142',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  rating: 4.9,
  totalDeliveries: 1247,
  vehicleType: 'Toyota Prius',
  vehiclePlate: '7ABC123',
  isOnline: true,
  currentLocation: {
    lat: 37.7780,
    lng: -122.4100,
  },
};

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);

const formatDate = (d: Date): string => d.toISOString().split('T')[0];

export const mockTimeSlots: TimeSlot[] = [
  { id: 'ts_1', date: formatDate(today), startTime: '10:00 AM', endTime: '12:00 PM', available: false },
  { id: 'ts_2', date: formatDate(today), startTime: '12:00 PM', endTime: '2:00 PM', available: true },
  { id: 'ts_3', date: formatDate(today), startTime: '2:00 PM', endTime: '4:00 PM', available: true },
  { id: 'ts_4', date: formatDate(today), startTime: '4:00 PM', endTime: '6:00 PM', available: true },
  { id: 'ts_5', date: formatDate(today), startTime: '6:00 PM', endTime: '8:00 PM', available: false },
  { id: 'ts_6', date: formatDate(tomorrow), startTime: '8:00 AM', endTime: '10:00 AM', available: true },
  { id: 'ts_7', date: formatDate(tomorrow), startTime: '10:00 AM', endTime: '12:00 PM', available: true },
  { id: 'ts_8', date: formatDate(tomorrow), startTime: '12:00 PM', endTime: '2:00 PM', available: true },
  { id: 'ts_9', date: formatDate(tomorrow), startTime: '2:00 PM', endTime: '4:00 PM', available: true },
  { id: 'ts_10', date: formatDate(tomorrow), startTime: '4:00 PM', endTime: '6:00 PM', available: true },
  { id: 'ts_11', date: formatDate(dayAfter), startTime: '8:00 AM', endTime: '10:00 AM', available: true },
  { id: 'ts_12', date: formatDate(dayAfter), startTime: '10:00 AM', endTime: '12:00 PM', available: true },
  { id: 'ts_13', date: formatDate(dayAfter), startTime: '12:00 PM', endTime: '2:00 PM', available: false },
  { id: 'ts_14', date: formatDate(dayAfter), startTime: '2:00 PM', endTime: '4:00 PM', available: true },
  { id: 'ts_15', date: formatDate(dayAfter), startTime: '4:00 PM', endTime: '6:00 PM', available: true },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-2847',
    customerId: 'user_1',
    driverId: 'driver_1',
    status: 'washing',
    services: ['wash_fold', 'stain_treatment'],
    pickupAddress: mockAddresses[0],
    deliveryAddress: mockAddresses[0],
    pickupSlot: mockTimeSlots[1],
    deliverySlot: mockTimeSlots[8],
    estimatedPounds: 12,
    specialInstructions: 'Please separate darks and lights',
    estimatedPrice: 45.80,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    statusHistory: [
      { status: 'placed', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
      { status: 'confirmed', timestamp: new Date(Date.now() - 3600000 * 4.5).toISOString() },
      { status: 'driver_assigned', timestamp: new Date(Date.now() - 3600000 * 4).toISOString() },
      { status: 'driver_en_route', timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString() },
      { status: 'picked_up', timestamp: new Date(Date.now() - 3600000 * 3).toISOString() },
      { status: 'at_facility', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
      { status: 'washing', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ],
  },
  {
    id: 'ORD-2831',
    customerId: 'user_1',
    driverId: 'driver_1',
    status: 'delivered',
    services: ['express'],
    pickupAddress: mockAddresses[1],
    deliveryAddress: mockAddresses[0],
    pickupSlot: mockTimeSlots[6],
    deliverySlot: mockTimeSlots[9],
    estimatedPounds: 8,
    estimatedPrice: 27.92,
    finalPrice: 29.50,
    actualPounds: 8.5,
    tip: 5.00,
    rating: 5,
    review: 'Amazing service! Clothes came back perfectly folded.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    statusHistory: [
      { status: 'placed', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
      { status: 'confirmed', timestamp: new Date(Date.now() - 86400000 * 3 + 1800000).toISOString() },
      { status: 'driver_assigned', timestamp: new Date(Date.now() - 86400000 * 3 + 3600000).toISOString() },
      { status: 'picked_up', timestamp: new Date(Date.now() - 86400000 * 3 + 7200000).toISOString() },
      { status: 'washing', timestamp: new Date(Date.now() - 86400000 * 3 + 10800000).toISOString() },
      { status: 'delivered', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    ],
  },
  {
    id: 'ORD-2819',
    customerId: 'user_1',
    driverId: 'driver_1',
    status: 'delivered',
    services: ['delicate', 'hang_dry'],
    pickupAddress: mockAddresses[0],
    deliveryAddress: mockAddresses[0],
    pickupSlot: mockTimeSlots[11],
    deliverySlot: mockTimeSlots[14],
    estimatedPounds: 6,
    estimatedPrice: 34.68,
    finalPrice: 33.20,
    actualPounds: 5.8,
    tip: 3.00,
    rating: 4,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    statusHistory: [
      { status: 'placed', timestamp: new Date(Date.now() - 86400000 * 7).toISOString() },
      { status: 'delivered', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
    ],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    title: 'Your laundry is being washed',
    message: 'Order ORD-2847 is now in the washing cycle. We\'ll notify you when it\'s ready!',
    type: 'order',
    read: false,
    orderId: 'ORD-2847',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif_2',
    title: '20% off your next order!',
    message: 'Use code FRESH20 for 20% off. Valid until end of week.',
    type: 'promo',
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'notif_3',
    title: 'Order delivered!',
    message: 'Your order ORD-2831 has been delivered. How did we do?',
    type: 'order',
    read: true,
    orderId: 'ORD-2831',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'notif_4',
    title: 'Welcome to Laundry Dispatch!',
    message: 'Thanks for joining. Your first order gets free pickup!',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

export const mockPromoCodes: PromoCode[] = [
  { code: 'FRESH20', discount: 20, type: 'percent', minOrder: 25, expiresAt: '2026-04-01', isActive: true },
  { code: 'FIRST5', discount: 5, type: 'fixed', minOrder: 15, expiresAt: '2026-12-31', isActive: true },
  { code: 'WEEKLY10', discount: 10, type: 'percent', minOrder: 30, expiresAt: '2026-06-01', isActive: true },
];

export const mockDriverEarnings: EarningsSummary = {
  today: 87.50,
  thisWeek: 543.20,
  thisMonth: 2186.75,
  totalJobs: 42,
  avgRating: 4.9,
};

export const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  placed: { label: 'Order Placed', color: '#F59E0B', icon: 'clipboard-check' },
  confirmed: { label: 'Confirmed', color: '#3B82F6', icon: 'check-circle' },
  driver_assigned: { label: 'Driver Assigned', color: '#3B82F6', icon: 'user-check' },
  driver_en_route: { label: 'Driver En Route', color: '#F97316', icon: 'truck' },
  picked_up: { label: 'Picked Up', color: '#8B5CF6', icon: 'package' },
  at_facility: { label: 'At Facility', color: '#8B5CF6', icon: 'building-2' },
  washing: { label: 'Washing', color: '#3B82F6', icon: 'droplets' },
  drying: { label: 'Drying', color: '#EC4899', icon: 'wind' },
  folding: { label: 'Folding', color: '#14B8A6', icon: 'layers' },
  ready_for_delivery: { label: 'Ready for Delivery', color: '#10B981', icon: 'package-check' },
  out_for_delivery: { label: 'Out for Delivery', color: '#F97316', icon: 'truck' },
  delivered: { label: 'Delivered', color: '#10B981', icon: 'circle-check-big' },
  cancelled: { label: 'Cancelled', color: '#EF4444', icon: 'x-circle' },
};
