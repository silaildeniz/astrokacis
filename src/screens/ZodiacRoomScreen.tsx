import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { saveGameProgress, getGameProgress } from '../firebase/firestoreService';
import { checkAndUpdateBadges, calculateStars } from '../services/badgeService';

const { width, height } = Dimensions.get('window');

const zodiacSigns = [
  { name: 'Koç', image: require('../../assets/icons/koc.jpg') },
  { name: 'Boğa', image: require('../../assets/icons/boga.jpg') },
  { name: 'İkizler', image: require('../../assets/icons/ikizler.jpg') },
  { name: 'Yengeç', image: require('../../assets/icons/yengec.jpg') },
  { name: 'Aslan', image: require('../../assets/icons/aslan.jpg') },
  { name: 'Başak', image: require('../../assets/icons/basak.jpg') },
  { name: 'Terazi', image: require('../../assets/icons/terazi.jpg') },
  { name: 'Akrep', image: require('../../assets/icons/akrep.jpg') },
  { name: 'Yay', image: require('../../assets/icons/yay.jpg') },
  { name: 'Oğlak', image: require('../../assets/icons/oglak.jpg') },
  { name: 'Kova', image: require('../../assets/icons/kova.jpg') },
  { name: 'Balık', image: require('../../assets/icons/balik.jpg') }
];

