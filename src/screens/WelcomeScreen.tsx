import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import AstroButton from '../components/AstroButton';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Karanlık tema ile yıldızlar ve gezegenler animasyonu */}
      <LottieView 
        source={require('../../assets/lottie/nebula.json')} 
        autoPlay 
        loop 
        style={styles.bgAnim}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Zodyağın tuzağından kurtul</Text>
        <Text style={styles.subtitle}>Astro Kaçış'a Hoş Geldin</Text>
      <AstroButton title="Başla" onPress={() => navigation.navigate('BirthInput')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0A0A0A',
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  bgAnim: { 
    position: 'absolute', 
    width: '100%', 
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover'
  },
  content: {
    alignItems: 'center',
    zIndex: 1
  },
  title: { 
    color: '#fff', 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 16,
    textShadowColor: '#b0b0ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10
  },
  subtitle: { 
    color: '#b0b0ff', 
    fontSize: 18, 
    textAlign: 'center', 
    marginBottom: 40,
    fontStyle: 'italic'
  }
}); 