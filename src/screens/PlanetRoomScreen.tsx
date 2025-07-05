import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { saveGameProgress, getGameProgress } from '../firebase/firestoreService';
import { checkAndUpdateBadges, calculateStars } from '../services/badgeService';

const { width, height } = Dimensions.get('window');

const initialPlanets = [
  { 
    key: 'merkur', 
    name: 'Merkür', 
    image: require('../../assets/icons/planets/merkür.png'), 
    unlocked: true, 
    color: '#8B4513', 
    questions: [
      { 
        difficulty: 'Kolay',
        question: 'Merkür gezegeni genellikle neyle ilişkilendirilir?', 
        options: ['Aşk', 'İletişim', 'Rüyalar', 'Güç'], 
        answer: 1,
        hint: 'Konuşmak, yazmak ve düşünmekle ilgili bir gezegen.'
      },
      { 
        difficulty: 'Orta',
        question: 'Merkür retrodaysa genelde hangi alanlarda aksaklıklar olur?', 
        options: ['Fiziksel sağlık', 'Finansal yatırımlar', 'Elektronik ve iletişim', 'Aile ilişkileri'], 
        answer: 2,
        hint: 'Mail gönderemedin mi, telefon çekmiyor mu? Sebebi olabilir.'
      },
      { 
        difficulty: 'Zor',
        question: 'Merkür haritada hangi tür burçlarda daha güçlü kabul edilir?', 
        options: ['Ateş burçları', 'Su burçları', 'Değişken burçlar', 'Toprak burçları'], 
        answer: 2,
        hint: 'İkizler ve Başak gibi değişken enerjiye sahip burçlar.'
      }
    ]
  },
  { 
    key: 'ay', 
    name: 'Ay', 
    image: require('../../assets/icons/planets/ay.png'), 
    unlocked: false, 
    color: '#F0F8FF', 
    questions: [
      { 
        difficulty: 'Kolay',
        question: 'Ay burcu kişinin hangi yönünü temsil eder?', 
        options: ['Mesleği', 'Fiziksel yapısı', 'Duygusal dünyası', 'Zihinsel yetenekleri'], 
        answer: 2,
        hint: 'Kalbin hangi frekansta çalıştığını Ay söyler.'
      },
      { 
        difficulty: 'Orta',
        question: 'Ay hangi süreyle burç değiştirir?', 
        options: ['Her gün', 'Yaklaşık 2-2.5 günde bir', 'Haftada bir', 'Ayda bir'], 
        answer: 1,
        hint: 'Ruh halin neden hızlı değişiyor olabilir?'
      },
      { 
        difficulty: 'Zor',
        question: 'Doğum haritasında Ay\'ın düşük konumda olduğu burç hangisidir?', 
        options: ['Boğa', 'Yengeç', 'Akrep', 'Balık'], 
        answer: 2,
        hint: 'Ay burada daha karanlık, daha derin bir hale bürünür.'
      }
    ]
  },
  { 
    key: 'gunes', 
    name: 'Güneş', 
    image: require('../../assets/icons/planets/gunes.png'), 
    unlocked: false, 
    color: '#FFA500', 
    questions: [
      { 
        difficulty: 'Kolay',
        question: 'Güneş burcu neyi temsil eder?', 
        options: ['Zihni', 'Duyguları', 'Kimliği ve egoyu', 'Rüyaları'], 
        answer: 2,
        hint: '"Ben kimim?" sorusunun cevabını Güneş verir.'
      },
      { 
        difficulty: 'Orta',
        question: 'Hangi burçta Güneş yücelir (exalt)?', 
        options: ['Koç', 'Yengeç', 'Terazi', 'Boğa'], 
        answer: 0,
        hint: 'Güneş burada lider gibi parlar.'
      },
      { 
        difficulty: 'Zor',
        question: 'Güneş\'in burç değişimi yaklaşık kaç günde bir olur?', 
        options: ['15', '30', '7', '60'], 
        answer: 1,
        hint: 'Her ay yeni bir burç sezonu başlar.'
      }
    ]
  },
  { 
    key: 'venus', 
    name: 'Venüs', 
    image: require('../../assets/icons/planets/venüs.png'), 
    unlocked: false, 
    color: '#FFB6C1', 
    questions: [
      { 
        difficulty: 'Kolay',
        question: 'Venüs gezegeni neyi temsil eder?', 
        options: ['Zeka', 'Savaş', 'Aşk ve değerler', 'Kariyer'], 
        answer: 2,
        hint: 'Kimden hoşlandığını ve neleri sevdiğini anlatır.'
      },
      { 
        difficulty: 'Orta',
        question: 'Venüs haritada zarar gördüyse ilişkilerde ne olabilir?', 
        options: ['Kırılganlık ve bağımlılık', 'Mantıkla karar verme', 'Hızlı başarı', 'Fiziksel güç'], 
        answer: 0,
        hint: 'Kalp meseleleri hassaslaşır.'
      },
      { 
        difficulty: 'Zor',
        question: 'Venüs haritada sabah yıldızıysa ne ifade eder?', 
        options: ['Gizli aşklar', 'Dışa dönük ilişki tarzı', 'Platonik eğilimler', 'Mantıksal aşk'], 
        answer: 1,
        hint: 'Güneş\'ten önce doğan yıldız.'
      }
    ]
  },
  { 
    key: 'mars', 
    name: 'Mars', 
    image: require('../../assets/icons/planets/mars.png'), 
    unlocked: false, 
    color: '#FF4500', 
    questions: [
      { 
        difficulty: 'Kolay',
        question: 'Mars neyi temsil eder?', 
        options: ['Sezgi', 'Savaş, hareket ve dürtüler', 'Para', 'Bilgelik'], 
        answer: 1,
        hint: 'Harekete geçiren iç enerjin.'
      },
      { 
        difficulty: 'Orta',
        question: 'Mars retrodaysa nasıl etkiler yaratabilir?', 
        options: ['Uyum artar', 'İçsel öfke, harekette duraksama', 'Rüyalar artar', 'Sezgiler keskinleşir'], 
        answer: 1,
        hint: 'Enerji dışa değil içe yönelir.'
      },
      { 
        difficulty: 'Zor',
        question: 'Mars hangi burçta düşük konumdadır?', 
        options: ['Koç', 'Yengeç', 'Başak', 'Terazi'], 
        answer: 1,
        hint: 'Savaşçı burada duygusal kararlar verir.'
      }
    ]
  },
  { 
    key: 'jupiter', 
    name: 'Jüpiter', 
    image: require('../../assets/icons/planets/jüpiter.png'), 
    unlocked: false, 
    color: '#FFD700', 
    questions: [
      { 
        difficulty: 'Kolay',
        question: 'Jüpiter hangi kavramla ilişkilendirilir?', 
        options: ['Sınırlar', 'Sıkıntılar', 'Genişleme ve şans', 'Manipülasyon'], 
        answer: 2,
        hint: 'En büyük gezegen, en çok veren.'
      },
      { 
        difficulty: 'Orta',
        question: 'Jüpiter haritada olumlu etkideyse hangi alanlar parlayabilir?', 
        options: ['Kayıplar', 'Kısıtlamalar', 'Bolluk ve öğreticilik', 'Kaçış eğilimleri'], 
        answer: 2,
        hint: 'Bilge öğretmen gibi davranır.'
      },
      { 
        difficulty: 'Zor',
        question: 'Jüpiter doğum haritasında geri gidiyorsa kişi ne yapabilir?', 
        options: ['Dışa dönük olur', 'Maddi konularda başarısız olur', 'İçsel felsefi keşif yaşar', 'Sorumluluklardan kaçar'], 
        answer: 2,
        hint: 'Öğretici bilgi içe döner.'
      }
    ]
  },
  { 
    key: 'saturn', 
    name: 'Satürn', 
    image: require('../../assets/icons/planets/saturn.png'), 
    unlocked: false, 
    color: '#C0C0C0', 
    questions: [
      { 
        difficulty: 'Kolay',
        question: 'Satürn gezegeni neyi sembolize eder?', 
        options: ['Hayaller', 'Kurallar, sınırlar ve disiplin', 'Duygular', 'Zevk'], 
        answer: 1,
        hint: 'Hayat derslerini getiren gezegen.'
      },
      { 
        difficulty: 'Orta',
        question: 'Satürn\'ün döngüsü yaklaşık kaç yılda bir tamamlanır?', 
        options: ['12 yıl', '29-30 yıl', '7 yıl', '50 yıl'], 
        answer: 1,
        hint: '"Satürn Return" terimi buradan gelir.'
      },
      { 
        difficulty: 'Zor',
        question: 'Satürn düşük konumda hangi burçtadır?', 
        options: ['Koç', 'Terazi', 'Balık', 'Aslan'], 
        answer: 0,
        hint: 'Sabır ve disiplin burada zorlanır.'
      }
    ]
  },
  { 
    key: 'uranus', 
    name: 'Uranüs', 
    image: require('../../assets/icons/planets/uranus.png'), 
    unlocked: false, 
    color: '#40E0D0', 
    questions: [
      { 
        difficulty: 'Kolay',
        question: 'Uranüs hangi temaları temsil eder?', 
        options: ['Rutin ve alışkanlık', 'Değişim, özgürlük ve yenilik', 'Sezgi ve rüyalar', 'Aşk ve ilişkiler'], 
        answer: 1,
        hint: 'Sistemi sarsar, yeniyi getirir.'
      },
      { 
        difficulty: 'Orta',
        question: 'Uranüs haritada güçlü olduğunda kişi nasıl hisseder?', 
        options: ['Geleneksel', 'Yenilikçi, bireyci', 'Sakin', 'Disiplinli'], 
        answer: 1,
        hint: 'Kalıpları kırar.'
      },
      { 
        difficulty: 'Zor',
        question: 'Uranüs hangi burçta yüceldiği kabul edilir?', 
        options: ['Akrep', 'Kova', 'Boğa', 'Yengeç'], 
        answer: 0,
        hint: 'Derin dönüşümlerle uyanış yaşanır.'
      }
    ]
  },
  { 
    key: 'neptun', 
    name: 'Neptün', 
    image: require('../../assets/icons/planets/neptün.png'), 
    unlocked: false, 
    color: '#4169E1', 
    questions: [
      { 
        difficulty: 'Kolay',
        question: 'Neptün genellikle hangi temaları temsil eder?', 
        options: ['Somutluk', 'Sezgiler, rüyalar ve ilüzyon', 'Mantık', 'Fiziksel sağlık'], 
        answer: 1,
        hint: 'Sisli, rüya gibi bir gezegen.'
      },
      { 
        difficulty: 'Orta',
        question: 'Neptün negatif etkideyken kişi ne yaşayabilir?', 
        options: ['Gerçekçilik', 'Manevi netlik', 'Kaçış ve illüzyon', 'Fiziksel agresyon'], 
        answer: 2,
        hint: 'Gerçeklerden uzaklaşabilirsin.'
      },
      { 
        difficulty: 'Zor',
        question: 'Neptün hangi burçta zararlı (detriment) kabul edilir?', 
        options: ['Başak', 'Balık', 'Yengeç', 'Yay'], 
        answer: 0,
        hint: 'Detay ve analiz, Neptün\'ü boğabilir.'
      }
    ]
  },
  { 
    key: 'pluton', 
    name: 'Plüton', 
    image: require('../../assets/icons/planets/pluton.png'), 
    unlocked: false, 
    color: '#800080', 
    questions: [
      { 
        difficulty: 'Kolay',
        question: 'Plüton neyi temsil eder?', 
        options: ['Zihin', 'Korkular, dönüşüm ve güç', 'Şans', 'İlişkiler'], 
        answer: 1,
        hint: 'Kriz getirir ama seni yeniden doğurur.'
      },
      { 
        difficulty: 'Orta',
        question: 'Plüton hangi evde olursa kişi içsel dönüşüm yaşar?', 
        options: ['2. Ev', '7. Ev', '8. Ev', '10. Ev'], 
        answer: 2,
        hint: 'Ölüm ve yeniden doğumun evi.'
      },
      { 
        difficulty: 'Zor',
        question: 'Plüton transiti uzun sürelidir. Yaklaşık kaç yıl aynı burçta kalabilir?', 
        options: ['2', '10', '12-30', '1'], 
        answer: 2,
        hint: 'Kolektif dönüşümü yavaş ve derin getirir.'
      }
    ]
  }
];

