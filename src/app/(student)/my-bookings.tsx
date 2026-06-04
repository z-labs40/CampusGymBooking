import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../../theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useBookings } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

export default function MyBookingsScreen() {
  const { bookings } = useBookings();
  const { user } = useAuth();

  // Filter bookings to only show the logged-in student's bookings
  const myBookings = bookings.filter((b) => b.studentId === user?.id);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <Text style={styles.headerSubtitle}>View and manage your upcoming sessions.</Text>
        </View>

        {myBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="calendar" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>You don't have any bookings yet.</Text>
          </View>
        ) : (
          myBookings.map((booking) => {
            let statusColor = Colors.primary;
            let statusBg = 'rgba(16, 185, 129, 0.15)';
            let iconName: any = 'clock';

            if (booking.status === 'approved') {
              statusColor = Colors.success;
              statusBg = 'rgba(16, 185, 129, 0.15)';
              iconName = 'check-circle';
            } else if (booking.status === 'rejected') {
              statusColor = Colors.error;
              statusBg = 'rgba(239, 68, 68, 0.15)';
              iconName = 'x-circle';
            } else if (booking.status === 'pending') {
              statusColor = Colors.waitlist;
              statusBg = 'rgba(245, 158, 11, 0.15)';
              iconName = 'clock';
            }

            return (
              <GlassCard key={booking.id} intensity={40} style={styles.bookingCard} contentStyle={styles.bookingCardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.facilityInfo}>
                    <View style={styles.iconBox}>
                      <Ionicons name={booking.facility.includes('Gym') ? 'barbell-outline' : 'tennisball-outline'} size={20} color="#fff" />
                    </View>
                    <Text style={[styles.facilityName, { flexShrink: 1 }]} numberOfLines={1}>
                      {booking.facility}
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: statusBg }]}>
                    <Feather name={iconName} size={12} color={statusColor} style={{ marginRight: 4 }} />
                    <Text style={[styles.badgeText, { color: statusColor }]}>
                      {booking.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Feather name="calendar" size={16} color={Colors.textMuted} />
                    <Text style={styles.detailText}>{booking.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Feather name="clock" size={16} color={Colors.textMuted} />
                    <Text style={styles.detailText}>{booking.time}</Text>
                  </View>
                </View>
              </GlassCard>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.xxl + 20,
    paddingBottom: Spacing.xxl + 80,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.title,
    fontSize: 32,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  bookingCard: {
    marginBottom: Spacing.md,
  },
  bookingCardContent: {
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  facilityInfo: {
    flexShrink: 1, // Allows text to naturally expand and only shrink/truncate when it hits the badge
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  facilityName: {
    ...Typography.subtitle,
    fontSize: 18,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: Spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.xl,
  },
  detailText: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: Spacing.xs,
  },
});
