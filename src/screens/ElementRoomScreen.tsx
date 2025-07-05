import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { saveGameProgress, getGameProgress } from '../firebase/firestoreService';
import { checkAndUpdateBadges, calculateStars } from '../services/badgeService';

const { width, height } = Dimensions.get('window');

const elements = [
  { 
    name: 'Ateş', 
    color: '#FF4444', 
    lightColor: '#FF6B6B',
    image: require('../../assets/icons/elements/fire.png')
  },
  { 
    name: 'Su', 
    color: '#4444FF', 
    lightColor: '#4ECDC4',
    image: require('../../assets/icons/elements/water.png')
  },
  { 
    name: 'Toprak', 
    color: '#44FF44', 
    lightColor: '#95E1D3',
    image: require('../../assets/icons/elements/earth.png')
  },
  { 
    name: 'Hava', 
    color: '#FFFFFF', 
    lightColor: '#F8F9FA',
    image: require('../../assets/icons/elements/air.png')
  }
];

const elementQuestions = {
  'Ateş': [
    {
      difficulty: 'Kolay',
      question: 'Ateş elementi hangi özelliklerle en çok bağdaştırılır?',
      options: ['Mantıklılık ve analiz', 'Hırs, cesaret ve motivasyon', 'Sabır ve pratiklik', 'Duygusallık ve sezgi'],
      answer: 1,
      hint: 'Ateş seni harekete geçiren tutkudur.'
    },
    {
      difficulty: 'Zor',
      question: 'Haritasında güçlü bir ateş elementi olan biri en çok hangi durumda zorlanabilir?',
      options: ['Karar verirken fazla duygusal olur', 'Sabırsızlık ve acelecilik nedeniyle kriz yaşar', 'Maddi planlama yapmakta usta olur', 'Sezgileri zayıf olur'],
      answer: 1,
      hint: 'Ateş hızlıdır ama sabır sınavını zor geçer.'
    }
  ],
  'Su': [
    {
      difficulty: 'Kolay',
      question: 'Su elementinin en belirgin yönü nedir?',
      options: ['Mantıklı düşünme', 'Strateji kurma', 'Duygusallık ve sezgisellik', 'Fiziksel güç'],
      answer: 2,
      hint: 'Su her şeyi hisseder, akar ama saklar.'
    },
    {
      difficulty: 'Zor',
      question: 'Su elementi fazlalığı kişide ne gibi dengesizliklere yol açabilir?',
      options: ['Aşırı rekabetçilik', 'Aşırı rasyonellik', 'Duygusal dengesizlik ve hayal kırıklığına açıklık', 'Kararsızlık ve kıskançlık'],
      answer: 2,
      hint: 'Su taşarsa zarar verebilir.'
    }
  ],
  'Hava': [
    {
      difficulty: 'Kolay',
      question: 'Hava elementi en çok neyle ilgilidir?',
      options: ['Güç ve dayanıklılık', 'Zihinsel aktivite ve iletişim', 'Sezgi ve empati', 'Disiplin ve sorumluluk'],
      answer: 1,
      hint: 'Hava konuşur, düşünür, tartışır.'
    },
    {
      difficulty: 'Zor',
      question: 'Hava elementi eksik olan biri hangi alanda zorlanabilir?',
      options: ['Fiziksel dayanıklılık', 'Duygularını fark etmede', 'Sosyal iletişim ve objektif bakış', 'Yaratıcılık'],
      answer: 2,
      hint: 'Hava yoksa bağlantı da kopuktur.'
    }
  ],
  'Toprak': [
    {
      difficulty: 'Kolay',
      question: 'Toprak elementinin kişiye kattığı özellik nedir?',
      options: ['Yaratıcılık', 'Pratiklik ve güvenilirlik', 'Duygusallık', 'Hareketlilik'],
      answer: 1,
      hint: 'Ayakları yere basanların elementi.'
    },
    {
      difficulty: 'Zor',
      question: 'Haritasında fazla toprak elementi olan biri hangi konuda aşırıya kaçabilir?',
      options: ['Hayal kurma', 'Gerçekçilik ve maddiyat saplantısı', 'Duygusal bağ kurma', 'Konuşkanlık'],
      answer: 1,
      hint: 'Gerçeklik iyidir, ama fazla olursa hayalleri ezer.'
    }
  ]
};