const zodiacQuestions = {
  'Koç': [
    {
      difficulty: 'Kolay',
      question: 'Koç burcunun elementi nedir?',
      options: ['Su', 'Hava', 'Ateş', 'Toprak'],
      answer: 2,
      hint: 'İlk adımı atan, enerjik burçlardan biri.'
    },
    {
      difficulty: 'Orta',
      question: 'Koç burcunun yönetici gezegeni hangisidir?',
      options: ['Venüs', 'Merkür', 'Mars', 'Jüpiter'],
      answer: 2,
      hint: 'Savaşçı, dürtüsel ve cesur gezegen.'
    },
    {
      difficulty: 'Zor',
      question: 'Koç burcu zodyakta kaçıncı sıradadır?',
      options: ['12', '6', '9', '1'],
      answer: 3,
      hint: 'Baharla başlar, başlangıçtır.'
    }
  ],
  'Boğa': [
    {
      difficulty: 'Kolay',
      question: 'Boğa burcu hangi elemente aittir?',
      options: ['Hava', 'Su', 'Toprak', 'Ateş'],
      answer: 2,
      hint: 'Sabit, güven arayan ve üretken.'
    },
    {
      difficulty: 'Orta',
      question: 'Boğa burcu hangi gezegen tarafından yönetilir?',
      options: ['Merkür', 'Mars', 'Venüs', 'Neptün'],
      answer: 2,
      hint: 'Estetik ve huzuru sever.'
    },
    {
      difficulty: 'Zor',
      question: 'Boğa burcu hangi niteliktedir?',
      options: ['Değişken', 'Sabit', 'Öncü', 'Çift'],
      answer: 1,
      hint: 'Karar verdiyse kolay değişmez.'
    }
  ],
  'İkizler': [
    {
      difficulty: 'Kolay',
      question: 'İkizler burcunun elementi nedir?',
      options: ['Ateş', 'Hava', 'Toprak', 'Su'],
      answer: 1,
      hint: 'Zihinle, konuşmayla ilgili burçlardan.'
    },
    {
      difficulty: 'Orta',
      question: 'İkizler burcu hangi gezegen tarafından yönetilir?',
      options: ['Mars', 'Ay', 'Merkür', 'Uranüs'],
      answer: 2,
      hint: 'Bilgi ve iletişim gezegeni.'
    },
    {
      difficulty: 'Zor',
      question: 'İkizler burcunun zodyakta sırası nedir?',
      options: ['2', '3', '5', '6'],
      answer: 1,
      hint: 'İlkbaharın son burcu.'
    }
  ],
  'Yengeç': [
    {
      difficulty: 'Kolay',
      question: 'Yengeç burcunun elementi nedir?',
      options: ['Toprak', 'Su', 'Hava', 'Ateş'],
      answer: 1,
      hint: 'Duyguların derinliğiyle bilinir.'
    },
    {
      difficulty: 'Orta',
      question: 'Yengeç burcu hangi gezegenin yönetimindedir?',
      options: ['Ay', 'Mars', 'Güneş', 'Merkür'],
      answer: 0,
      hint: 'Ruh halleri ile dalgalanır.'
    },
    {
      difficulty: 'Zor',
      question: 'Yengeç burcu hangi niteliktedir?',
      options: ['Sabit', 'Değişken', 'Öncü', 'Gizli'],
      answer: 2,
      hint: 'Sezgileriyle başlatan burçlardan.'
    }
  ],
  'Aslan': [
    {
      difficulty: 'Kolay',
      question: 'Aslan burcunun elementi nedir?',
      options: ['Ateş', 'Su', 'Toprak', 'Hava'],
      answer: 0,
      hint: 'Parlamayı ve dikkat çekmeyi sever.'
    },
    {
      difficulty: 'Orta',
      question: 'Aslan burcu hangi gezegen tarafından yönetilir?',
      options: ['Mars', 'Ay', 'Jüpiter', 'Güneş'],
      answer: 3,
      hint: 'Kendi etrafında döndürür her şeyi.'
    },
    {
      difficulty: 'Zor',
      question: 'Aslan burcu zodyakta kaçıncı sıradadır?',
      options: ['4', '5', '6', '7'],
      answer: 1,
      hint: 'Yaratıcılık ve sahneyle ilgilidir.'
    }
  ],
  'Başak': [
    {
      difficulty: 'Kolay',
      question: 'Başak burcunun elementi nedir?',
      options: ['Hava', 'Su', 'Toprak', 'Ateş'],
      answer: 2,
      hint: 'Detaycı, düzenli ve analitik.'
    },
    {
      difficulty: 'Orta',
      question: 'Başak burcu hangi gezegen tarafından yönetilir?',
      options: ['Satürn', 'Merkür', 'Neptün', 'Venüs'],
      answer: 1,
      hint: 'Düşünme ve analiz odaklı.'
    },
    {
      difficulty: 'Zor',
      question: 'Başak hangi niteliktedir?',
      options: ['Değişken', 'Sabit', 'Öncü', 'Yıkıcı'],
      answer: 0,
      hint: 'Uyum sağlar ama detaydan vazgeçmez.'
    }
  ],
  'Terazi': [
    {
      difficulty: 'Kolay',
      question: 'Terazi burcunun elementi nedir?',
      options: ['Hava', 'Su', 'Toprak', 'Ateş'],
      answer: 0,
      hint: 'Zihinsel denge ve ilişkiler burcu.'
    },
    {
      difficulty: 'Orta',
      question: 'Terazi burcu hangi gezegenin yönetimindedir?',
      options: ['Mars', 'Merkür', 'Uranüs', 'Venüs'],
      answer: 3,
      hint: 'Güzellik ve uyum burcu.'
    },
    {
      difficulty: 'Zor',
      question: 'Terazi burcu zodyakta kaçıncı sıradadır?',
      options: ['7', '6', '8', '5'],
      answer: 0,
      hint: 'Zodyağın tam ortasında.'
    }
  ],
  'Akrep': [
    {
      difficulty: 'Kolay',
      question: 'Akrep burcunun elementi nedir?',
      options: ['Ateş', 'Hava', 'Su', 'Toprak'],
      answer: 2,
      hint: 'Derin duygular ve sezgiler.'
    },
    {
      difficulty: 'Orta',
      question: 'Akrep burcunu yöneten gezegenler hangileridir?',
      options: ['Güneş ve Mars', 'Ay ve Neptün', 'Mars ve Plüton', 'Merkür ve Uranüs'],
      answer: 2,
      hint: 'Güç, dönüşüm ve derinlik.'
    },
    {
      difficulty: 'Zor',
      question: 'Akrep hangi niteliktedir?',
      options: ['Öncü', 'Değişken', 'Sabit', 'Kararsız'],
      answer: 2,
      hint: 'Takıntılı ama kararlı.'
    }
  ],
  'Yay': [
    {
      difficulty: 'Kolay',
      question: 'Yay burcunun elementi nedir?',
      options: ['Toprak', 'Su', 'Ateş', 'Hava'],
      answer: 2,
      hint: 'Macera ve öğrenme isteğiyle yanar.'
    },
    {
      difficulty: 'Orta',
      question: 'Yay burcunun yöneticisi kimdir?',
      options: ['Venüs', 'Satürn', 'Mars', 'Jüpiter'],
      answer: 3,
      hint: 'Bilgelik ve genişleme.'
    },
    {
      difficulty: 'Zor',
      question: 'Yay burcu hangi niteliktedir?',
      options: ['Sabit', 'Öncü', 'Değişken', 'Yıkıcı'],
      answer: 2,
      hint: 'Uyum sağlar ama sınır tanımaz.'
    }
  ],
  'Oğlak': [
    {
      difficulty: 'Kolay',
      question: 'Oğlak burcunun elementi nedir?',
      options: ['Ateş', 'Toprak', 'Su', 'Hava'],
      answer: 1,
      hint: 'Planlı, sorumlu ve dayanıklı.'
    },
    {
      difficulty: 'Orta',
      question: 'Oğlak burcunun yöneticisi kimdir?',
      options: ['Mars', 'Güneş', 'Satürn', 'Neptün'],
      answer: 2,
      hint: 'Zamanın efendisi.'
    },
    {
      difficulty: 'Zor',
      question: 'Oğlak burcu zodyakta kaçıncı sıradadır?',
      options: ['10', '11', '9', '8'],
      answer: 0,
      hint: 'Kariyer ve toplumla ilişkilidir.'
    }
  ],
  'Kova': [
    {
      difficulty: 'Kolay',
      question: 'Kova burcunun elementi nedir?',
      options: ['Hava', 'Toprak', 'Su', 'Ateş'],
      answer: 0,
      hint: 'Düşünce özgürlüğü ve yenilik.'
    },
    {
      difficulty: 'Orta',
      question: "Kova'nın klasik ve modern yöneticileri kimdir?",
      options: ['Uranüs ve Satürn', 'Mars ve Ay', 'Venüs ve Merkür', 'Güneş ve Plüton'],
      answer: 0,
      hint: 'Hem gelenekçi hem devrimci.'
    },
    {
      difficulty: 'Zor',
      question: 'Kova burcu hangi niteliktedir?',
      options: ['Öncü', 'Sabit', 'Değişken', 'Durağan'],
      answer: 1,
      hint: 'Fikirleri değişmez ama sıra dışıdır.'
    }
  ],
  'Balık': [
    {
      difficulty: 'Kolay',
      question: 'Balık burcunun elementi nedir?',
      options: ['Toprak', 'Su', 'Hava', 'Ateş'],
      answer: 1,
      hint: 'Hayal gücü kuvvetli, empatik.'
    },
    {
      difficulty: 'Orta',
      question: 'Balık burcunun yöneticileri kimdir?',
      options: ['Neptün ve Jüpiter', 'Mars ve Uranüs', 'Ay ve Merkür', 'Venüs ve Plüton'],
      answer: 0,
      hint: 'Rüya ve inanç gezegenleri.'
    },
    {
      difficulty: 'Zor',
      question: 'Balık burcu hangi niteliktedir?',
      options: ['Sabit', 'Öncü', 'Değişken', 'Katı'],
      answer: 2,
      hint: 'Şekil alır ama sınır tanımaz.'
    }
  ]
};

