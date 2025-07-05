import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { sendEmail } from '../firebase/firestoreService';
import { PersonalizedFinalQuestionService, UserNatalChart, PersonalizedQuestion } from '../services/personalizedFinalQuestionService';

const { width, height } = Dimensions.get('window');

const zodiacSigns = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];

const planets = [
  'Güneş', 'Ay', 'Merkür', 'Venüs', 'Mars', 'Jüpiter', 'Satürn', 'Uranüs', 'Neptün', 'Plüton'
];

const houses = [
  '1. Ev', '2. Ev', '3. Ev', '4. Ev', '5. Ev', '6. Ev',
  '7. Ev', '8. Ev', '9. Ev', '10. Ev', '11. Ev', '12. Ev'
];

export default function FinalScreen({ navigation, route }: any) {
  const { user, aspectsCompleted } = route.params;
  const [currentView, setCurrentView] = useState<'intro' | 'check' | 'map' | 'quiz' | 'success'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(30);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [personalizedQuestions, setPersonalizedQuestions] = useState<PersonalizedQuestion[]>([]);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'wrong' | null>(null);
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  
  // Animasyon değerleri
  const darkOverlayAnim = useRef(new Animated.Value(0)).current;
  const mapAnim = useRef(new Animated.Value(1)).current;
  const lightAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startIntroAnimation();
  }, []);

  useEffect(() => {
    if (currentView === 'quiz' && time === 0) {
      handleWrong();
    }
    if (currentView === 'quiz') {
      const timer = setInterval(() => {
        setTime(t => (t > 0 ? t - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [time, currentView]);

  const startIntroAnimation = () => {
    // Harita zaten görünür, sadece ışık beliriyor
    Animated.timing(lightAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      // Harita dönme animasyonu
      Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
      ).start();
      
      setCurrentView('check');
    });
  };

  const checkBirthData = () => {
    if (!user?.birthDate || !user?.birthTime || !user?.birthPlace) {
      Alert.alert(
        'Doğum Verisi Gerekli',
        'Final sınavı için doğum tarihi, saati ve yeri gereklidir. Doğum verilerinizi girmeniz gerekiyor.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('BirthInput', { user, fromFinal: true })
          }
        ]
      );
    } else {
      generatePersonalizedQuestions();
      setCurrentView('map');
    }
  };

  const generatePersonalizedQuestions = () => {
    // Kullanıcının gerçek doğum haritası verilerine göre kişiselleştirilmiş sorular oluştur
    if (!user?.birthChart) {
      // Eğer doğum haritası yoksa, varsayılan sorular
      const defaultNatalChart: UserNatalChart = {
        sunSign: user?.sun_sign || 'Balık',
        moonSign: 'Yengeç',
        venusSign: 'Terazi',
        marsSign: 'Koç',
        jupiterSign: 'Yay',
        saturnSign: 'Oğlak',
        ascendantSign: 'Aslan',
        sunHouse: 1,
        moonHouse: 4,
        venusHouse: 7,
        marsHouse: 1,
        jupiterHouse: 9,
        saturnHouse: 10
      };
      const questions = PersonalizedFinalQuestionService.generatePersonalizedQuestions(defaultNatalChart);
      setPersonalizedQuestions(questions);
      return;
    }

    const birthChart = user.birthChart;
    console.log('Birth Chart Data:', birthChart);
    
    const natalChart: UserNatalChart = {
      sunSign: birthChart.sun_sign,
      moonSign: birthChart.moon_sign,
      venusSign: birthChart.planets.venus.sign,
      marsSign: birthChart.planets.mars.sign,
      jupiterSign: birthChart.planets.jupiter.sign,
      saturnSign: birthChart.planets.saturn.sign,
      ascendantSign: birthChart.rising_sign,
      sunHouse: birthChart.planets.sun.house,
      moonHouse: birthChart.planets.moon.house,
      venusHouse: birthChart.planets.venus.house,
      marsHouse: birthChart.planets.mars.house,
      jupiterHouse: birthChart.planets.jupiter.house,
      saturnHouse: birthChart.planets.saturn.house
    };
    
    console.log('Natal Chart Data:', natalChart);
    
    const questions = PersonalizedFinalQuestionService.generatePersonalizedQuestions(natalChart);
    setPersonalizedQuestions(questions);
  };

  const handleLightPress = () => {
    setCurrentView('quiz');
    setCurrentQuestion(0);
    setTime(30);
    setLives(3);
    setCompletedQuestions(0);
  };

  const handleOption = (idx: number) => {
    const currentQ = personalizedQuestions[currentQuestion];
    if (currentQ.secenekler[idx] === currentQ.dogru_cevap) {
      setAnswerFeedback('correct');
      setCompletedQuestions(c => c + 1);
      
      // Yeşil ışık animasyonu
      Animated.sequence([
        Animated.timing(feedbackAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(feedbackAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        })
      ]).start();
      
      setTimeout(() => {
        setAnswerFeedback(null);
        nextQuestion();
      }, 1000);
    } else {
      setAnswerFeedback('wrong');
      
      // Kırmızı ışık animasyonu
      Animated.sequence([
        Animated.timing(feedbackAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(feedbackAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        })
      ]).start();
      
      setTimeout(() => {
        setAnswerFeedback(null);
        handleWrong();
      }, 1000);
    }
  };

  const handleWrong = () => {
    setLives(l => l - 1);
    if (lives - 1 <= 0) {
      Alert.alert(
        'Oyun Bitti',
        'Final sınavını geçemedin. Tekrar denemek için baştan başla.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Corridor', { user })
          }
        ]
      );
    } else {
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < personalizedQuestions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setTime(30);
    } else {
      // Tüm sorular tamamlandı
      setCurrentView('success');
    }
  };

  const handleReportRequest = async () => {
    try {
      await sendEmail({
        to: 'silaildeniz10@gmail.com',
        subject: 'Astro Kaçış - Doğum Haritası Raporu Talebi',
        body: `
Kullanıcı Bilgileri:
Ad: ${user?.name}
Doğum Tarihi: ${user?.birthDate}
Doğum Saati: ${user?.birthTime}
Doğum Yeri: ${user?.birthPlace}
Burç: ${user?.character}

Kullanıcı final sınavını başarıyla tamamladı ve kişisel doğum haritası raporu talep ediyor.
        `
      });
      
      Alert.alert(
        'Rapor Talebi Gönderildi',
        'Doğum haritası raporunuz silaildeniz10@gmail.com adresine gönderildi. En kısa sürede size özel yorumlanmış raporunuzu alacaksınız.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Corridor', { user, finalCompleted: true })
          }
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Rapor talebi gönderilemedi. Lütfen tekrar deneyin.');
    }
  };

  const getRotation = () => {
    return rotationAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  };

  if (currentView === 'intro') {
    console.log('Rendering intro view');
    return (
      <View style={styles.container}>
        <LottieView 
          source={require('../../assets/lottie/nebula.json')} 
          autoPlay 
          loop 
          style={styles.bgAnim}
          resizeMode="cover"
        />
        
        {/* Harita sembolleri */}
        <Animated.View
          style={[
            styles.mapContainer,
            {
              opacity: mapAnim,
              transform: [{ rotate: getRotation() }],
            },
          ]}
        >
          {[...Array(12)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.mapSymbol,
                {
                  transform: [{ rotate: `${i * 30}deg` }],
                },
              ]}
            >
              <Text style={styles.symbolText}>★</Text>
            </View>
          ))}
        </Animated.View>

        {/* Merkez ışık */}
        <Animated.View
          style={[
            styles.centerLight,
            {
              opacity: lightAnim,
            },
          ]}
        />
      </View>
    );
  }

  if (currentView === 'check') {
    return (
      <View style={styles.container}>
        <LottieView 
          source={require('../../assets/lottie/nebula.json')} 
          autoPlay 
          loop 
          style={styles.bgAnim}
          resizeMode="cover"
        />
        
        <View style={styles.checkContainer}>
          <Text style={styles.checkTitle}>FİNAL</Text>
          <Text style={styles.checkMessage}>
            GÖKYÜZÜNÜN SANA YAZDIĞI HARİTAYLA KARŞILAŞMAYA HAZIR MISIN
          </Text>
          <Text style={styles.checkSubMessage}>
            KENDİ HARİTANI OKUYAMIYORSAN HİÇBİR KAPI SANA AÇILMAZ
          </Text>
          
          <TouchableOpacity style={styles.checkButton} onPress={checkBirthData}>
            <Text style={styles.checkButtonText}>DEVAM ET</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (currentView === 'map') {
    return (
      <View style={styles.container}>
        <LottieView 
          source={require('../../assets/lottie/nebula.json')} 
          autoPlay 
          loop 
          style={styles.bgAnim}
          resizeMode="cover"
        />
        
        {/* Harita sembolleri */}
        <View style={styles.mapContainer}>
          {[...Array(12)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.mapSymbol,
                {
                  transform: [{ rotate: `${i * 30}deg` }],
                },
              ]}
            >
              <Text style={styles.symbolText}>★</Text>
            </View>
          ))}
        </View>

        {/* Mesaj */}
        <View style={styles.mapMessageContainer}>
          <Text style={styles.mapMessage}>
            KENDİNİ TANIMADAN ZODYAK'TAN KURTULAMAZSIN
          </Text>
          <Text style={styles.mapSubMessage}>
            Son sınav başlıyor. Kendi doğum haritan hakkında 10 soru cevaplayacaksın. 3 canın var, ipucu yok!
          </Text>
        </View>

        {/* Merkez ışık */}
        <TouchableOpacity style={styles.centerLightButton} onPress={handleLightPress}>
          <View style={styles.centerLight} />
          <Text style={styles.lightText}>BAŞLA</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentView === 'quiz') {
    const currentQ = personalizedQuestions[currentQuestion];
    
    return (
      <View style={styles.container}>
        <LottieView 
          source={require('../../assets/lottie/nebula.json')} 
          autoPlay 
          loop 
          style={styles.bgAnim}
          resizeMode="cover"
        />
        
        {/* Cevap geri bildirimi ışığı */}
        {answerFeedback && (
          <Animated.View style={[
            styles.feedbackLight,
            {
              backgroundColor: answerFeedback === 'correct' ? '#00FF00' : '#FF0000',
              opacity: feedbackAnim,
            }
          ]} />
        )}
        
        <Text style={styles.status}>Can: {lives}   Süre: {time}s   Soru: {currentQuestion + 1}/10</Text>
        <Text style={styles.title}>KİŞİSEL HARİTA SINAVI</Text>
        <Text style={styles.question}>{currentQ.soru}</Text>
        {currentQ.secenekler.map((opt: string, idx: number) => (
          <TouchableOpacity key={idx} style={styles.option} onPress={() => handleOption(idx)}>
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  if (currentView === 'success') {
    return (
      <View style={styles.container}>
        <LottieView 
          source={require('../../assets/lottie/nebula.json')} 
          autoPlay 
          loop 
          style={styles.bgAnim}
          resizeMode="cover"
        />
        
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>GÖKYÜZÜ SUSTU AMA SEN ARTIK ONU KONUŞTURABİLİYORSUN</Text>
          <Text style={styles.successMessage}>
            Final sınavını başarıyla tamamladın! Artık gökyüzünün dilini biliyorsun.
          </Text>
          
          <TouchableOpacity 
            style={styles.reportButton} 
            onPress={() => setShowReportDialog(true)}
          >
            <Text style={styles.reportButtonText}>HARİTAMIN RAPORUNU İSTİYORUM</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={() => navigation.navigate('Corridor', { user, finalCompleted: true })}
          >
            <Text style={styles.skipButtonText}>ŞİMDİLİK GEÇ</Text>
          </TouchableOpacity>
        </View>

        {showReportDialog && (
          <View style={styles.dialogOverlay}>
            <View style={styles.dialogContainer}>
              <Text style={styles.dialogTitle}>Kişisel Rapor</Text>
              <Text style={styles.dialogMessage}>
                Doğum haritası raporunuz silaildeniz10@gmail.com adresine gönderilecek ve özel olarak yorumlanacaktır.
              </Text>
              <View style={styles.dialogButtons}>
                <TouchableOpacity style={styles.dialogButton} onPress={handleReportRequest}>
                  <Text style={styles.dialogButtonText}>GÖNDER</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.dialogButton, styles.cancelButton]} 
                  onPress={() => setShowReportDialog(false)}
                >
                  <Text style={styles.dialogButtonText}>İPTAL</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }

  // Default fallback - should not reach here
  return (
    <View style={styles.container}>
      <LottieView 
        source={require('../../assets/lottie/nebula.json')} 
        autoPlay 
        loop 
        style={styles.bgAnim}
        resizeMode="cover"
      />
      <Text style={styles.title}>Yükleniyor...</Text>
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
    bottom: 0
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 10,
  },
  mapContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 300,
    height: 300,
    marginLeft: -150,
    marginTop: -150,
    zIndex: 5,
  },
  mapSymbol: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    color: '#FFD700',
    fontSize: 20,
  },
  centerLight: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    marginLeft: -50,
    marginTop: -50,
    backgroundColor: '#FFD700',
    borderRadius: 50,
    zIndex: 10,
  },
  centerLightButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 150,
    height: 150,
    marginLeft: -75,
    marginTop: -75,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  lightText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 70,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  mapMessageContainer: {
    position: 'absolute',
    top: '20%',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 20,
  },
  mapMessage: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  mapSubMessage: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  feedbackLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  checkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  checkTitle: {
    color: '#FFD700',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  checkMessage: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  checkSubMessage: {
    color: '#b0b0ff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 48,
    fontStyle: 'italic',
  },
  checkButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  checkButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  status: { 
    color: '#fff', 
    fontSize: 18, 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  title: { 
    color: '#FFD700', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    textAlign: 'center' 
  },
  question: { 
    color: '#fff', 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    textAlign: 'center' 
  },
  option: { 
    backgroundColor: '#23243A', 
    borderRadius: 8, 
    padding: 16, 
    marginBottom: 12 
  },
  optionText: { 
    color: '#fff', 
    fontSize: 18 
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successTitle: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 40,
  },
  successMessage: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  reportButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginBottom: 16,
  },
  reportButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  skipButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  dialogContainer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  dialogTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dialogMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  dialogButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  dialogButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 