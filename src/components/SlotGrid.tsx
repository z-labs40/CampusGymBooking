import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../theme';

export interface Slot {
  id: string;
  time: string;
  status: 'available' | 'booked' | 'waitlist';
}

interface SlotGridProps {
  slots: Slot[];
  selectedSlotId?: string;
  onSelectSlot: (slot: Slot) => void;
}

export const SlotGrid: React.FC<SlotGridProps> = ({ slots, selectedSlotId, onSelectSlot }) => {
  return (
    <View style={styles.container}>
      {slots.map((slot) => {
        const isSelected = selectedSlotId === slot.id;
        const isAvailable = slot.status === 'available';
        const isBooked = slot.status === 'booked';
        const isWaitlist = slot.status === 'waitlist';

        let backgroundColor = Colors.card;
        let borderColor = 'transparent';

        let iconName: any = 'clock';
        let iconColor = Colors.textMuted;

        if (isSelected) {
          backgroundColor = Colors.primary;
          borderColor = Colors.primaryLight;
          iconName = 'check-circle';
          iconColor = '#fff';
        } else if (isAvailable) {
          backgroundColor = 'rgba(16, 185, 129, 0.1)';
          borderColor = 'rgba(16, 185, 129, 0.3)';
          iconName = 'check';
          iconColor = Colors.success;
        } else if (isWaitlist) {
          backgroundColor = 'rgba(245, 158, 11, 0.1)';
          borderColor = 'rgba(245, 158, 11, 0.3)';
          iconName = 'users';
          iconColor = Colors.waitlist;
        } else if (isBooked) {
          iconName = 'x-circle';
          iconColor = Colors.error;
        }

        return (
          <TouchableOpacity
            key={slot.id}
            disabled={isBooked}
            onPress={() => onSelectSlot(slot)}
            style={[
              styles.slot,
              { backgroundColor, borderColor, borderWidth: 1 },
              isBooked && styles.slotBooked,
            ]}
          >
            <View style={styles.slotHeader}>
              <Feather name={iconName} size={16} color={iconColor} style={{ marginRight: 6 }} />
              <Text
                style={[
                  styles.timeText,
                  isSelected && styles.textSelected,
                  isBooked && styles.textBooked,
                  isWaitlist && !isSelected && styles.textWaitlist,
                  isAvailable && !isSelected && styles.textAvailable,
                ]}
              >
                {slot.time}
              </Text>
            </View>
            <Text
              style={[
                styles.statusText,
                isSelected && styles.textSelected,
                isBooked && styles.textBooked,
                isWaitlist && !isSelected && styles.textWaitlist,
                isAvailable && !isSelected && styles.textAvailable,
              ]}
            >
              {slot.status === 'waitlist' ? 'Join Waitlist' : slot.status}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  slot: {
    width: '48%',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  slotBooked: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderColor: 'rgba(239, 68, 68, 0.1)',
    opacity: 0.6,
  },
  timeText: {
    ...Typography.subtitle,
    fontSize: 16,
  },
  statusText: {
    ...Typography.bodySmall,
    textTransform: 'capitalize',
  },
  textSelected: {
    color: '#fff',
  },
  textBooked: {
    color: Colors.error,
  },
  textWaitlist: {
    color: Colors.waitlist,
  },
  textAvailable: {
    color: Colors.success,
  },
});
