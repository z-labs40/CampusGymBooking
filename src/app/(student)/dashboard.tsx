import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../../theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { useFacilities } from '../../context/FacilityContext';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const router = useRouter();
  const { facilities, loadFacilities } = useFacilities();
  const { user } = useAuth();

  React.useEffect(() => {
    loadFacilities();
  }, []);

  const mainGym = facilities.find(f => f.id === 'gym-main');
  const isGymMaintenance = mainGym?.status === 'maintenance';

  const handleBookGym = () => {
    router.push('/slot/gym');
  };

  const handleBookCourts = () => {
    router.push('/(student)/courts');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name ? user.name.split(' ')[0] : 'Student'}!</Text>
            <Text style={styles.subtitle}>Ready for a workout?</Text>
          </View>
         
        </View>

        {/* Quick Stats Section */}
        <View style={styles.statsContainer}>
          <GlassCard intensity={40} style={styles.statPill} contentStyle={styles.statPillContent}>
            <Feather name="activity" size={16} color={Colors.primaryLight} style={{ marginRight: 8 }} />
            <Text style={styles.statText} numberOfLines={1}>2 Workouts</Text>
          </GlassCard>
          <GlassCard intensity={40} style={styles.statPill} contentStyle={styles.statPillContent}>
            <Feather name="clock" size={16} color={Colors.secondary} style={{ marginRight: 8 }} />
            <Text style={styles.statText} numberOfLines={1}>140 Mins</Text>
          </GlassCard>
        </View>

        {/* Featured Facilities Carousel */}
        <Text style={styles.sectionTitle}>Featured Facilities</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          snapToInterval={280 + Spacing.md}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContainer}
        >
          {/* Gym Card */}
          <TouchableOpacity 
            onPress={handleBookGym} 
            activeOpacity={0.9} 
            style={styles.carouselCard}
            disabled={isGymMaintenance}
          >
            <ImageBackground 
              source={require('../../../assets/images/gym-bg.jpg')} 
              style={styles.cardImage}
              imageStyle={{ borderRadius: 24 }}
            >
              <LinearGradient
                colors={['transparent', isGymMaintenance ? 'rgba(239, 68, 68, 0.95)' : 'rgba(15, 23, 42, 0.95)']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.cardContent}>
                {isGymMaintenance ? (
                  <View style={[styles.badge, { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }]}>
                    <Text style={[styles.badgeText, { color: Colors.error }]}>UNDER MAINTENANCE</Text>
                  </View>
                ) : (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Main Facility</Text>
                  </View>
                )}
                <View>
                  <Text style={styles.cardTitle}>Campus Gym</Text>
                  <Text style={styles.cardDesc}>Weightlifting & Cardio zones.</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* Courts Card */}
          <TouchableOpacity onPress={handleBookCourts} activeOpacity={0.9} style={styles.carouselCard}>
            <ImageBackground 
              source={require('../../../assets/images/court-bg.jpg')} 
              style={styles.cardImage}
              imageStyle={{ borderRadius: 24 }}
            >
              <LinearGradient
                colors={['transparent', 'rgba(15, 23, 42, 0.95)']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.cardContent}>
                <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.5)' }]}>
                  <Text style={[styles.badgeText, { color: Colors.success }]}>Badminton</Text>
                </View>
                <View>
                  <Text style={styles.cardTitle}>Indoor Courts</Text>
                  <Text style={styles.cardDesc}>Professional sprung flooring.</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </ScrollView>

        {/* Today's Activity Timeline */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.md }]}>Today's Activity</Text>
        <View style={styles.timelineContainer}>
          
          <View style={styles.timelineRow}>
            {/* Timeline Line/Icon */}
            <View style={styles.timelineGraphic}>
              <View style={styles.timelineDot}>
                <Ionicons name="barbell" size={14} color="#fff" />
              </View>
              <View style={styles.timelineLine} />
            </View>
            
            {/* Timeline Content */}
            <GlassCard intensity={40} style={styles.timelineCard}>
              <View style={styles.activityRow}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>Gym Session</Text>
                  <Text style={styles.activityTime}>6:45 PM - 7:30 PM</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 0 }]}>
                  <Text style={[styles.badgeText, { color: Colors.success }]}>Upcoming</Text>
                </View>
              </View>
            </GlassCard>
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.timelineGraphic}>
              <View style={[styles.timelineDot, { backgroundColor: 'rgba(148, 163, 184, 0.2)' }]}>
                <Ionicons name="tennisball" size={14} color={Colors.textMuted} />
              </View>
            </View>
            
            <View style={[styles.timelineCard, { opacity: 0.6, paddingLeft: Spacing.md, paddingTop: 4 }]}>
              <Text style={[styles.activityName, { color: Colors.textMuted }]}>Court 2 Session</Text>
              <Text style={styles.activityTime}>Finished at 8:00 AM</Text>
            </View>
          </View>

        </View>

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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl + 80, // Space for tabs
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  greeting: {
    ...Typography.title,
    fontSize: 28,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  statPill: {
    width: '48%',
    borderRadius: 20,
  },
  statPillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: '#fff',
  },
  sectionTitle: {
    ...Typography.subtitle,
    fontSize: 20,
    marginBottom: Spacing.lg,
  },
  carouselContainer: {
    paddingRight: Spacing.lg, // Allows scrolling slightly past the last card
    marginBottom: Spacing.lg,
  },
  carouselCard: {
    width: 280,
    height: 320,
    marginRight: Spacing.md,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  cardContent: {
    padding: Spacing.lg,
    height: '100%',
    justifyContent: 'space-between',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: Colors.primaryLight,
  },
  cardTitle: {
    ...Typography.subtitle,
    fontSize: 28,
    color: '#fff',
    marginBottom: 4,
  },
  cardDesc: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
  },
  timelineContainer: {
    paddingTop: Spacing.sm,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  timelineGraphic: {
    alignItems: 'center',
    width: 24,
    marginRight: Spacing.md,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
    top: 32,
    bottom: -Spacing.md,
    zIndex: 1,
  },
  timelineCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 16,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  activityTime: {
    ...Typography.bodySmall,
    marginTop: 4,
    color: Colors.textMuted,
  },
});
