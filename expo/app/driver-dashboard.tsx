import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import {
  Navigation,
  DollarSign,
  Star,
  Package,
  Clock,
  CheckCircle,
  Phone,
  Camera,
  MapPin,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { mockDriverEarnings } from '@/mocks/data';

interface DriverJob {
  id: string;
  customerName: string;
  address: string;
  distance: string;
  items: string;
  earnings: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
  time: string;
}

const MOCK_JOBS: DriverJob[] = [
  {
    id: 'job_1',
    customerName: 'Sarah K.',
    address: '742 Evergreen Terrace, SF',
    distance: '1.2 mi',
    items: 'Wash & Fold · 12 lbs',
    earnings: 18.50,
    status: 'pending',
    time: '2:00 PM - 4:00 PM',
  },
  {
    id: 'job_2',
    customerName: 'Mike R.',
    address: '1 Market Street, Suite 500',
    distance: '2.8 mi',
    items: 'Express · 8 lbs',
    earnings: 24.00,
    status: 'pending',
    time: '4:00 PM - 6:00 PM',
  },
  {
    id: 'job_3',
    customerName: 'Jennifer L.',
    address: '456 Valencia St',
    distance: '0.8 mi',
    items: 'Delicate Care · 6 lbs',
    earnings: 15.75,
    status: 'accepted',
    time: 'Now - Pickup',
  },
];

const COMPLETED_JOBS: DriverJob[] = [
  {
    id: 'job_4',
    customerName: 'Alex P.',
    address: '200 Bush St',
    distance: '1.5 mi',
    items: 'Wash & Fold · 10 lbs',
    earnings: 16.00,
    status: 'completed',
    time: '10:00 AM',
  },
  {
    id: 'job_5',
    customerName: 'Lisa M.',
    address: '555 Mission St',
    distance: '3.1 mi',
    items: 'Express · 15 lbs',
    earnings: 32.50,
    status: 'completed',
    time: '8:30 AM',
  },
];

export default function DriverDashboardScreen() {

  const [isOnline, setIsOnline] = useState(true);
  const [jobs, setJobs] = useState<DriverJob[]>(MOCK_JOBS);
  const earnings = mockDriverEarnings;


  const handleToggleOnline = useCallback((value: boolean) => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsOnline(value);
  }, []);

  const handleAcceptJob = useCallback((jobId: string) => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, status: 'accepted' as const } : j))
    );
    Alert.alert('Job Accepted!', 'Navigate to the customer for pickup.');
  }, []);

  const handleDeclineJob = useCallback((jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  }, []);

  const handleUpdateStatus = useCallback((jobId: string) => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert('Status Updated', 'Order status has been updated.');
    setJobs(prev =>
      prev.map(j =>
        j.id === jobId ? { ...j, status: 'in_progress' as const } : j
      )
    );
  }, []);

  const activeJob = jobs.find(j => j.status === 'accepted' || j.status === 'in_progress');
  const pendingJobs = jobs.filter(j => j.status === 'pending');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.onlineRow}>
        <View style={styles.onlineInfo}>
          <View style={[styles.onlineDot, { backgroundColor: isOnline ? Colors.success : Colors.textTertiary }]} />
          <Text style={styles.onlineText}>{isOnline ? 'Online' : 'Offline'}</Text>
        </View>
        <Switch
          value={isOnline}
          onValueChange={handleToggleOnline}
          trackColor={{ false: Colors.border, true: Colors.success + '40' }}
          thumbColor={isOnline ? Colors.success : Colors.textTertiary}
        />
      </View>

      <View style={styles.earningsCard}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.earningsGradient}
        >
          <Text style={styles.earningsLabel}>Today's Earnings</Text>
          <Text style={styles.earningsValue}>${earnings.today.toFixed(2)}</Text>
          <View style={styles.earningsStats}>
            <View style={styles.earningStat}>
              <DollarSign size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.earningStatValue}>${earnings.thisWeek.toFixed(0)}</Text>
              <Text style={styles.earningStatLabel}>This Week</Text>
            </View>
            <View style={styles.earningStatDivider} />
            <View style={styles.earningStat}>
              <Package size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.earningStatValue}>{earnings.totalJobs}</Text>
              <Text style={styles.earningStatLabel}>Jobs</Text>
            </View>
            <View style={styles.earningStatDivider} />
            <View style={styles.earningStat}>
              <Star size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.earningStatValue}>{earnings.avgRating}</Text>
              <Text style={styles.earningStatLabel}>Rating</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {activeJob && (
        <>
          <Text style={styles.sectionTitle}>Active Job</Text>
          <View style={styles.activeJobCard}>
            <View style={styles.activeJobHeader}>
              <View style={styles.activeJobCustomer}>
                <View style={styles.customerAvatar}>
                  <Text style={styles.customerAvatarText}>
                    {activeJob.customerName.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.activeJobName}>{activeJob.customerName}</Text>
                  <Text style={styles.activeJobItems}>{activeJob.items}</Text>
                </View>
              </View>
              <Text style={styles.activeJobEarnings}>${activeJob.earnings.toFixed(2)}</Text>
            </View>

            <View style={styles.activeJobAddress}>
              <MapPin size={16} color={Colors.primary} />
              <Text style={styles.activeJobAddressText}>{activeJob.address}</Text>
            </View>

            <View style={styles.activeJobActions}>
              <TouchableOpacity
                style={styles.actionBtnPrimary}
                onPress={() => handleUpdateStatus(activeJob.id)}
              >
                <Navigation size={16} color="#fff" />
                <Text style={styles.actionBtnPrimaryText}>Navigate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtnSecondary}>
                <Phone size={16} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtnSecondary}>
                <Camera size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.statusUpdateRow}>
              {['Arrived', 'Picked Up', 'At Facility', 'Delivered'].map((label, idx) => (
                <TouchableOpacity
                  key={label}
                  style={[styles.statusUpdateBtn, idx === 0 && styles.statusUpdateBtnActive]}
                  onPress={() => Alert.alert('Status', `Marked as: ${label}`)}
                >
                  <Text style={[styles.statusUpdateText, idx === 0 && styles.statusUpdateTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}

      {pendingJobs.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            Nearby Pickups ({pendingJobs.length})
          </Text>
          {pendingJobs.map(job => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <View>
                  <Text style={styles.jobCustomer}>{job.customerName}</Text>
                  <Text style={styles.jobItems}>{job.items}</Text>
                </View>
                <View style={styles.jobRight}>
                  <Text style={styles.jobEarnings}>${job.earnings.toFixed(2)}</Text>
                  <Text style={styles.jobDistance}>{job.distance}</Text>
                </View>
              </View>
              <View style={styles.jobAddressRow}>
                <MapPin size={14} color={Colors.textTertiary} />
                <Text style={styles.jobAddress}>{job.address}</Text>
              </View>
              <View style={styles.jobTimeRow}>
                <Clock size={14} color={Colors.textTertiary} />
                <Text style={styles.jobTime}>{job.time}</Text>
              </View>
              <View style={styles.jobActions}>
                <TouchableOpacity
                  style={styles.declineBtn}
                  onPress={() => handleDeclineJob(job.id)}
                >
                  <Text style={styles.declineBtnText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => handleAcceptJob(job.id)}
                >
                  <LinearGradient
                    colors={[Colors.success, '#059669']}
                    style={styles.acceptBtnGradient}
                  >
                    <Text style={styles.acceptBtnText}>Accept</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      )}

      <Text style={styles.sectionTitle}>Completed Today</Text>
      {COMPLETED_JOBS.map(job => (
        <View key={job.id} style={styles.completedCard}>
          <View style={styles.completedLeft}>
            <CheckCircle size={18} color={Colors.success} />
            <View>
              <Text style={styles.completedName}>{job.customerName}</Text>
              <Text style={styles.completedItems}>{job.items}</Text>
            </View>
          </View>
          <View style={styles.completedRight}>
            <Text style={styles.completedEarnings}>${job.earnings.toFixed(2)}</Text>
            <Text style={styles.completedTime}>{job.time}</Text>
          </View>
        </View>
      ))}

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
  onlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  onlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  onlineText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  earningsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  earningsGradient: {
    padding: 24,
  },
  earningsLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500' as const,
  },
  earningsValue: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: '#fff',
    marginTop: 4,
    marginBottom: 20,
  },
  earningsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  earningStat: {
    alignItems: 'center',
    gap: 4,
  },
  earningStatValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  earningStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  earningStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
    marginTop: 4,
  },
  activeJobCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  activeJobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeJobCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  activeJobName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  activeJobItems: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  activeJobEarnings: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.success,
  },
  activeJobAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surfaceAlt,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  activeJobAddressText: {
    fontSize: 13,
    color: Colors.text,
    flex: 1,
  },
  activeJobActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionBtnPrimaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  actionBtnSecondary: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusUpdateRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statusUpdateBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
  },
  statusUpdateBtnActive: {
    backgroundColor: Colors.primary,
  },
  statusUpdateText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textTertiary,
  },
  statusUpdateTextActive: {
    color: '#fff',
  },
  jobCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  jobCustomer: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  jobItems: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  jobRight: {
    alignItems: 'flex-end',
  },
  jobEarnings: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.success,
  },
  jobDistance: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  jobAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  jobAddress: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  jobTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  jobTime: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  jobActions: {
    flexDirection: 'row',
    gap: 10,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.errorLight,
    alignItems: 'center',
  },
  declineBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.error,
  },
  acceptBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  acceptBtnGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  completedCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completedName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  completedItems: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  completedRight: {
    alignItems: 'flex-end',
  },
  completedEarnings: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  completedTime: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