export default function ElementRoomScreen({ navigation, route }: any) {
  const { user } = route.params || {};
  const [currentView, setCurrentView] = useState<'intro' | 'elements' | 'quiz'>('intro');
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [elementScore, setElementScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(20);
  const [showHint, setShowHint] = useState(false);
  const [completedElements, setCompletedElements] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [canAnswer, setCanAnswer] = useState(true);
  const [showCanAlert, setShowCanAlert] = useState(false);
  
  // Yıldızlı sistem için yeni state'ler
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [elementStars, setElementStars] = useState<{[key: string]: number}>({});
  const [newBadges, setNewBadges] = useState<any[]>([]);
  
  // Animasyon değerleri
  const elementRotateAnim = useRef(new Animated.Value(0)).current;
  const elementGlowAnim = useRef(new Animated.Value(0)).current;
  const messageAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (user) {
      loadGameProgress();
    }
    startIntroAnimation();
  }, [user]);

  const loadGameProgress = async () => {
    try {
      if (route.params?.user?.id) {
        const progress = await getGameProgress(route.params.user.id);
        if (progress.completedElements) {
          setCompletedElements(progress.completedElements);
        }
        if (progress.totalScore) {
          setScore(progress.totalScore);
        }
        // Element yıldızlarını yükle
        if (progress.elementScores) {
          const stars: {[key: string]: number} = {};
          Object.entries(progress.elementScores).forEach(([element, data]: [string, any]) => {
            if (data.stars) {
              stars[element] = data.stars;
            }
          });
          setElementStars(stars);
        }
      }
    } catch (error) {
      console.error('İlerleme yüklenemedi:', error);
    }
  };

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
    // Kısa bir intro animasyonu
    setTimeout(() => {
      setCurrentView('elements');
      // Element animasyonlarını başlat
      startElementAnimations();
    }, 1000);
  };

  const startElementAnimations = () => {
    // Elementleri dönerek ve büyüyerek göster
    Animated.parallel([
      Animated.timing(elementRotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.timing(elementGlowAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Sürekli yanıp sönme animasyonu
      startPulseAnimation();
    });
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(elementGlowAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(elementGlowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const handleElementPress = (element: string) => {
    setSelectedElement(element);
    setCurrentView('quiz');
    setCurrentQuestion(0);
    setElementScore(0);
    setWrongAnswers(0);
    setTime(20);
    setShowHint(false);
    setSelectedAnswer(null);
    setShowAnswerFeedback(false);
    setCanAnswer(true);
  };

  const handleOption = async (idx: number) => {
    if (!canAnswer) return;
    
    setSelectedAnswer(idx);
    setCanAnswer(false);
    setShowAnswerFeedback(true);
    
    if (idx === elementQuestions[selectedElement as keyof typeof elementQuestions][currentQuestion].answer) {
      setScore(s => s + 100);
      setElementScore(es => es + 100);
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      setTimeout(() => {
        handleWrong();
      }, 1500);
    }
  };

  const handleWrong = () => {
    setLives(l => l - 1);
    setWrongAnswers(w => w + 1);
    
    if (lives - 1 <= 0 && !showCanAlert) {
      setShowCanAlert(true);
      Alert.alert(
        'Canların Bitti!',
        'Ne yapmak istiyorsun?',
        [
          {
            text: 'Puanla Can Al (300)',
            onPress: () => {
              if (score >= 300) {
                setScore(s => s - 300);
                setLives(1);
                setShowCanAlert(false);
                setTime(20);
                setShowHint(false);
                setSelectedAnswer(null);
                setShowAnswerFeedback(false);
                setCanAnswer(true);
              } else {
                Alert.alert('Yetersiz Puan', 'Can almak için 300 puan gerekli!');
                navigation.navigate('Corridor', { user: route.params?.user });
              }
            }
          },
          {
            text: 'Reklam İzle (Ücretsiz)',
            onPress: () => {
              Alert.alert(
                'Reklam İzleniyor...',
                'Reklam tamamlandı! +1 can kazandın.',
                [
                  {
                    text: 'Devam Et',
                    onPress: () => {
                      setLives(1);
                      setShowCanAlert(false);
                      setTime(20);
                      setShowHint(false);
                      setSelectedAnswer(null);
                      setShowAnswerFeedback(false);
                      setCanAnswer(true);
                    }
                  }
                ]
              );
            }
          },
          {
            text: 'Koridora Dön',
            onPress: () => navigation.navigate('Corridor', { user: route.params?.user }),
            style: 'cancel'
          }
        ]
      );
    } else if (lives - 1 > 0) {
      nextQuestion();
    }
  };

  const nextQuestion = async () => {
    if (currentQuestion < elementQuestions[selectedElement as keyof typeof elementQuestions].length - 1) {
      setCurrentQuestion(c => c + 1);
      setTime(20);
      setShowHint(false);
      setSelectedAnswer(null);
      setShowAnswerFeedback(false);
      setCanAnswer(true);
    } else {
      // Element tamamlandı - yıldız hesapla
      const stars = calculateStars({
        totalQuestions: elementQuestions[selectedElement as keyof typeof elementQuestions].length,
        correctAnswers: elementQuestions[selectedElement as keyof typeof elementQuestions].length - wrongAnswers,
        wrongAnswers: wrongAnswers
      });
      
      // Element yıldızlarını güncelle
      const updatedElementStars = {
        ...elementStars,
        [selectedElement]: stars
      };
      setElementStars(updatedElementStars);
      
      // Element tamamlandı
      const newCompletedElements = [...completedElements, selectedElement];
      setCompletedElements(newCompletedElements);
      
      // İlerlemeyi kaydet (sadece daha önce tamamlanmamışsa)
      if (route.params?.user?.id && !completedElements.includes(selectedElement)) {
        try {
          const gameData = {
            completedElements: newCompletedElements,
            totalScore: score + elementScore,
            elementScores: {
              ...updatedElementStars,
              [selectedElement]: {
                totalQuestions: elementQuestions[selectedElement as keyof typeof elementQuestions].length,
                correctAnswers: elementQuestions[selectedElement as keyof typeof elementQuestions].length - wrongAnswers,
                wrongAnswers: wrongAnswers,
                stars: stars
              }
            }
          };
          
          await saveGameProgress(route.params.user.id, gameData);
          
          // Rozet kontrolü
          const badges = await checkAndUpdateBadges(route.params.user.id, gameData);
          if (badges.length > 0) {
            setNewBadges(badges);
            // Yeni rozet bildirimi
            Alert.alert(
              '🎉 Yeni Rozet Kazandın! 🎉',
              `${badges.map(b => b.name).join(', ')} rozetlerini kazandın!`,
              [{ text: 'Harika!', onPress: () => setNewBadges([]) }]
            );
          }
        } catch (error) {
          console.error('İlerleme kaydedilemedi:', error);
        }
      }
      
      // Yıldız gösterimi ile element tamamlandı mesajı
      const starEmojis = '⭐'.repeat(stars);
      const starText = stars === 3 ? 'Mükemmel!' : stars === 2 ? 'İyi!' : 'Geçer!';
      
      Alert.alert(
        `🎉 ELEMENT BAŞARISI! 🎉`, 
        `${selectedElement} elementini tamamladın!\n\n${starEmojis} ${starText}\n\nElementin sırlarını çözdün ve yeni kapılar açtın.`
      );
      
      setCurrentView('elements');
      setSelectedElement('');
      
      // Tüm elementler tamamlandıysa sıralı mesajlar göster
      if (newCompletedElements.length === Object.keys(elementQuestions).length) {
        setTimeout(() => {
          Alert.alert(
            '🎉 ELEMENT USTASI! 🎉', 
            'Tüm elementlerin sırlarını çözdün!\n\nElementler artık seninle konuşuyor...',
            [
              {
                text: 'Devam Et',
                onPress: () => {
                  setTimeout(() => {
                    Alert.alert(
                      'Koridora Dönüyorsun',
                      'Elementler evreninden çıkıyorsun...\n\nBir sonraki kapıyı bekliyor.',
                      [
                        {
                          text: 'Tamam',
                          onPress: () => navigation.navigate('Corridor', { user: route.params?.user, elementsCompleted: true })
                        }
                      ]
                    );
                  }, 500);
                }
              }
            ]
          );
        }, 1000);
      }
    }
  };

  const buyHint = () => {
    if (score >= 150) {
      setScore(s => s - 150);
      setShowHint(true);
    } else {
      Alert.alert('Yetersiz Puan', 'İpucu almak için 150 puan gerekli!');
    }
  };

  const buyTime = () => {
    if (score >= 100) {
      setScore(s => s - 100);
      setTime(t => t + 15);
    } else {
      Alert.alert('Yetersiz Puan', 'Süre almak için 100 puan gerekli!');
    }
  };

  const buyLife = () => {
    if (score >= 300) {
      setScore(s => s - 300);
      setLives(l => l + 1);
    } else {
      Alert.alert('Yetersiz Puan', 'Can almak için 300 puan gerekli!');
    }
  };

  const getOptionStyle = (idx: number) => {
    if (!showAnswerFeedback) return styles.option;
    
    if (idx === elementQuestions[selectedElement as keyof typeof elementQuestions][currentQuestion].answer) {
      return [styles.option, styles.correctAnswer];
    } else if (idx === selectedAnswer) {
      return [styles.option, styles.wrongAnswer];
    }
    return styles.option;
  };

  const getElementPosition = (index: number) => {
    // Elementleri telefon ekranına uygun şekilde dağıt
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 120; // Daha küçük radius
    
    const positions = [
      { left: centerX - 130, top: centerY - 120 }, // Ateş - üst sol
      { left: centerX + 20, top: centerY - 120 }, // Su - üst sağ  
      { left: centerX - 130, top: centerY + 60 }, // Toprak - alt sol
      { left: centerX + 20, top: centerY + 60 }, // Hava - alt sağ
    ];
    return positions[index];
  };

  const getPulseOpacity = () => {
    return elementGlowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });
  };

  if (currentView === 'intro') {
    return (
      <View style={styles.container}>
        <LottieView source={require('../../assets/lottie/nebula.json')} autoPlay loop style={styles.bgAnim} />
        <Text style={styles.title}>Elementler Odası</Text>
        <Text style={styles.subtitle}>Doğanın 4 temel kuvveti</Text>
      </View>
    );
  }

  if (currentView === 'quiz') {
    const currentQ = elementQuestions[selectedElement as keyof typeof elementQuestions][currentQuestion];
    
    return (
      <View style={styles.container}>
        <LottieView source={require('../../assets/lottie/nebula.json')} autoPlay loop style={styles.bgAnim} resizeMode="cover" />
        <Text style={styles.status}>Toplam Puan: {score}   Can: {lives}   Süre: {time}s</Text>
        <Text style={styles.elementScore}>Bu Element Puanı: {elementScore}</Text>
        <Text style={styles.title}>{selectedElement} Elementi</Text>
        <Text style={styles.difficultyLabel}>{currentQ.difficulty}</Text>
        <Text style={styles.question}>{currentQ.question}</Text>
        {currentQ.options.map((opt: string, idx: number) => (
          <TouchableOpacity 
            key={idx} 
            style={getOptionStyle(idx)} 
            onPress={() => handleOption(idx)}
            disabled={!canAnswer}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={buyHint} disabled={score < 150}>
            <Text style={styles.actionText}>İpucu (-150)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={buyTime} disabled={score < 100}>
            <Text style={styles.actionText}>+15sn (-100)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={buyLife} disabled={score < 300}>
            <Text style={styles.actionText}>+1 Can (-300)</Text>
          </TouchableOpacity>
        </View>
        {showHint && <Text style={styles.hint}>İpucu: {currentQ.hint}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LottieView source={require('../../assets/lottie/nebula.json')} autoPlay loop style={styles.bgAnim} resizeMode="cover" />
      
      {/* Başlık - yukarıda */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>ELEMENTLER ODASI</Text>
        <Text style={styles.subtitle}>Doğanın 4 temel kuvveti</Text>
      </View>
      
      {/* Element ışıkları */}
      {elements.map((element, index) => {
        const position = getElementPosition(index);
        const isCompleted = completedElements.includes(element.name);
        // Her element için scale ve rotate animasyonu
        const scale = elementRotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.2, 1],
        });
        const rotate = elementRotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['-180deg', '0deg'],
        });
        return (
          <Animated.View
            key={element.name}
            style={[
              styles.elementContainer,
              {
                left: position.left,
                top: position.top,
                transform: [
                  { scale },
                  { rotate },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.elementButton,
                { borderColor: element.color },
                isCompleted && styles.completedElement,
              ]}
              onPress={() => handleElementPress(element.name)}
            >
              <Animated.View
                style={[
                  styles.elementGlow,
                  {
                    backgroundColor: element.lightColor,
                    opacity: getPulseOpacity(),
                  },
                ]}
              />
              <Image source={element.image} style={styles.elementImage} />
              {isCompleted && (
                <View style={styles.completedOverlay}>
                  <Text style={styles.completedText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <Text style={[styles.elementText, { color: element.color }]}>
              {element.name}
            </Text>
          </Animated.View>
        );
      })}

      {/* İlerleme çubuğu */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(completedElements.length / 4) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {completedElements.length}/4 Element Tamamlandı
        </Text>
      </View>

      {/* Kozmik istatistikler */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>KOZMİK PUAN</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>AÇILAN KAPILAR</Text>
          <Text style={styles.statValue}>{completedElements.length}</Text>
        </View>
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
    bottom: 0
  },
  zodiacCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -100 }, { translateY: -100 }],
  },
  zodiacText: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  elementLight: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  elementPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  elementContainer: {
    position: 'absolute',
    width: 120,
    height: 140,
    alignItems: 'center',
  },
  elementButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  elementGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
  elementImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 50,
  },
  elementText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  completedElement: {
    borderWidth: 5,
    borderColor: '#4CAF50',
  },
  completedText: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    zIndex: 1,
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  status: { 
    color: '#fff', 
    fontSize: 18, 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  title: { 
    color: '#fff', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    textAlign: 'center' 
  },
  difficulty: { 
    color: '#FFD700', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 16, 
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
  correctAnswer: {
    backgroundColor: '#4CAF50',
  },
  wrongAnswer: {
    backgroundColor: '#F44336',
  },
  elementScore: { 
    color: '#FFD700', 
    fontSize: 16, 
    marginBottom: 16, 
    textAlign: 'center',
    fontWeight: 'bold'
  },
  optionText: { 
    color: '#fff', 
    fontSize: 18 
  },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 24 
  },
  actionBtn: { 
    backgroundColor: '#3A3B5A', 
    borderRadius: 8, 
    padding: 12 
  },
  actionText: { 
    color: '#b0b0ff', 
    fontSize: 16 
  },
  hint: { 
    color: '#ffb347', 
    fontSize: 16, 
    marginTop: 20, 
    textAlign: 'center' 
  },
  subtitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    top: 150,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#23243A',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(35, 36, 58, 0.8)',
    borderRadius: 12,
    padding: 16,
    minWidth: 120,
  },
  statLabel: {
    color: '#b0b0ff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statValue: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  difficultyLabel: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starsText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 