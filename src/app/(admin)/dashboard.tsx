import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { Colors, Spacing, Typography } from '../../theme';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../../components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';

type Tab = 'queue' | 'history';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { bookings, loadBookings, approveBooking, rejectBooking } = useBookings();
  const [activeTab, setActiveTab] = useState<Tab>('queue');

  useEffect(() => {
    loadBookings(true);
  }, []);

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const approvedBookings = bookings.filter((b) => b.status === 'approved');
  const rejectedBookings = bookings.filter((b) => b.status === 'rejected');

  const historyBookings = [...approvedBookings, ...rejectedBookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(16, 185, 129, 0.25)', 'transparent']} style={styles.absoluteGradient} />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Executive Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarCircle}>
                <Ionicons name="shield-checkmark" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.greeting}>Admin Portal</Text>
                <Text style={styles.subtitle}>Executive Control Center</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats Carousel */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
            <GlassCard intensity={40} style={[styles.statCard, { borderColor: 'rgba(245, 158, 11, 0.5)' }]} contentStyle={styles.statContent}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Feather name="clock" size={20} color={Colors.waitlist} />
              </View>
              <Text style={styles.statNumber}>{pendingBookings.length}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </GlassCard>
            
            <GlassCard intensity={40} style={[styles.statCard, { borderColor: 'rgba(16, 185, 129, 0.5)' }]} contentStyle={styles.statContent}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Feather name="check-circle" size={20} color={Colors.success} />
              </View>
              <Text style={styles.statNumber}>{approvedBookings.length}</Text>
              <Text style={styles.statLabel}>Approved</Text>
            </GlassCard>

            <GlassCard intensity={40} style={[styles.statCard, { borderColor: 'rgba(239, 68, 68, 0.5)' }]} contentStyle={styles.statContent}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Feather name="x-circle" size={20} color={Colors.error} />
              </View>
              <Text style={styles.statNumber}>{rejectedBookings.length}</Text>
              <Text style={styles.statLabel}>Declined</Text>
            </GlassCard>
          </ScrollView>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'queue' && styles.activeTabBtn]}
              onPress={() => setActiveTab('queue')}
            >
              <Text style={[styles.tabText, activeTab === 'queue' && styles.activeTabText]}>Pending Queue</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'history' && styles.activeTabBtn]}
              onPress={() => setActiveTab('history')}
            >
              <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History Log</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content Area */}
          {activeTab === 'queue' ? (
            <View>
              {pendingBookings.length === 0 ? (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconCircle}>
                    <Feather name="inbox" size={40} color={Colors.primary} />
                  </View>
                  <Text style={styles.emptyTitle}>Inbox Zero</Text>
                  <Text style={styles.emptyText}>All requests have been processed.</Text>
                </View>
              ) : (
                pendingBookings.map((booking) => (
                  <GlassCard key={booking.id} intensity={30} style={styles.requestCard} contentStyle={styles.requestContent}>
                    <View style={styles.requestHeader}>
                      <View style={{ flexShrink: 1 }}>
                        <Text style={styles.studentName} numberOfLines={1}>{booking.student?.name || 'Unknown'}</Text>
                        <Text style={styles.requestTime} numberOfLines={1}>Requested at {new Date(booking.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                      </View>
                      <View style={[styles.facilityBadge, { flexShrink: 1, marginLeft: Spacing.md }]}>
                        <Text style={styles.facilityBadgeText} numberOfLines={1}>{booking.facility?.name || 'Unknown'}</Text>
                      </View>
                    </View>

                    <View style={styles.detailsRow}>
                      <View style={styles.detailItem}>
                        <Feather name="calendar" size={14} color={Colors.textMuted} />
                        <Text style={styles.detailText}>{booking.date}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Feather name="clock" size={14} color={Colors.textMuted} />
                        <Text style={styles.detailText}>{booking.time}</Text>
                      </View>
                    </View>

                    <View style={styles.actionsRow}>
                      <TouchableOpacity 
                        style={[styles.actionBtn, styles.rejectBtn]} 
                        onPress={() => rejectBooking(booking.id)}
                      >
                        <Feather name="x" size={18} color={Colors.error} />
                        <Text style={styles.rejectText}>Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionBtn, styles.approveBtn]} 
                        onPress={() => approveBooking(booking.id)}
                      >
                        <Feather name="check" size={18} color="#fff" />
                        <Text style={styles.approveText}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  </GlassCard>
                ))
              )}
            </View>
          ) : (
            <View>
              {historyBookings.length === 0 ? (
                <View style={styles.emptyState}>
                  <Feather name="clock" size={48} color={Colors.textMuted} style={{ opacity: 0.5 }} />
                  <Text style={styles.emptyText}>No historical logs available.</Text>
                </View>
              ) : (
                historyBookings.map((booking) => (
                  <GlassCard key={booking.id} intensity={20} style={styles.historyCard} contentStyle={styles.historyContent}>
                    <View style={styles.historyRow}>
                      <View style={[
                        styles.historyIconBox, 
                        booking.status === 'approved' ? { backgroundColor: 'rgba(16, 185, 129, 0.2)' } : { backgroundColor: 'rgba(239, 68, 68, 0.2)' }
                      ]}>
                        <Feather 
                          name={booking.status === 'approved' ? "check" : "x"} 
                          size={16} 
                          color={booking.status === 'approved' ? Colors.success : Colors.error} 
                        />
                      </View>
                      <View style={styles.historyTextContainer}>
                        <Text style={styles.historyTitle} numberOfLines={1}>
                          {booking.student?.name || 'Unknown'} <Text style={{fontWeight: 'normal', color: Colors.textMuted}}>for</Text> {booking.facility?.name || 'Unknown'}
                        </Text>
                        <Text style={styles.historySub}>
                          {booking.date} at {booking.time}
                        </Text>
                      </View>
                      <View style={[
                        styles.historyStatusBadge,
                        booking.status === 'approved' ? { borderColor: Colors.success } : { borderColor: Colors.error }
                      ]}>
                        <Text style={[
                          styles.historyStatusText,
                          booking.status === 'approved' ? { color: Colors.success } : { color: Colors.error }
                        ]}>
                          {booking.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </GlassCard>
                ))
              )}
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  absoluteGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing.xxl + 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  greeting: {
    ...Typography.title,
    fontSize: 26,
    color: '#fff',
  },
  subtitle: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statsScroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  statCard: {
    width: 140,
    padding: 0,
    marginRight: Spacing.md,
  },
  statContent: {
    padding: Spacing.lg,
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statNumber: {
    ...Typography.title,
    fontSize: 32,
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: Spacing.lg,
    borderRadius: 20,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 16,
  },
  activeTabBtn: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  tabText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  activeTabText: {
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.title,
    fontSize: 22,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  requestCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: 0,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  requestContent: {
    padding: Spacing.lg,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  studentName: {
    ...Typography.subtitle,
    fontSize: 18,
  },
  requestTime: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: 2,
  },
  facilityBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  facilityBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryLight,
    textTransform: 'uppercase',
  },
  detailsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.xl,
  },
  detailText: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  rejectBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  approveBtn: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  rejectText: {
    ...Typography.body,
    fontWeight: 'bold',
    color: Colors.error,
    marginLeft: 8,
  },
  approveText: {
    ...Typography.body,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  historyCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  historyContent: {
    padding: Spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  historyTextContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  historyTitle: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  historySub: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: 2,
  },
  historyStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  historyStatusText: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
