import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Colors, Spacing, Typography } from '../../theme';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../../components/ui/GlassCard';

export default function AdminProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="shield-checkmark" size={48} color="#fff" />
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userRole}>SYSTEM ADMINISTRATOR</Text>
        </View>

        {/* Profile Info */}
        <Text style={styles.sectionTitle}>Admin Information</Text>
        <GlassCard intensity={30} style={styles.infoCard} contentStyle={{ padding: Spacing.lg }}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{user?.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email Address</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </GlassCard>

        {/* Actions */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Account Actions</Text>
        <GlassCard intensity={30} style={styles.infoCard} contentStyle={{ padding: Spacing.md }}>
          <TouchableOpacity onPress={handleLogout} style={styles.actionRow}>
            <Feather name="log-out" size={20} color={Colors.error} />
            <Text style={[styles.actionText, { color: Colors.error }]}>Log Out</Text>
          </TouchableOpacity>
        </GlassCard>

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
    paddingBottom: Spacing.xxl + 80, // Space for the tab bar
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  userName: {
    ...Typography.title,
    fontSize: 24,
  },
  userRole: {
    ...Typography.bodySmall,
    color: Colors.primaryLight,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 4,
  },
  sectionTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.md,
  },
  infoCard: {
    padding: 0,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  infoValue: {
    ...Typography.body,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  actionText: {
    ...Typography.body,
    fontWeight: 'bold',
    marginLeft: Spacing.md,
  },
});
