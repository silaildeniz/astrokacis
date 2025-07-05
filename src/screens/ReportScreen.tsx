import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ReportScreen({ navigation, route }: any) {
  const { user } = route.params;

  const handleExportPDF = () => {
    // İleride: PDF export fonksiyonu eklenecek
    alert('PDF dışa aktarma özelliği yakında eklenecek!');
  };

  const renderBirthChartData = () => {
    if (!user?.birthChart) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Doğum Haritası Verisi Yok</Text>
          <Text style={styles.content}>
            Doğum haritası verileriniz henüz hesaplanmamış. Final sınavını tamamladıktan sonra 
            detaylı raporunuzu görebilirsiniz.
          </Text>
        </View>
      );
    }

    const birthChart = user.birthChart;
    
    return (
      <>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Ana Burçlar</Text>
          <View style={styles.chartData}>
            <Text style={styles.chartLabel}>Güneş Burcu: <Text style={styles.chartValue}>{birthChart.sun_sign}</Text></Text>
            <Text style={styles.chartLabel}>Ay Burcu: <Text style={styles.chartValue}>{birthChart.moon_sign}</Text></Text>
            <Text style={styles.chartLabel}>Yükselen Burç: <Text style={styles.chartValue}>{birthChart.rising_sign}</Text></Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🪐 Gezegen Pozisyonları</Text>
          <View style={styles.chartData}>
            <Text style={styles.chartLabel}>Güneş: <Text style={styles.chartValue}>{birthChart.planets.sun.sign} - {birthChart.planets.sun.house}. Ev</Text></Text>
            <Text style={styles.chartLabel}>Ay: <Text style={styles.chartValue}>{birthChart.planets.moon.sign} - {birthChart.planets.moon.house}. Ev</Text></Text>
            <Text style={styles.chartLabel}>Merkür: <Text style={styles.chartValue}>{birthChart.planets.mercury.sign} - {birthChart.planets.mercury.house}. Ev</Text></Text>
            <Text style={styles.chartLabel}>Venüs: <Text style={styles.chartValue}>{birthChart.planets.venus.sign} - {birthChart.planets.venus.house}. Ev</Text></Text>
            <Text style={styles.chartLabel}>Mars: <Text style={styles.chartValue}>{birthChart.planets.mars.sign} - {birthChart.planets.mars.house}. Ev</Text></Text>
            <Text style={styles.chartLabel}>Jüpiter: <Text style={styles.chartValue}>{birthChart.planets.jupiter.sign} - {birthChart.planets.jupiter.house}. Ev</Text></Text>
            <Text style={styles.chartLabel}>Satürn: <Text style={styles.chartValue}>{birthChart.planets.saturn.sign} - {birthChart.planets.saturn.house}. Ev</Text></Text>
            <Text style={styles.chartLabel}>Uranüs: <Text style={styles.chartValue}>{birthChart.planets.uranus.sign} - {birthChart.planets.uranus.house}. Ev</Text></Text>
            <Text style={styles.chartLabel}>Neptün: <Text style={styles.chartValue}>{birthChart.planets.neptune.sign} - {birthChart.planets.neptune.house}. Ev</Text></Text>
            <Text style={styles.chartLabel}>Plüton: <Text style={styles.chartValue}>{birthChart.planets.pluto.sign} - {birthChart.planets.pluto.house}. Ev</Text></Text>
          </View>
        </View>

        {birthChart.aspects && birthChart.aspects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔗 Önemli Açılar</Text>
            <View style={styles.chartData}>
              {birthChart.aspects.slice(0, 5).map((aspect: any, index: number) => (
                <Text key={index} style={styles.chartLabel}>
                  {aspect.planet1} - {aspect.planet2}: <Text style={styles.chartValue}>{aspect.aspect} ({aspect.degree}°)</Text>
                </Text>
              ))}
            </View>
          </View>
        )}
      </>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kişisel Astroloji Raporu</Text>
        <Text style={styles.subtitle}>{user?.character} "{user?.name}"</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('tr-TR')}</Text>
      </View>

      {renderBirthChartData()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌌 Asteroidler ve Sabit Yıldızlar</Text>
        <Text style={styles.content}>
          Haritanızda Chiron'un konumu, iyileştirme ve şifa alanlarınızı gösterir. 
          Ceres, Pallas, Juno ve Vesta asteroidleri de kişiliğinizin farklı yönlerini 
          aydınlatır. Önemli sabit yıldızların etkileri de analiz edilmiştir.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🕊️ Ruhsal Görev ve Ay Düğümleri</Text>
        <Text style={styles.content}>
          Kuzey Ay Düğümünüz ruhsal gelişim yolunuzu, Güney Ay Düğümünüz ise 
          geçmiş yaşam deneyimlerinizi temsil eder. Vertex noktanız kadersel 
          karşılaşmalarınızı, Kiron ise iyileştirme alanlarınızı gösterir.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏰ Kadersel Dönemler</Text>
        <Text style={styles.content}>
          Satürn döngünüz (yaklaşık 29 yıl) hayatınızdaki önemli dönüm noktalarını 
          işaret eder. Jüpiter döngüsü (12 yıl) büyüme ve genişleme dönemlerinizi 
          gösterir. Bu transitlerin zamanlamaları ve etkileri detaylı olarak 
          analiz edilmiştir.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Kişisel Astrolojik Zaman Çizgisi</Text>
        <Text style={styles.content}>
          Geçmiş dönemlerinizdeki önemli astrolojik etkiler, şu anki durumunuz 
          ve gelecekteki potansiyel fırsatlar. Kariyer, aşk, kişisel gelişim 
          ve ruhsal yolculuğunuzun astrolojik haritası.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Öneriler ve Yönlendirmeler</Text>
        <Text style={styles.content}>
          Haritanıza dayalı kişisel gelişim önerileri, kariyer yönlendirmeleri 
          ve ruhsal pratikler. Güçlü yanlarınızı nasıl kullanacağınız ve 
          zorluklarınızı nasıl aşacağınız konusunda rehberlik.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.exportButton} onPress={handleExportPDF}>
          <Text style={styles.exportButtonText}>PDF Olarak İndir</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.backButtonText}>Ana Menüye Dön</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Bu rapor {user?.name} için özel olarak hazırlanmıştır.
        </Text>
        <Text style={styles.footerText}>
          © 2024 Astro Kaçış - Tüm hakları saklıdır.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#181A20', 
    padding: 24 
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3B5A'
  },
  title: { 
    color: '#FFD700', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  subtitle: { 
    color: '#fff', 
    fontSize: 20, 
    marginBottom: 8 
  },
  date: { 
    color: '#b0b0ff', 
    fontSize: 14 
  },
  section: { 
    marginBottom: 24 
  },
  sectionTitle: { 
    color: '#FFD700', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 12 
  },
  content: { 
    color: '#b0b0ff', 
    fontSize: 16, 
    lineHeight: 24,
    textAlign: 'justify'
  },
  chartData: {
    backgroundColor: '#23243A',
    borderRadius: 8,
    padding: 16,
    marginTop: 8
  },
  chartLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22
  },
  chartValue: {
    color: '#FFD700',
    fontWeight: 'bold'
  },
  actions: { 
    marginTop: 32, 
    marginBottom: 24 
  },
  exportButton: { 
    backgroundColor: '#4CAF50', 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center', 
    marginBottom: 16 
  },
  exportButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
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
  footer: { 
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#3A3B5A',
    alignItems: 'center'
  },
  footerText: { 
    color: '#888', 
    fontSize: 12, 
    textAlign: 'center',
    marginBottom: 4
  },
}); 