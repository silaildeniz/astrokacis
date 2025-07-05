import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function PremiumScreen({ navigation, route }: any) {
  const { user } = route.params;

  const handlePurchase = () => {
    // İleride: expo-in-app-purchases veya Stripe entegrasyonu
    alert('Ödeme sistemi yakında eklenecek!');
    navigation.navigate('Report', { user });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Premium Kişisel Harita Raporu</Text>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user?.character} "{user?.name}"</Text>
        <Text style={styles.userDetails}>
          {user?.birth_date} • {user?.birth_time} • {user?.birth_place}
        </Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>24.99 ₺</Text>
        <Text style={styles.priceSubtitle}>Tek seferlik ödeme</Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Rapor İçeriği:</Text>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>🌌 Asteroidler ve Sabit Yıldızlar</Text>
          <Text style={styles.featureDesc}>
            Chiron, Ceres, Pallas, Juno, Vesta asteroidlerinin haritanızdaki etkileri ve 
            önemli sabit yıldızların konumları.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>🕊️ Ruhsal Görev</Text>
          <Text style={styles.featureDesc}>
            Ay Düğümleri (Kuzey ve Güney), Vertex ve Kiron'un haritanızdaki konumları 
            ve ruhsal gelişim yolculuğunuz.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>⏰ Kadersel Dönemler</Text>
          <Text style={styles.featureDesc}>
            Satürn döngüsü, Jüpiter döngüsü ve diğer önemli transitlerin 
            hayatınızdaki etkileri ve zamanlamaları.
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>📅 Kişisel Astrolojik Zaman Çizgisi</Text>
          <Text style={styles.featureDesc}>
            Geçmiş, şimdi ve gelecekteki önemli astrolojik dönemleriniz, 
            kariyer, aşk ve kişisel gelişim fırsatları.
          </Text>
        </View>
      </View>

      <View style={styles.benefitsContainer}>
        <Text style={styles.sectionTitle}>Premium Avantajlar:</Text>
        <Text style={styles.benefit}>✓ Detaylı 50+ sayfa analiz</Text>
        <Text style={styles.benefit}>✓ PDF olarak indirilebilir</Text>
        <Text style={styles.benefit}>✓ Ömür boyu erişim</Text>
        <Text style={styles.benefit}>✓ Güncellemeler dahil</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
          <Text style={styles.purchaseButtonText}>Premium Raporu Satın Al</Text>
          <Text style={styles.purchasePrice}>24.99 ₺</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimer}>
        * Bu rapor profesyonel astrolojik analiz içerir. 
        Ödeme güvenliği için SSL şifreleme kullanılmaktadır.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#181A20', 
    padding: 24 
  },
  title: { 
    color: '#FFD700', 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 24 
  },
  userInfo: { 
    backgroundColor: '#23243A', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 24,
    alignItems: 'center'
  },
  userName: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  userDetails: { 
    color: '#b0b0ff', 
    fontSize: 14 
  },
  priceContainer: { 
    alignItems: 'center', 
    marginBottom: 32 
  },
  price: { 
    color: '#FFD700', 
    fontSize: 36, 
    fontWeight: 'bold' 
  },
  priceSubtitle: { 
    color: '#b0b0ff', 
    fontSize: 16 
  },
  featuresContainer: { 
    marginBottom: 32 
  },
  sectionTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16 
  },
  featureItem: { 
    backgroundColor: '#23243A', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16 
  },
  featureTitle: { 
    color: '#FFD700', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  featureDesc: { 
    color: '#b0b0ff', 
    fontSize: 14, 
    lineHeight: 20 
  },
  benefitsContainer: { 
    marginBottom: 32 
  },
  benefit: { 
    color: '#4CAF50', 
    fontSize: 16, 
    marginBottom: 8 
  },
  buttonContainer: { 
    marginBottom: 24 
  },
  purchaseButton: { 
    backgroundColor: '#FFD700', 
    borderRadius: 12, 
    padding: 20, 
    alignItems: 'center', 
    marginBottom: 16 
  },
  purchaseButtonText: { 
    color: '#000', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  purchasePrice: { 
    color: '#000', 
    fontSize: 16, 
    marginTop: 4 
  },
  backButton: { 
    backgroundColor: '#3A3B5A', 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center' 
  },
  backButtonText: { 
    color: '#fff', 
    fontSize: 18 
  },
  disclaimer: { 
    color: '#888', 
    fontSize: 12, 
    textAlign: 'center', 
    fontStyle: 'italic' 
  },
}); 