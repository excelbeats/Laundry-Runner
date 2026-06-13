import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Users,
  Truck,
  Package,
  DollarSign,
  TrendingUp,
  MapPin,
  AlertCircle,
  ChevronRight,
  Settings,
  Shield,
  Tag,
  MessageCircle,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MetricCard {
  label: string;
  value: string;
  change: string;
  changePositive: boolean;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
}

const METRICS: MetricCard[] = [
  { label: 'Revenue Today', value: '$2,847', change: '+12.5%', changePositive: true, icon: DollarSign, color: Colors.success },
  { label: 'Active Orders', value: '34', change: '+8', changePositive: true, icon: Package, color: Colors.primary },
  { label: 'Online Drivers', value: '12', change: '-2', changePositive: false, icon: Truck, color: Colors.info },
  { label: 'New Customers', value: '47', change: '+23%', changePositive: true, icon: Users, color: Colors.accent },
];

interface RecentOrder {
  id: string;
  customer: string;
  driver: string;
  status: string;
  statusColor: string;
  amount: number;
  time: string;
}

const RECENT_ORDERS: RecentOrder[] = [
  { id: 'ORD-2850', customer: 'Sarah K.', driver: 'Marcus J.', status: 'Washing', statusColor: '#3B82F6', amount: 34.50, time: '2m ago' },
  { id: 'ORD-2849', customer: 'Mike R.', driver: 'David L.', status: 'Pickup', statusColor: '#F97316', amount: 28.00, time: '15m ago' },
  { id: 'ORD-2848', customer: 'Jennifer L.', driver: 'Unassigned', status: 'Pending', statusColor: '#F59E0B', amount: 42.75, time: '22m ago' },
  { id: 'ORD-2847', customer: 'Alex P.', driver: 'Marcus J.', status: 'Folding', statusColor: '#14B8A6', amount: 45.80, time: '1h ago' },
  { id: 'ORD-2846', customer: 'Lisa M.', driver: 'Amy W.', status: 'Delivered', statusColor: '#10B981', amount: 29.50, time: '2h ago' },
];

interface AdminAction {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  subtitle: string;
  color: string;
  badge?: string;
}

const ADMIN_ACTIONS: AdminAction[] = [
  { icon: Users, label: 'Manage Customers', subtitle: '1,247 total', color: Colors.primary },
  { icon: Truck, label: 'Manage Drivers', subtitle: '38 active', color: Colors.info },
  { icon: MapPin, label: 'Service Zones', subtitle: '5 zones', color: Colors.success },
  { icon: DollarSign, label: 'Pricing & Plans', subtitle: '6 services', color: Colors.accent },
  { icon: Tag, label: 'Promo Codes', subtitle: '3 active', color: Colors.warning, badge: '3' },
  { icon: MessageCircle, label: 'Support Tickets', subtitle: '7 open', color: Colors.error, badge: '7' },
  { icon: Shield, label: 'Driver Verification', subtitle: '4 pending', color: '#8B5CF6', badge: '4' },
  { icon: Settings, label: 'App Settings', subtitle: 'Notifications, zones', color: Colors.textSecondary },
];

type TabType = 'overview' | 'orders' | 'manage';

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.tabRow}>
        {(['overview', 'orders', 'manage'] as TabType[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'overview' && (
        <>
          <View style={styles.metricsGrid}>
            {METRICS.map((metric) => (
              <View key={metric.label} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <View style={[styles.metricIcon, { backgroundColor: metric.color + '12' }]}>
                    <metric.icon size={18} color={metric.color} />
                  </View>
                  <View
                    style={[
                      styles.changeBadge,
                      { backgroundColor: metric.changePositive ? Colors.successLight : Colors.errorLight },
                    ]}
                  >
                    <Text
                      style={[
                        styles.changeText,
                        { color: metric.changePositive ? Colors.success : Colors.error },
                      ]}
                    >
                      {metric.change}
                    </Text>
                  </View>
                </View>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Weekly Revenue</Text>
              <View style={styles.chartBadge}>
                <TrendingUp size={14} color={Colors.success} />
                <Text style={styles.chartBadgeText}>+18.2%</Text>
              </View>
            </View>
            <View style={styles.chartBars}>
              {[65, 45, 80, 55, 90, 70, 85].map((height, idx) => (
                <View key={idx} style={styles.barContainer}>
                  <View style={[styles.bar, { height: height * 1.2 }]}>
                    <LinearGradient
                      colors={[Colors.primary, Colors.primaryLight]}
                      style={styles.barFill}
                    />
                  </View>
                  <Text style={styles.barLabel}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.alertCard}>
            <AlertCircle size={18} color={Colors.warning} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Low driver availability</Text>
              <Text style={styles.alertSubtitle}>
                Zone 3 (Mission District) has only 1 driver online
              </Text>
            </View>
          </View>
        </>
      )}

      {activeTab === 'orders' && (
        <>
          <View style={styles.orderStats}>
            <View style={styles.orderStatItem}>
              <Text style={styles.orderStatValue}>34</Text>
              <Text style={styles.orderStatLabel}>Active</Text>
            </View>
            <View style={styles.orderStatItem}>
              <Text style={styles.orderStatValue}>12</Text>
              <Text style={styles.orderStatLabel}>Pending</Text>
            </View>
            <View style={styles.orderStatItem}>
              <Text style={styles.orderStatValue}>156</Text>
              <Text style={styles.orderStatLabel}>Today</Text>
            </View>
          </View>

          {RECENT_ORDERS.map(order => (
            <TouchableOpacity key={order.id} style={styles.orderRow} activeOpacity={0.8}>
              <View style={styles.orderLeft}>
                <View style={styles.orderIdRow}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <View style={[styles.orderStatusBadge, { backgroundColor: order.statusColor + '15' }]}>
                    <Text style={[styles.orderStatusText, { color: order.statusColor }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.orderCustomer}>
                  {order.customer} → {order.driver}
                </Text>
                <Text style={styles.orderTime}>{order.time}</Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderAmount}>${order.amount.toFixed(2)}</Text>
                <ChevronRight size={16} color={Colors.textTertiary} />
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}

      {activeTab === 'manage' && (
        <View style={styles.actionsGrid}>
          {ADMIN_ACTIONS.map((action) => (
            <TouchableOpacity key={action.label} style={styles.actionCard} activeOpacity={0.8}>
              <View style={styles.actionCardHeader}>
                <View style={[styles.actionIcon, { backgroundColor: action.color + '12' }]}>
                  <action.icon size={20} color={action.color} />
                </View>
                {action.badge && (
                  <View style={styles.actionBadge}>
                    <Text style={styles.actionBadgeText}>{action.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
    padding: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
  },
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  chartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chartBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    flex: 1,
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: '600' as const,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.warningLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  alertSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  orderStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  orderStatItem: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  orderStatValue: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  orderStatLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  orderRow: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderLeft: {
    flex: 1,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  orderStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  orderCustomer: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  orderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderAmount: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  actionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBadge: {
    backgroundColor: Colors.error,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  actionBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700' as const,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
