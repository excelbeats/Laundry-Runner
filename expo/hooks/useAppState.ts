import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Order, Address, Notification, UserRole } from '@/types';
import { mockOrders, mockAddresses, mockNotifications } from '@/mocks/data';

interface AppState {
  orders: Order[];
  addresses: Address[];
  notifications: Notification[];
  userName: string;
  userRole: UserRole;
  hasOnboarded: boolean;
  setUserName: (name: string) => void;
  setUserRole: (role: UserRole) => void;
  setHasOnboarded: (value: boolean) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
  addAddress: (address: Address) => void;
  isLoading: boolean;
}

const STORAGE_KEYS = {
  onboarded: 'lr_onboarded',
  userName: 'lr_user_name',
  userRole: 'lr_user_role',
};

export const [AppStateProvider, useAppState] = createContextHook<AppState>(() => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [userName, setUserNameState] = useState<string>('Alex');
  const [userRole, setUserRoleState] = useState<UserRole>('customer');
  const [hasOnboarded, setHasOnboardedState] = useState<boolean>(true);

  const settingsQuery = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const [onboarded, name, role] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.onboarded),
        AsyncStorage.getItem(STORAGE_KEYS.userName),
        AsyncStorage.getItem(STORAGE_KEYS.userRole),
      ]);
      return {
        hasOnboarded: onboarded === 'true',
        userName: name || 'Alex',
        userRole: (role as UserRole) || 'customer',
      };
    },
  });

  useEffect(() => {
    if (settingsQuery.data) {
      setHasOnboardedState(settingsQuery.data.hasOnboarded);
      setUserNameState(settingsQuery.data.userName);
      setUserRoleState(settingsQuery.data.userRole);
    }
  }, [settingsQuery.data]);

  const saveSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      await AsyncStorage.setItem(key, value);
    },
  });

  const setUserName = useCallback((name: string) => {
    setUserNameState(name);
    saveSetting.mutate({ key: STORAGE_KEYS.userName, value: name });
  }, [saveSetting]);

  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role);
    saveSetting.mutate({ key: STORAGE_KEYS.userRole, value: role });
  }, [saveSetting]);

  const setHasOnboarded = useCallback((value: boolean) => {
    setHasOnboardedState(value);
    saveSetting.mutate({ key: STORAGE_KEYS.onboarded, value: String(value) });
  }, [saveSetting]);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status,
              updatedAt: new Date().toISOString(),
              statusHistory: [
                ...o.statusHistory,
                { status, timestamp: new Date().toISOString() },
              ],
            }
          : o
      )
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const addAddress = useCallback((address: Address) => {
    setAddresses(prev => [...prev, address]);
  }, []);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  return useMemo(() => ({
    orders,
    addresses,
    notifications,
    userName,
    userRole,
    hasOnboarded,
    setUserName,
    setUserRole,
    setHasOnboarded,
    addOrder,
    updateOrderStatus,
    markNotificationRead,
    unreadCount,
    addAddress,
    isLoading: settingsQuery.isLoading,
  }), [orders, addresses, notifications, userName, userRole, hasOnboarded, setUserName, setUserRole, setHasOnboarded, addOrder, updateOrderStatus, markNotificationRead, unreadCount, addAddress, settingsQuery.isLoading]);
});