export default function ZodiacRoomScreen({ navigation, route }: any) {
  const { user } = route.params || {};
  const [currentView, setCurrentView] = useState<'intro' | 'zodiac' | 'quiz'>('intro');
  const [selectedZodiac, setSelectedZodiac] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [zodiacScore, setZodiacScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(20);
  const [showHint, setShowHint] = useState(false);
  const [completedZodiacs, setCompletedZodiacs] = useState<string[]>([]);
  const [allZodiacsUnlocked, setAllZodiacsUnlocked] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [canAnswer, setCanAnswer] = useState(true);
  const [showCanAlert, setShowCanAlert] = useState(false);
  
  // Yıldızlı sistem için yeni state'ler
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [zodiacStars, setZodiacStars] = useState<{[key: string]: number}>({});
  const [newBadges, setNewBadges] = useState<any[]>([]);
  
  // Animasyon değerleri
  const zodiacRotateAnim = useRef(new Animated.Value(0)).current;
  const zodiacGlowAnim = useRef(new Animated.Value(0)).current;
  const userZodiacGlowAnim = useRef(new Animated.Value(0)).current;
  const messageAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (user) {
      loadGameProgress();
      startIntroAnimation();
    } else {
      // User yoksa direkt intro animasyonunu başlat
      startIntroAnimation();
    }
  }, [user]);

  const loadGameProgress = async () => {
    try {
      if (user?.id) {
        const progress = await getGameProgress(user.id);
        if (progress.completedZodiacs) {
          setCompletedZodiacs(progress.completedZodiacs);
          // Eğer kendi burcu tamamlanmışsa tüm burçları aç
          if (user?.sun_sign && progress.completedZodiacs.includes(user.sun_sign)) {
            setAllZodiacsUnlocked(true);
          }
        }
        if (progress.totalScore) {
          setScore(progress.totalScore);
        }
        // Burç yıldızlarını yükle
        if (progress.zodiacScores) {
          const stars: {[key: string]: number} = {};
          Object.entries(progress.zodiacScores).forEach(([zodiac, data]: [string, any]) => {
            if (data.stars) {
              stars[zodiac] = data.stars;
            }
          });
          setZodiacStars(stars);
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
    // Önce tüm burçlar dönsün
    Animated.timing(zodiacRotateAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      // Dönme bittikten sonra sabitlensin
      Animated.timing(zodiacRotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
    });
    
    // Burçlar yanıp sönme
    Animated.loop(
      Animated.sequence([
        Animated.timing(zodiacGlowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(zodiacGlowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
    
    // 3 saniye sonra ana ekrana geç
    setTimeout(() => {
      setCurrentView('zodiac');
      Animated.timing(userZodiacGlowAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start(() => {
        Animated.timing(messageAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      });
    }, 3000);
  };

  const handleZodiacPress = (zodiac: string) => {
    setSelectedZodiac(zodiac);
    setCurrentView('quiz');
    setCurrentQuestion(0);
    setZodiacScore(0);
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
    
    if (idx === zodiacQuestions[selectedZodiac as keyof typeof zodiacQuestions][currentQuestion].answer) {
      setScore(s => s + 100);
      setZodiacScore(z => z + 100);
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
                navigation.navigate('Corridor', { user });
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
            onPress: () => navigation.navigate('Corridor', { user }),
            style: 'cancel'
          }
        ]
      );
    } else if (lives - 1 > 0) {
      nextQuestion();
    }
  };

  const nextQuestion = async () => {
    if (currentQuestion < zodiacQuestions[selectedZodiac as keyof typeof zodiacQuestions].length - 1) {
      setCurrentQuestion(c => c + 1);
      setTime(20);
      setShowHint(false);
      setSelectedAnswer(null);
      setShowAnswerFeedback(false);
      setCanAnswer(true);
    } else {
      // Burç tamamlandı - yıldız hesapla
      const stars = calculateStars({
        totalQuestions: zodiacQuestions[selectedZodiac as keyof typeof zodiacQuestions].length,
        correctAnswers: zodiacQuestions[selectedZodiac as keyof typeof zodiacQuestions].length - wrongAnswers,
        wrongAnswers: wrongAnswers
      });
      
      // Burç yıldızlarını güncelle
      const updatedZodiacStars = {
        ...zodiacStars,
        [selectedZodiac]: stars
      };
      setZodiacStars(updatedZodiacStars);
      
      // Burç tamamlandı
      const newCompletedZodiacs = [...completedZodiacs, selectedZodiac];
      setCompletedZodiacs(newCompletedZodiacs);
      
      // İlerlemeyi kaydet (sadece daha önce tamamlanmamışsa)
      if (user?.id && !completedZodiacs.includes(selectedZodiac)) {
        try {
          const gameData = {
            completedZodiacs: newCompletedZodiacs,
            totalScore: score + zodiacScore,
            zodiacScores: {
              ...updatedZodiacStars,
              [selectedZodiac]: {
                totalQuestions: zodiacQuestions[selectedZodiac as keyof typeof zodiacQuestions].length,
                correctAnswers: zodiacQuestions[selectedZodiac as keyof typeof zodiacQuestions].length - wrongAnswers,
                wrongAnswers: wrongAnswers,
                stars: stars
              }
            }
          };
          
          await saveGameProgress(user.id, gameData);
          
          // Rozet kontrolü
          const badges = await checkAndUpdateBadges(user.id, gameData);
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
      
      // Yıldız gösterimi ile burç tamamlandı mesajı
      const starEmojis = '⭐'.repeat(stars);
      const starText = stars === 3 ? 'Mükemmel!' : stars === 2 ? 'İyi!' : 'Geçer!';
      
      Alert.alert(
        `🎉 BURÇ BAŞARISI! 🎉`, 
        `${selectedZodiac} burcunu tamamladın!\n\n${starEmojis} ${starText}\n\nBurcunun sırlarını çözdün ve yeni kapılar açtın.`
      );
      
      setCurrentView('zodiac');
      setSelectedZodiac('');
      
      // Tüm burçlar tamamlandıysa sıralı mesajlar göster
      if (newCompletedZodiacs.length === Object.keys(zodiacQuestions).length) {
        setTimeout(() => {
          Alert.alert(
            '🎉 BURÇ USTASI! 🎉', 
            'Tüm burçların sırlarını çözdün!\n\nBurçlar artık seninle konuşuyor...',
            [
              {
                text: 'Devam Et',
                onPress: () => {
                  setTimeout(() => {
                    Alert.alert(
                      'Koridora Dönüyorsun',
                      'Burçlar evreninden çıkıyorsun...\n\nBir sonraki kapıyı bekliyor.',
                      [
                        {
                          text: 'Tamam',
                          onPress: () => navigation.navigate('Corridor', { user, zodiacsCompleted: true })
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

  const rotateInterpolate = zodiacRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const counterRotateInterpolate = zodiacRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const getZodiacPosition = (index: number) => {
    const angle = (index * 30) * (Math.PI / 180);
    const radius = 150; // Daha da büyük radius - daireleri daha fazla uzaklaştır
    return {
      left: width / 2 + radius * Math.cos(angle) - 40,
      top: height / 2 + radius * Math.sin(angle) - 40,
    };
  };

  const getOptionStyle = (idx: number) => {
    if (!showAnswerFeedback) return styles.option;
    
    if (idx === zodiacQuestions[selectedZodiac as keyof typeof zodiacQuestions][currentQuestion].answer) {
      return [styles.option, styles.correctAnswer];
    } else if (idx === selectedAnswer) {
      return [styles.option, styles.wrongAnswer];
    }
    return styles.option;
  };

  if (currentView === 'intro') {
    return (
      <View style={styles.container}>
        <LottieView 
          source={require('../../assets/lottie/nebula.json')} 
          autoPlay 
          loop 
          style={styles.bgAnim}
        />
        
        {/* Zodyak çarkı */}
        <Animated.View
          style={[
            styles.zodiacWheel,
            {
              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        >
          {zodiacSigns.map((zodiac, index) => {
            const position = getZodiacPosition(index);
            return (
              <Animated.View
                key={zodiac.name}
                style={[
                  styles.zodiacSymbol,
                  {
                    left: position.left,
                    top: position.top,
                    opacity: zodiacGlowAnim,
                  },
                ]}
              >
                <Text style={styles.zodiacText}>{zodiac.name}</Text>
              </Animated.View>
            );
          })}
        </Animated.View>
      </View>
    );
  }

  if (currentView === 'quiz') {
    const currentQ = zodiacQuestions[selectedZodiac as keyof typeof zodiacQuestions][currentQuestion];
    
    return (
      <View style={styles.container}>
        <Text style={styles.status}>Toplam Puan: {score}   Can: {lives}   Süre: {time}s</Text>
        <Text style={styles.zodiacScore}>Bu Burç Puanı: {zodiacScore}</Text>
        <Text style={styles.title}>{selectedZodiac} Sınavı</Text>
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
      <LottieView 
        source={require('../../assets/lottie/nebula.json')} 
        autoPlay 
        loop 
        style={styles.bgAnim}
        resizeMode="cover"
      />
      
      {/* Zodyak çarkı */}
      <Animated.View
        style={[
          styles.zodiacWheel,
          {
            transform: [{ rotate: rotateInterpolate }],
          },
        ]}
      >
        {zodiacSigns.map((zodiac, index) => {
          const position = getZodiacPosition(index);
          const isUserZodiac = zodiac.name === user?.sun_sign;
          const isUnlocked = isUserZodiac || allZodiacsUnlocked;
          const isCompleted = completedZodiacs.includes(zodiac.name);
          
          return (
            <Animated.View
              key={zodiac.name}
              style={[
                styles.zodiacWrapper,
                {
                  left: position.left,
                  top: position.top,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.zodiacButton,
                  { backgroundColor: isUserZodiac ? '#4ECDC4' : '#23243A' },
                  isCompleted && styles.completedZodiac,
                ]}
                onPress={() => handleZodiacPress(zodiac.name)}
              >
                <Animated.View
                  style={[
                    styles.zodiacTextContainer,
                    {
                      transform: [{ rotate: counterRotateInterpolate }],
                    },
                  ]}
                >
                  <Text style={styles.zodiacText}>{zodiac.name}</Text>
                  {isCompleted && <Text style={styles.completedText}>✅</Text>}
                </Animated.View>
              </TouchableOpacity>
              
              {/* Burç adı - dairenin altında */}
              <Text style={styles.zodiacNameText}>{zodiac.name}</Text>
              
              {/* SEN yazısı - dairenin altında */}
              {isUserZodiac && <Text style={styles.userZodiacText}>SEN</Text>}
              
              {/* Işıklı yol */}
              <View style={[styles.lightPath, { backgroundColor: isUserZodiac ? '#4ECDC4' : '#FFD700' }]} />
            </Animated.View>
          );
        })}
      </Animated.View>

      {/* Kozmik mesaj */}
      <Animated.View
        style={[
          styles.messageContainer,
          {
            opacity: messageAnim,
          },
        ]}
      >
        <Text style={styles.kozmikTitle}>BURÇLAR EVRENİ</Text>
        <Text style={styles.kozmikMessage}>Her burç bir sırrı saklar, her sırrı çözdüğünde bir kapı açılır</Text>
      </Animated.View>

      {/* İlerleme çubuğu */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(completedZodiacs.length / zodiacSigns.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {completedZodiacs.length}/{zodiacSigns.length} Burç Tamamlandı
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
          <Text style={styles.statValue}>{completedZodiacs.length}</Text>
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
  zodiacWheel: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  zodiacSymbol: {
    position: 'absolute',
    width: 60,
    height: 60,
  },
  zodiacButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#23243A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4ECDC4',
    zIndex: 100,
  },
  userZodiac: {
    backgroundColor: '#4ECDC4',
    borderColor: '#FFD700',
  },
  lockedZodiac: {
    opacity: 0.5,
    borderColor: '#333',
  },
  zodiacText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  zodiacTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  userZodiacText: {
    color: '#9B59B6', // Canlı kırmızı - dikkat çekici
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    position: 'absolute',
    bottom: -45,
    left: 0,
    right: 0,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  lockText: {
    fontSize: 16,
    marginTop: 2,
  },
  messageContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 200,
  },
  kozmikTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  kozmikMessage: {
    color: '#b0b0ff',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
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
  correctAnswer: {
    backgroundColor: '#4CAF50',
  },
  wrongAnswer: {
    backgroundColor: '#F44336',
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
    padding: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  hint: {
    color: '#FFD700',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  zodiacWrapper: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  completedZodiac: {
    backgroundColor: '#4ECDC4',
    borderColor: '#FFD700',
  },
  lightPath: {
    position: 'absolute',
    width: 2,
    height: 10,
    backgroundColor: '#FFD700',
    borderRadius: 1,
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
  completedText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  unlockText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  zodiacScore: {
    color: '#FFD700',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  zodiacImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 40,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  zodiacNameText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    position: 'absolute',
    bottom: -15,
    left: 0,
    right: 0,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 