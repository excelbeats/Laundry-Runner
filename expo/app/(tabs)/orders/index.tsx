import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Package, ChevronRight, RefreshCw, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppState } from '@/hooks/useAppState';
import { ORDER_STATUS_CONFIG } from '@/mocks/data';
import { Order } from '@/types';

type FilterType = 'all' | 'active' | 'completed';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useAppState();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredOrders = useMemo(() => {
    switch (filter) {
      case 'active':
        return orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
      case 'completed':
        return orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');
      default:
        return orders;
    }
  }, [orders, filter]);

  const handleOrderPress = useCallback((order: Order) => {
    router.push({ pathname: '/order-details', params: { id: order.id } });
  }, [router]);

  const handleReorder = useCallback((_order: Order) => {
    router.push('/schedule-pickup');
  }, [router]);

  const renderOrder = useCallback(({ item }: { item: Order }) => {
    const config = ORDER_STATUS_CONFIG[item.status];
    const isCompleted = item.status === 'delivered';
    const serviceNames = item.services
      .map(s => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
      .join(', ');

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => handleOrderPress(item)}
        activeOpacity={0.8}
        testID={`order-${item.id}`}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderIdRow}>
            <View style={[styles.statusIndicator, { backgroundColor: config.color }]} />
            <Text style={styles.orderId}>{item.id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: config.color + '15' }]}>
            <Text style={[styles.statusText, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
        </View>

        <View style={styles.orderBody}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderServices} numberOfLines={1}>
              {serviceNames}
            </Text>
            <Text style={styles.orderMeta}>
              {item.estimatedPounds} lbs · {new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <Text style={styles.orderPrice}>
            ${(item.finalPrice ?? item.estimatedPrice).toFixed(2)}
          </Text>
        </View>

        {item.rating && (
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                size={14}
                color={i <= item.rating! ? Colors.accent : Colors.borderLight}
                fill={i <= item.rating! ? Colors.accent : 'none'}
              />
            ))}
          </View>
        )}

        <View style={styles.orderFooter}>
          {isCompleted ? (
            <TouchableOpacity
              style={styles.reorderButton}
              onPress={() => handleReorder(item)}
            >
              <RefreshCw size={14} color={Colors.primary} />
              <Text style={styles.reorderText}>Reorder</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.trackHint}>
              <Text style={styles.trackHintText}>View details</Text>
              <ChevronRight size={16} color={Colors.textTertiary} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [handleOrderPress, handleReorder]);

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {(['all', 'active', 'completed'] as FilterType[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[styles.filterText, filter === f && styles.filterTextActive]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Package size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              Schedule your first pickup to get started
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/schedule-pickup')}
            >
              <Text style={styles.emptyButtonText}>Schedule Pickup</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.textInverse,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  orderBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderInfo: {
    flex: 1,
    marginRight: 12,
  },
  orderServices: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  orderMeta: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 8,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 10,
    marginTop: 4,
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  reorderText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  trackHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trackHintText: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  emptyButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
