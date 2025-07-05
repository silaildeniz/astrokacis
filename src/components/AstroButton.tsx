import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function AstroButton({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity style={[styles.button, disabled && { opacity: 0.5 }]} onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: '#6C47FF', padding: 16, borderRadius: 12, marginTop: 24, alignItems: 'center' },
  text: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
}); 