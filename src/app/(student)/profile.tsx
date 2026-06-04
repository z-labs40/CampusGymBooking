import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { Colors, Spacing, Typography } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Name and Email are required.');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({ name, email, rollNumber });
      Alert.alert('Success', 'Your profile has been updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setIsLoading(true);
      try {
        await updateProfile({ avatarUri: result.assets[0].uri });
      } catch (error) {
        Alert.alert('Error', 'Failed to save profile photo.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
              <View style={styles.avatarCircle}>
                {user?.avatarUri ? (
                  <Image source={{ uri: user.avatarUri }} style={styles.avatarImage} />
                ) : (
                  <Feather name="user" size={40} color="#fff" />
                )}
              </View>
              <View style={styles.editAvatarBtn}>
                <Feather name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userRole}>{user?.role.toUpperCase()}</Text>
        </View>

        {/* Edit Form */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <GlassCard intensity={30} style={styles.formCard} contentStyle={{ padding: Spacing.lg }}>
          <Input 
            label="Full Name" 
            value={name} 
            onChangeText={setName} 
            placeholder="Enter your full name" 
            autoCapitalize="words"
          />
          <Input 
            label="College Email" 
            value={email} 
            onChangeText={setEmail} 
            placeholder="student@college.edu" 
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input 
            label="Roll Number" 
            value={rollNumber} 
            onChangeText={setRollNumber} 
            placeholder="e.g. CS101" 
            autoCapitalize="characters"
          />
          
          <Button 
            title="Save Changes" 
            onPress={handleSave} 
            isLoading={isLoading}
            style={{ marginTop: Spacing.md }}
          />
        </GlassCard>

        {/* App Settings & Logout */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Account</Text>
        <GlassCard intensity={30} style={styles.formCard} contentStyle={{ padding: Spacing.md }}>
    
          <TouchableOpacity onPress={handleLogout} style={styles.actionRow}>
            <Feather name="log-out" size={20} color={Colors.error} />
            <Text style={[styles.actionText, { color: Colors.error }]}>Log Out</Text>
          </TouchableOpacity>
        </GlassCard>

      </ScrollView>
      </KeyboardAvoidingView>
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
  avatarSection: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
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
  formCard: {
    padding: 0,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  actionText: {
    ...Typography.body,
    flex: 1,
    marginLeft: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
});
