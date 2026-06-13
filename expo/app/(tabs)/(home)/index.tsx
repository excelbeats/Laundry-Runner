import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowRight,
  Bell,
  Clock,
  Shirt,
  Zap,
  Droplets,
  Package,
  Star,
  MapPin,
  ChevronRight,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useAppState } from '@/hooks/useAppState';
import { ORDER_STATUS_CONFIG, mockServices } from '@/mocks/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, userName, unreadCount, addresses } = useAppState();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  const activeOrder = orders.find(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  );

  const defaultAddress = addresses.find(a => a.isDefault);

  const handleSchedulePickup = useCallback(() => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/schedule-pickup');
  }, [router]);

  const handleNotifications = useCallback(() => {
    router.push('/notifications');
  }, [router]);

  const handleActiveOrder = useCallback(() => {
    if (activeOrder) {
      router.push({ pathname: '/order-details', params: { id: activeOrder.id } });
    }
  }, [activeOrder, router]);

  const statusConfig = activeOrder ? ORDER_STATUS_CONFIG[activeOrder.status] : null;

  const quickServices = mockServices.slice(0, 4);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight, Colors.background]}
        locations={[0, 0.35, 0.7]}
        style={[styles.headerGradient, { paddingTop: insets.top + 12 }]}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.headerRow,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.greeting}>
            <Text style={styles.greetingLabel}>Good {getGreeting()}</Text>
            <Text style={styles.greetingName}>{userName}</Text>
          </View>
          <TouchableOpacity
            style={styles.notifButton}
            onPress={handleNotifications}
            testID="notifications-button"
          >
            <Bell size={22} color={Colors.textInverse} />
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {defaultAddress && (
          <Animated.View
            style={[
              styles.locationRow,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <MapPin size={14} color={Colors.accentLight} />
            <Text style={styles.locationText} numberOfLines={1}>
              {defaultAddress.street}, {defaultAddress.city}
            </Text>
          </Animated.View>
        )}

        <Animated.View
          style={[
            styles.heroCta,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.heroCtaInner}
            onPress={handleSchedulePickup}
            activeOpacity={0.85}
            testID="schedule-pickup-cta"
          >
            <LinearGradient
              colors={[Colors.accent, '#E8890C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCtaGradient}
            >
              <View style={styles.heroCtaContent}>
                <View style={styles.heroCtaTextGroup}>
                  <Text style={styles.heroCtaTitle}>Schedule a Pickup</Text>
                  <Text style={styles.heroCtaSubtitle}>
                    We'll wash, fold & deliver back to you
                  </Text>
                </View>
                <View style={styles.heroCtaArrow}>
                  <ArrowRight size={24} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.heroCtaDecoCircle} />
              <View style={styles.heroCtaDecoCircle2} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {activeOrder && statusConfig && (
          <Animated.View
            style={[
              styles.activeOrderCard,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <TouchableOpacity onPress={handleActiveOrder} activeOpacity={0.8}>
              <View style={styles.activeOrderHeader}>
                <View style={styles.activeOrderLeft}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: statusConfig.color },
                    ]}
                  />
                  <Text style={styles.activeOrderTitle}>Active Order</Text>
                </View>
                <Text style={styles.activeOrderId}>{activeOrder.id}</Text>
              </View>
              <View style={styles.activeOrderBody}>
                <View style={styles.activeOrderStatus}>
                  <Droplets size={18} color={statusConfig.color} />
                  <Text
                    style={[
                      styles.activeOrderStatusText,
                      { color: statusConfig.color },
                    ]}
                  >
                    {statusConfig.label}
                  </Text>
                </View>
                <ChevronRight size={18} color={Colors.textTertiary} />
              </View>
              <View style={styles.activeOrderProgress}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: statusConfig.color,
                        width: `${getProgressPercent(activeOrder.status)}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Services</Text>
          <TouchableOpacity onPress={handleSchedulePickup}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.servicesGrid}>
          {quickServices.map((service) => {
            const IconComponent = getServiceIcon(service.icon);
            return (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={handleSchedulePickup}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.serviceIconWrap,
                    { backgroundColor: service.color + '15' },
                  ]}
                >
                  <IconComponent size={22} color={service.color} />
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>
                  ${service.pricePerPound.toFixed(2)}/lb
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>How It Works</Text>
        </View>

        <View style={styles.stepsContainer}>
          {STEPS.map((step, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={styles.stepNumberWrap}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryLight]}
                  style={styles.stepNumberGradient}
                >
                  <Text style={styles.stepNumber}>{idx + 1}</Text>
                </LinearGradient>
                {idx < STEPS.length - 1 && <View style={styles.stepLine} />}
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {orders.filter(o => o.status === 'delivered').length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/orders')}>
                <Text style={styles.seeAll}>View all</Text>
              </TouchableOpacity>
            </View>
            {orders
              .filter(o => o.status === 'delivered')
              .slice(0, 2)
              .map(order => {
                const config = ORDER_STATUS_CONFIG[order.status];
                return (
                  <TouchableOpacity
                    key={order.id}
                    style={styles.recentOrderCard}
                    onPress={() =>
                      router.push({
                        pathname: '/order-details',
                        params: { id: order.id },
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <View style={styles.recentOrderLeft}>
                      <View
                        style={[
                          styles.recentOrderIcon,
                          { backgroundColor: config.color + '15' },
                        ]}
                      >
                        <Package size={18} color={config.color} />
                      </View>
                      <View>
                        <Text style={styles.recentOrderId}>{order.id}</Text>
                        <Text style={styles.recentOrderDate}>
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.recentOrderRight}>
                      <Text style={styles.recentOrderPrice}>
                        ${(order.finalPrice ?? order.estimatedPrice).toFixed(2)}
                      </Text>
                      {order.rating && (
                        <View style={styles.ratingRow}>
                          <Star size={12} color={Colors.accent} fill={Colors.accent} />
                          <Text style={styles.ratingText}>{order.rating}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getProgressPercent(status: string): number {
  const statuses = [
    'placed', 'confirmed', 'driver_assigned', 'driver_en_route',
    'picked_up', 'at_facility', 'washing', 'drying', 'folding',
    'ready_for_delivery', 'out_for_delivery', 'delivered',
  ];
  const idx = statuses.indexOf(status);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / statuses.length) * 100);
}

function getServiceIcon(icon: string) {
  const icons: Record<string, React.ComponentType<{ size: number; color: string }>> = {
    shirt: Shirt,
    zap: Zap,
    feather: Droplets,
    'shield-check': Package,
    wind: Clock,
    sparkles: Star,
  };
  return icons[icon] || Shirt;
}

const STEPS = [
  { title: 'Schedule Pickup', desc: 'Choose your date, time, and services' },
  { title: 'We Pick Up', desc: 'A driver arrives at your door' },
  { title: 'Wash & Fold', desc: 'Expert care for your clothes' },
  { title: 'Delivered Back', desc: 'Fresh laundry, right to you' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  greeting: {
    flex: 1,
  },
  greetingLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500' as const,
  },
  greetingName: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: Colors.textInverse,
    marginTop: 2,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700' as const,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
  },
  heroCta: {
    marginBottom: 24,
  },
  heroCtaInner: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroCtaGradient: {
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  heroCtaTextGroup: {
    flex: 1,
    marginRight: 16,
  },
  heroCtaTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  heroCtaSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    fontWeight: '500' as const,
  },
  heroCtaArrow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCtaDecoCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -30,
    right: -20,
  },
  heroCtaDecoCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -20,
    left: 40,
  },
  activeOrderCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  activeOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeOrderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeOrderTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  activeOrderId: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
  },
  activeOrderBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeOrderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeOrderStatusText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  activeOrderProgress: {
    marginTop: 4,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  serviceCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  stepsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stepNumberWrap: {
    alignItems: 'center',
    width: 36,
  },
  stepNumberGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700' as const,
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  recentOrderCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  recentOrderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentOrderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentOrderId: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  recentOrderDate: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  recentOrderRight: {
    alignItems: 'flex-end',
  },
  recentOrderPrice: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
});
