import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useFacilities } from '../../context/FacilityContext';
import { Colors, Spacing, Typography } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../../components/ui/GlassCard';

export default function AdminFacilitiesScreen() {
  const { facilities, updateFacilityStatus } = useFacilities();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Facility Operations</Text>
          <Text style={styles.headerSubtitle}>Toggle maintenance mode for facilities to lock student bookings.</Text>
        </View>

        {/* Facilities List */}
        <View style={styles.listContainer}>
          {facilities.map((facility) => {
            const isMaintenance = facility.status === 'maintenance';
            
            return (
              <GlassCard 
                key={facility.id} 
                intensity={30} 
                style={[
                  styles.facilityCard, 
                  isMaintenance && styles.maintenanceCard
                ]} 
                contentStyle={styles.facilityContent}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.iconBox}>
                    <Feather 
                      name={facility.type === 'gym' ? 'activity' : 'crosshair'} 
                      size={20} 
                      color={isMaintenance ? Colors.error : Colors.primaryLight} 
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.facilityName}>{facility.name}</Text>
                    <Text style={styles.facilityType}>{facility.type.toUpperCase()}</Text>
                  </View>
                  <View style={styles.switchContainer}>
                    <Switch
                      value={!isMaintenance}
                      onValueChange={(value) => {
                        updateFacilityStatus(facility.id, value ? 'available' : 'maintenance');
                      }}
                      trackColor={{ false: 'rgba(239, 68, 68, 0.5)', true: 'rgba(16, 185, 129, 0.5)' }}
                      thumbColor={!isMaintenance ? Colors.success : Colors.error}
                      ios_backgroundColor="rgba(239, 68, 68, 0.3)"
                    />
                  </View>
                </View>
                
                <View style={styles.statusRow}>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: isMaintenance ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)' }
                  ]}>
                    <View style={[
                      styles.statusDot, 
                      { backgroundColor: isMaintenance ? Colors.error : Colors.success }
                    ]} />
                    <Text style={[
                      styles.statusText, 
                      { color: isMaintenance ? Colors.error : Colors.success }
                    ]}>
                      {isMaintenance ? 'UNDER MAINTENANCE' : 'ACTIVE'}
                    </Text>
                  </View>
                </View>
              </GlassCard>
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
    paddingBottom: Spacing.xxl + 80,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.title,
    fontSize: 28,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    marginTop: 4,
  },
  listContainer: {
    gap: Spacing.md,
  },
  facilityCard: {
    padding: 0,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  maintenanceCard: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  facilityContent: {
    padding: Spacing.lg,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  facilityName: {
    ...Typography.subtitle,
    fontSize: 18,
  },
  facilityType: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontWeight: 'bold',
    marginTop: 2,
  },
  switchContainer: {
    marginLeft: Spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