export default function PlanetRoomScreen({ navigation, route }: any) {
  const [planets, setPlanets] = useState(initialPlanets);
  const [currentView, setCurrentView] = useState<'planets' | 'quiz'>('planets');
  const [selectedPlanet, setSelectedPlanet] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(20);
  const [showHint, setShowHint] = useState(false);
  const [completedPlanets, setCompletedPlanets] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [canAnswer, setCanAnswer] = useState(true);
  const [planetScore, setPlanetScore] = useState(0);
  const [showCanAlert, setShowCanAlert] = useState(false);
  
  // Yıldızlı sistem için yeni state'ler
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [planetStars, setPlanetStars] = useState<{[key: string]: number}>({});
  const [newBadges, setNewBadges] = useState<any[]>([]);
  
  // Animasyon değerleri
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const messageAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadGameProgress();
    startPlanetAnimation();
  }, []);

  const loadGameProgress = async () => {
    try {
      if (route.params?.user?.id) {
        const progress = await getGameProgress(route.params.user.id);
        if (progress.completedPlanets) {
          setCompletedPlanets(progress.completedPlanets);
          // Tamamlanan gezegenleri güncelle
          const updatedPlanets = planets.map(planet => ({
            ...planet,
            unlocked: planet.key === 'merkur' || progress.completedPlanets.includes(planet.key)
          }));
          setPlanets(updatedPlanets);
        }
        if (progress.totalScore) {
          setScore(progress.totalScore);
        }
        // Gezegen yıldızlarını yükle
        if (progress.planetScores) {
          const stars: {[key: string]: number} = {};
          Object.entries(progress.planetScores).forEach(([planet, data]: [string, any]) => {
            if (data.stars) {
              stars[planet] = data.stars;
            }
          });
          setPlanetStars(stars);
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

  const startPlanetAnimation = () => {
    // Gezegenler etrafında dönme animasyonu
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Gezegenlerin belirme animasyonu
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      // Mesaj animasyonu
      Animated.timing(messageAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    });
  };

  const handlePlanetPress = (planet: any) => {
    if (planet.unlocked) {
      setSelectedPlanet(planet);
      setCurrentView('quiz');
      setCurrentQuestion(0);
      setPlanetScore(0);
      setWrongAnswers(0);
      setTime(20);
      setShowHint(false);
      setSelectedAnswer(null);
      setShowAnswerFeedback(false);
      setCanAnswer(true);
    }
  };

  const handleOption = (idx: number) => {
    if (!canAnswer) return;
    
    setSelectedAnswer(idx);
    setShowAnswerFeedback(true);
    setCanAnswer(false);
    
    if (idx === selectedPlanet.questions[currentQuestion].answer) {
      setScore(s => s + 100);
      setPlanetScore(ps => ps + 100);
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
      // Can sıfırlandığında seçenek sun
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
                // Kaldığı yerden devam et - aynı soruya geri dön
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
              // Reklam izleme simülasyonu
              Alert.alert(
                'Reklam İzleniyor...',
                'Reklam tamamlandı! +1 can kazandın.',
                [
                  {
                    text: 'Devam Et',
                    onPress: () => {
                      setLives(1);
                      setShowCanAlert(false);
                      // Kaldığı yerden devam et - aynı soruya geri dön
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
    if (currentQuestion < selectedPlanet.questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setTime(20);
      setShowHint(false);
      setSelectedAnswer(null);
      setShowAnswerFeedback(false);
      setCanAnswer(true);
    } else {
      // Gezegen tamamlandı - yıldız hesapla
      const stars = calculateStars({
        totalQuestions: selectedPlanet.questions.length,
        correctAnswers: selectedPlanet.questions.length - wrongAnswers,
        wrongAnswers: wrongAnswers
      });
      
      // Gezegen yıldızlarını güncelle
      const updatedPlanetStars = {
        ...planetStars,
        [selectedPlanet.name]: stars
      };
      setPlanetStars(updatedPlanetStars);
      
      // Gezegen tamamlandı
      const newCompletedPlanets = [...completedPlanets, selectedPlanet.key];
      setCompletedPlanets(newCompletedPlanets);
      
      // İlerlemeyi kaydet (sadece daha önce tamamlanmamışsa)
      if (route.params?.user?.id && !completedPlanets.includes(selectedPlanet.key)) {
        try {
          const gameData = {
            completedPlanets: newCompletedPlanets,
            totalScore: score + planetScore,
            planetScores: {
              ...updatedPlanetStars,
              [selectedPlanet.name]: {
                totalQuestions: selectedPlanet.questions.length,
                correctAnswers: selectedPlanet.questions.length - wrongAnswers,
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
      
      // Gezegenleri güncelle - bir sonraki gezegeni aç
      const updatedPlanets = planets.map((planet, index) => {
        const planetIndex = planets.findIndex(p => p.key === selectedPlanet.key);
        const nextIndex = (planetIndex + 1) % planets.length;
        
        return {
          ...planet,
          unlocked: planet.key === 'merkur' || 
                   newCompletedPlanets.includes(planet.key) || 
                   (index === nextIndex && newCompletedPlanets.includes(selectedPlanet.key))
        };
      });
      
      setPlanets(updatedPlanets);
      
      // Yıldız gösterimi ile gezegen tamamlandı mesajı
      const starEmojis = '⭐'.repeat(stars);
      const starText = stars === 3 ? 'Mükemmel!' : stars === 2 ? 'İyi!' : 'Geçer!';
      
      Alert.alert(
        `🎉 KOSMİK BAŞARI! 🎉`, 
        `${selectedPlanet.name} gezegenini tamamladın!\n\n${starEmojis} ${starText}\n\nGezegenin sırlarını çözdün ve bir sonraki kapıyı açtın.`
      );
      
      setCurrentView('planets');
      setSelectedPlanet(null);
      
      // Tüm gezegenler tamamlandıysa sıralı mesajlar göster
      if (newCompletedPlanets.length === planets.length) {
        setTimeout(() => {
          Alert.alert(
            '🎉 KOSMİK BAŞARI! 🎉', 
            'Tüm gezegenlerin sırlarını çözdün!\n\nGezegenler artık seninle konuşuyor...',
            [
              {
                text: 'Devam Et',
                onPress: () => {
                  setTimeout(() => {
                    Alert.alert(
                      'Koridora Dönüyorsun',
                      'Gezegenler evreninden çıkıyorsun...\n\nBir sonraki kapıyı bekliyor.',
                      [
                        {
                          text: 'Tamam',
                          onPress: () => navigation.navigate('Corridor', { user: route.params?.user, planetsCompleted: true })
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

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const counterRotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const getPlanetPosition = (index: number) => {
    const angle = (index * 36) * (Math.PI / 180);
    const radius = 140;
    return {
      left: width / 2 + radius * Math.cos(angle) - 40,
      top: height / 2 + radius * Math.sin(angle) - 40,
    };
  };

  const getOptionStyle = (idx: number) => {
    if (!showAnswerFeedback) return styles.option;
    
    if (idx === selectedPlanet.questions[currentQuestion].answer) {
      return [styles.option, styles.correctAnswer];
    } else if (idx === selectedAnswer) {
      return [styles.option, styles.wrongAnswer];
    }
    return styles.option;
  };

  if (currentView === 'quiz') {
    const currentQ = selectedPlanet.questions[currentQuestion];
    
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.status}>Toplam Puan: {score}   Can: {lives}   Süre: {time}s</Text>
        <Text style={styles.planetScore}>Bu Gezegen Puanı: {planetScore}</Text>
        <Text style={styles.title}>{selectedPlanet.name} Sınavı</Text>
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
      </SafeAreaView>
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

      {/* Gezegenler etrafında dönme animasyonu */}
      <Animated.View
        style={[
          styles.planetsContainer,
          {
            transform: [{ rotate: rotateInterpolate }],
          },
        ]}
      >
        {planets.map((planet, index) => {
          const position = getPlanetPosition(index);
          const isCompleted = completedPlanets.includes(planet.key);
          return (
            <Animated.View
              key={planet.key}
              style={[
                styles.planetWrapper,
                {
                  left: position.left,
                  top: position.top,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.planet,
                  { backgroundColor: planet.color },
                  !planet.unlocked && styles.lockedPlanet,
                  isCompleted && styles.completedPlanet,
                ]}
                onPress={() => handlePlanetPress(planet)}
                disabled={!planet.unlocked}
              >
                <Animated.View
                  style={[
                    styles.planetTextContainer,
                    {
                      transform: [{ rotate: counterRotateInterpolate }],
                    },
                  ]}
                >
                  <Image source={planet.image} style={styles.planetImage} />
                  {!planet.unlocked && <Text style={styles.lockText}>🔒</Text>}
                  {planet.unlocked && !isCompleted && <Text style={styles.unlockText}>✨</Text>}
                  {isCompleted && <Text style={styles.completedText}>✅</Text>}
                </Animated.View>
              </TouchableOpacity>
              
              {/* Gezegen adı - dairenin altında */}
              <Text style={styles.planetNameText}>{planet.name}</Text>
              
              
              
              {/* Işıklı yol */}
              <View style={[styles.lightPath, { backgroundColor: planet.color }]} />
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
        <Text style={styles.kozmikTitle}>GEZEGENLER EVRENİ</Text>
        <Text style={styles.kozmikMessage}>Her gezegen bir sırrı saklar, her sırrı çözdüğünde bir kapı açılır</Text>
      </Animated.View>

      {/* İlerleme çubuğu */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(completedPlanets.length / planets.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {completedPlanets.length}/{planets.length} Gezegen Tamamlandı
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
          <Text style={styles.statValue}>{completedPlanets.length}</Text>
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
  planetsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  planetWrapper: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  planet: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  lockedPlanet: {
    opacity: 0.5,
    borderColor: '#333',
  },
  completedPlanet: {
    borderColor: '#00FF00',
    borderWidth: 3,
  },
  planetText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  planetSymbol: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  planetTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  lockText: {
    fontSize: 16,
    marginTop: 2,
  },
  unlockText: {
    fontSize: 16,
    marginTop: 2,
  },
  completedText: {
    fontSize: 16,
    marginTop: 2,
  },
  lightPath: {
    position: 'absolute',
    width: 2,
    height: 60,
    opacity: 0.3,
    top: -30,
    left: 29,
  },
  messageContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
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
  status: { 
    color: '#fff', 
    fontSize: 18, 
    marginBottom: 8, 
    textAlign: 'center' 
  },
  planetScore: { 
    color: '#FFD700', 
    fontSize: 16, 
    marginBottom: 16, 
    textAlign: 'center',
    fontWeight: 'bold'
  },
  title: { 
    color: '#FFD700', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    textAlign: 'center' 
  },
  difficultyLabel: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
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
    marginTop: 20,
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
  planetImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 40,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  planetNameText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    position: 'absolute',
    bottom: -25,
    left: 0,
    right: 0,
  },

}); 