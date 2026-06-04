import React from 'react';
import { StyleSheet, ViewProps, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../theme';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
  contentStyle?: any;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, contentStyle, intensity = 40, ...props }) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 41, 59, 0.4)', // Base tint before blur
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  content: {
    padding: 24,
  },
});
