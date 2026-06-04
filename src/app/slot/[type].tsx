import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Spacing, Typography } from '../../theme';
import { SlotGrid, Slot } from '../../components/SlotGrid';
import { Button } from '../../components/ui/Button';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';

// Slots are generated dynamically below

export default function SlotBookingScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { bookings, addBooking } = useBookings();
  
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const title = type === 'gym' ? 'Gym Booking' : `Court Booking (${type?.toString().replace('court-', 'Court ')})`;

  React.useEffect(() => {
    const times = [
      '6:00 AM', '6:45 AM', '7:30 AM', '8:15 AM', 
      '4:00 PM', '4:45 PM', '5:30 PM', '6:15 PM'
    ];
    
    // Find all bookings for this specific date and facility
    const existingBookings = bookings.filter(
      (b) => b.facility === title && b.date === date.toDateString()
    );

    const newSlots = times.map((time, index) => {
      let status: Slot['status'] = 'available';
      
      // If any existing booking matches this time (and isn't rejected), it's booked
      const isBooked = existingBookings.some((b) => b.time === time && b.status !== 'rejected');
      if (isBooked) {
        status = 'booked';
      }

      return {
        id: `s_${index}`,
        time,
        status,
      };
    });
    
    setSlots(newSlots);
  }, [date, bookings, title]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
    // In a real app, fetch new slots here based on date
    setSelectedSlotId(undefined);
  };

  const handleBook = () => {
    if (!selectedSlotId) return;
    
    const selectedSlot = slots.find(s => s.id === selectedSlotId);
    if (!selectedSlot) return;

    setLoading(true);
    // Submit real booking to context
    setTimeout(() => {
      addBooking({
        studentId: user?.id || 'unknown',
        studentName: user?.name || 'Unknown Student',
        facility: title,
        date: date.toDateString(),
        time: selectedSlot.time,
      });

      setLoading(false);
      Alert.alert(
        'Request Submitted',
        `Your booking request for ${date.toDateString()} at ${selectedSlot.time} has been sent to the admin for approval.`,
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Select a date and time slot</Text>

        <View style={styles.dateSection}>
          <Text style={styles.sectionLabel}>Date</Text>
          {Platform.OS === 'android' && (
            <Button 
              title={date.toDateString()} 
              onPress={() => setShowPicker(true)} 
              variant="secondary"
              style={{ marginBottom: Spacing.md }}
            />
          )}
          
          {(showPicker || Platform.OS === 'ios') && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
                themeVariant="dark" // assuming dark mode
              />
            </View>
          )}
        </View>

        <View style={styles.slotsSection}>
          <Text style={styles.sectionLabel}>Available Slots</Text>
          <SlotGrid 
            slots={slots} 
            selectedSlotId={selectedSlotId} 
            onSelectSlot={(slot) => setSelectedSlotId(slot.id)} 
          />
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Confirm Booking" 
          disabled={!selectedSlotId} 
          isLoading={loading}
          onPress={handleBook}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    ...Typography.subtitle,
    fontSize: 18,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl + 40,
  },
  title: {
    ...Typography.title,
    marginTop: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
  },
  dateSection: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    ...Typography.subtitle,
    marginBottom: Spacing.md,
  },
  pickerContainer: {
    alignItems: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.sm,
  },
  slotsSection: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
