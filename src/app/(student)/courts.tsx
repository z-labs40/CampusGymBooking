import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useFacilities } from '../../context/FacilityContext';

export default function CourtsScreen() {
  const router = useRouter();
  const { facilities } = useFacilities();

  // Filter out only courts
  const COURTS = facilities.filter(f => f.type === 'court');

  const handleSelectCourt = (courtId: string) => {
    router.push(`/slot/court-${courtId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reserve a Court</Text>
          <Text style={styles.headerSubtitle}>Explore our state-of-the-art facilities and book your session instantly.</Text>
        </View>

        <View style={styles.courtsContainer}>
          {COURTS.map((court, index) => {
            const isMaintenance = court.status === 'maintenance';
            return (
              <TouchableOpacity 
                key={court.id} 
                disabled={isMaintenance}
                onPress={() => handleSelectCourt(court.id)}
                activeOpacity={0.8}
                style={[styles.cardContainer, { marginTop: index === 0 ? 0 : Spacing.lg }]}
              >
                <ImageBackground 
                  source={require('../../../assets/images/court-bg.png')} 
                  style={styles.cardImage} 
                  imageStyle={styles.cardImageStyle}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(15, 23, 42, 0.95)']}
                    style={StyleSheet.absoluteFill}
                  />
                  
                  {isMaintenance && (
                    <View style={styles.maintenanceOverlay}>
                      <Ionicons name="construct" size={48} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.maintenanceText}>UNDER MAINTENANCE</Text>
                    </View>
                  )}

                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <View style={[
                        styles.badge, 
                        isMaintenance ? styles.badgeMaintenance : styles.badgeAvailable
                      ]}>
                        <Text style={[
                          styles.badgeText, 
                          isMaintenance ? styles.textMaintenance : styles.textAvailable
                        ]}>
                          {isMaintenance ? 'Unavailable' : 'Available Now'}
                        </Text>
                      </View>
                      {!isMaintenance && (
                        <View style={styles.actionCircle}>
                          <Feather name="arrow-right" size={20} color="#fff" />
                        </View>
                      )}
                    </View>
                    
                    <View>
                      <Text style={styles.courtName}>{court.name}</Text>
                      <Text style={styles.courtDesc} numberOfLines={2}>{court.description}</Text>
                      
                      <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                          <Feather name="clock" size={14} color={Colors.textMuted} />
                          <Text style={styles.metaText}>45 min slots</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Feather name="users" size={14} color={Colors.textMuted} />
                          <Text style={styles.metaText}>Max 4 players</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
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
    paddingTop: Spacing.xxl + 20,
    paddingBottom: Spacing.xxl + 80, // Tabs
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
  courtsContainer: {
    flexDirection: 'column',
  },
  cardContainer: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  cardImageStyle: {
    borderRadius: 24,
  },
  maintenanceOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  maintenanceText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: Spacing.sm,
  },
  cardContent: {
    padding: Spacing.lg,
    height: '100%',
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
  },
  badgeAvailable: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  badgeMaintenance: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textAvailable: {
    color: Colors.success,
  },
  textMaintenance: {
    color: Colors.error,
  },
  actionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courtName: {
    ...Typography.subtitle,
    fontSize: 24,
    color: '#fff',
    marginBottom: 4,
  },
  courtDesc: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  metaText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginLeft: 4,
  },
});
