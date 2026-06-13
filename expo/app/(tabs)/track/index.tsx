import React, { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MapPin,
  Truck,
  Package,
  Droplets,
  Wind,
  Layers,
  CircleCheckBig,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppState } from '@/hooks/useAppState';
import { ORDER_STATUS_CONFIG, mockDriver } from '@/mocks/data';

const STATUS_STEPS = [
  { key: 'placed', icon: Clock, label: 'Placed' },
  { key: 'picked_up', icon: Package, label: 'Picked Up' },
  { key: 'washing', icon: Droplets, label: 'Washing' },
  { key: 'drying', icon: Wind, label: 'Drying' },
  { key: 'folding', icon: Layers, label: 'Folding' },
  { key: 'out_for_delivery', icon: Truck, label: 'Delivery' },
  { key: 'delivered', icon: CircleCheckBig, label: 'Done' },
] as const;

export default function TrackScreen() {
  const router = useRouter();
  const { orders } = useAppState();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const activeOrder = useMemo(
    () => orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled'),
    [orders]
  );

  useEffect(() => {
    if (activeOrder) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [activeOrder, pulseAnim]);

  const currentStepIndex = useMemo(() => {
    if (!activeOrder) return -1;
    const allStatuses = [
      'placed', 'confirmed', 'driver_assigned', 'driver_en_route',
      'picked_up', 'at_facility', 'washing', 'drying', 'folding',
      'ready_for_delivery', 'out_for_delivery', 'delivered',
    ];
    const orderIdx = allStatuses.indexOf(activeOrder.status);
    return STATUS_STEPS.findIndex((step, i) => {
      const stepIdx = allStatuses.indexOf(step.key);
      const nextStep = STATUS_STEPS[i + 1];
      const nextIdx = nextStep ? allStatuses.indexOf(nextStep.key) : 999;
      return orderIdx >= stepIdx && orderIdx < nextIdx;
    });
  }, [activeOrder]);

  if (!activeOrder) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrap}>
          <MapPin size={48} color={Colors.textTertiary} />
        </View>
        <Text style={styles.emptyTitle}>No active orders</Text>
        <Text style={styles.emptySubtitle}>
          When you place an order, you can track it in real-time here
        </Text>
        <TouchableOpacity
          style={styles.scheduleBtn}
          onPress={() => router.push('/schedule-pickup')}
        >
          <Text style={styles.scheduleBtnText}>Schedule Pickup</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusConfig = ORDER_STATUS_CONFIG[activeOrder.status];
  const driver = mockDriver;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.mapPlaceholder}>
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
          style={styles.mapGradient}
        >
          <View style={styles.mapContent}>
            <Animated.View
              style={[
                styles.mapDriverDot,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.mapDriverDotInner}>
                <Navigation size={16} color="#fff" />
              </View>
            </Animated.View>

            <View style={styles.mapPickupPin}>
              <MapPin size={18} color={Colors.accent} fill={Colors.accent} />
              <Text style={styles.mapPinLabel}>Pickup</Text>
            </View>

            <View style={styles.mapDeliveryPin}>
              <MapPin size={18} color={Colors.success} fill={Colors.success} />
              <Text style={styles.mapPinLabel}>Delivery</Text>
            </View>

            <View style={styles.mapRoute} />

            <View style={styles.etaCard}>
              <Text style={styles.etaLabel}>Estimated</Text>
              <Text style={styles.etaValue}>
                {activeOrder.status === 'driver_en_route' ? '12 min' : '~4 hrs'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusCardHeader}>
          <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
          <View>
            <Text style={styles.statusCardTitle}>{statusConfig.label}</Text>
            <Text style={styles.statusCardOrder}>{activeOrder.id}</Text>
          </View>
        </View>

        <View style={styles.stepsRow}>
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const IconComp = step.icon;
            return (
              <View key={step.key} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepDot,
                    isCompleted && styles.stepDotCompleted,
                    isCurrent && styles.stepDotCurrent,
                  ]}
                >
                  <IconComp
                    size={14}
                    color={
                      isCompleted || isCurrent
                        ? '#fff'
                        : Colors.textTertiary
                    }
                  />
                </View>
                {idx < STATUS_STEPS.length - 1 && (
                  <View
                    style={[
                      styles.stepConnector,
                      isCompleted && styles.stepConnectorCompleted,
                    ]}
                  />
                )}
                <Text
                  style={[
                    styles.stepLabel,
                    (isCompleted || isCurrent) && styles.stepLabelActive,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {activeOrder.driverId && (
        <View style={styles.driverCard}>
          <View style={styles.driverInfo}>
            <View style={styles.driverAvatarWrap}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarText}>
                  {driver.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.driverOnlineDot} />
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverMeta}>
                {driver.vehicleType} · {driver.vehiclePlate}
              </Text>
              <View style={styles.driverRatingRow}>
                <Text style={styles.driverRating}>⭐ {driver.rating}</Text>
                <Text style={styles.driverTrips}>
                  · {driver.totalDeliveries} deliveries
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.driverActionBtn}>
              <Phone size={18} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.driverActionBtn}>
              <MessageCircle size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Order Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Services</Text>
          <Text style={styles.detailValue}>
            {activeOrder.services
              .map(s => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
              .join(', ')}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Weight</Text>
          <Text style={styles.detailValue}>{activeOrder.estimatedPounds} lbs</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Pickup</Text>
          <Text style={styles.detailValue}>{activeOrder.pickupAddress.street}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Delivery</Text>
          <Text style={styles.detailValue}>{activeOrder.deliveryAddress.street}</Text>
        </View>
        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValueBold}>
            ${activeOrder.estimatedPrice.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  scheduleBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  scheduleBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  mapPlaceholder: {
    height: 220,
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  mapGradient: {
    flex: 1,
    padding: 20,
  },
  mapContent: {
    flex: 1,
    position: 'relative',
  },
  mapDriverDot: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(245,158,11,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapDriverDotInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPickupPin: {
    position: 'absolute',
    top: 15,
    left: 25,
    alignItems: 'center',
  },
  mapDeliveryPin: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    alignItems: 'center',
  },
  mapPinLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600' as const,
    marginTop: 2,
  },
  mapRoute: {
    position: 'absolute',
    top: 35,
    left: 33,
    right: 38,
    bottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
    borderRadius: 20,
  },
  etaCard: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  etaLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500' as const,
  },
  etaValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700' as const,
  },
  statusCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusCardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statusCardOrder: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    zIndex: 1,
  },
  stepDotCompleted: {
    backgroundColor: Colors.success,
  },
  stepDotCurrent: {
    backgroundColor: Colors.primary,
  },
  stepConnector: {
    position: 'absolute',
    top: 14,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: Colors.borderLight,
    zIndex: 0,
  },
  stepConnectorCompleted: {
    backgroundColor: Colors.success,
  },
  stepLabel: {
    fontSize: 9,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: Colors.text,
    fontWeight: '600' as const,
  },
  driverCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  driverAvatarWrap: {
    position: 'relative',
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700' as const,
  },
  driverOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.card,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  driverMeta: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  driverRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  driverRating: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  driverTrips: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginLeft: 2,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 10,
  },
  driverActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  detailsTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500' as const,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  detailValueBold: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '700' as const,
  },
});
