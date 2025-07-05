import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { saveGameProgress, getGameProgress } from '../firebase/firestoreService';
import { checkAndUpdateBadges, calculateStars } from '../services/badgeService';

const { width, height } = Dimensions.get('window');

const houses = [
  { number: 1, name: '1. Ev', description: 'Kişilik ve Benlik', color: '#FF6B6B' },
  { number: 2, name: '2. Ev', description: 'Değerler ve Para', color: '#4ECDC4' },
  { number: 3, name: '3. Ev', description: 'İletişim ve Öğrenme', color: '#45B7D1' },
  { number: 4, name: '4. Ev', description: 'Aile ve Ev', color: '#96CEB4' },
  { number: 5, name: '5. Ev', description: 'Aşk ve Yaratıcılık', color: '#FFEAA7' },
  { number: 6, name: '6. Ev', description: 'İş ve Sağlık', color: '#DDA0DD' },
  { number: 7, name: '7. Ev', description: 'İlişkiler ve Ortaklık', color: '#FFB347' },
  { number: 8, name: '8. Ev', description: 'Dönüşüm ve Gizem', color: '#87CEEB' },
  { number: 9, name: '9. Ev', description: 'Felsefe ve Seyahat', color: '#98FB98' },
  { number: 10, name: '10. Ev', description: 'Kariyer ve Başarı', color: '#F0E68C' },
  { number: 11, name: '11. Ev', description: 'Arkadaşlar ve Umutlar', color: '#FF69B4' },
  { number: 12, name: '12. Ev', description: 'Spiritüellik ve Gizli Düşmanlar', color: '#9370DB' }
];

const houseQuestions = {
  1: [
    {
      difficulty: 'Kolay',
      question: '1. ev doğum haritasında neyi temsil eder?',
      options: ['İkili ilişkiler', 'Kişisel imaj ve dış görünüş', 'Para kazanma', 'Aile geçmişi'],
      answer: 1,
      hint: 'Seni dışarıdan nasıl gördükleriyle ilgili.'
    },
    {
      difficulty: 'Orta',
      question: '1. evin başlangıcındaki burca ne ad verilir?',
      options: ['MC', 'IC', 'Yükselen', 'Ay düğümü'],
      answer: 2,
      hint: 'Doğduğun anda doğu ufkunda yükselen burçtur.'
    },
    {
      difficulty: 'Zor',
      question: '1. evde Mars varsa kişi genellikle nasıldır?',
      options: ['Uysal ve çekingen', 'Pasif ve sabırlı', 'Girişken, enerjik ve hızlı', 'Duygusal ve içe dönük'],
      answer: 2,
      hint: 'Mars seni ateşli ve rekabetçi yapar.'
    }
  ],
  2: [
    {
      difficulty: 'Kolay',
      question: '2. ev neyle ilgilidir?',
      options: ['Seyahatler', 'Maddi kaynaklar ve özgüven', 'Aile ilişkileri', 'Rüyalar'],
      answer: 1,
      hint: 'Hem cüzdanın hem de iç değerlerin burada.'
    },
    {
      difficulty: 'Orta',
      question: '2. evde Venüs yerleşimi ne gösterebilir?',
      options: ['Aşkta güvensizlik', 'Sanatsal yolla para kazanma', 'Agresif kariyer tutkusu', 'Rüyalarla ilgili yetenek'],
      answer: 1,
      hint: 'Hem paraya hem estetiğe düşkünlük gösterebilir.'
    },
    {
      difficulty: 'Zor',
      question: '2. evde Satürn varsa kişi nasıl etkilenebilir?',
      options: ['Kolay para kazanır', 'Cömert olur', 'Parayla ilgili kısıtlamalar yaşar', 'Maddi konularda dikkatsizdir'],
      answer: 2,
      hint: 'Kazanmak için çok çalışmak gerekebilir.'
    }
  ],
  3: [
    {
      difficulty: 'Kolay',
      question: '3. ev neyi temsil eder?',
      options: ['Aile kökleri', 'Meslek', 'Kardeşler, kısa yolculuklar ve iletişim', 'Ruhsal gelişim'],
      answer: 2,
      hint: 'Yakın çevre ve konuşma tarzın burada.'
    },
    {
      difficulty: 'Orta',
      question: '3. evde Merkür varsa bu kişi nasıl olabilir?',
      options: ['İçine kapanık', 'Güçlü zihinsel ifade yeteneği olan', 'Aşırı duygusal', 'Disiplinli ama sessiz'],
      answer: 1,
      hint: 'Konuşkan, meraklı ve zeki biri olur.'
    },
    {
      difficulty: 'Zor',
      question: '3. evde Neptün yerleşimi ne gösterebilir?',
      options: ['Zihinsel açıklık', 'Net iletişim', 'Hayalci düşünme, kafa karışıklığı', 'Matematik zekâsı'],
      answer: 2,
      hint: 'Hayal gücü iletişimi bulanıklaştırabilir.'
    }
  ],
  4: [
    {
      difficulty: 'Kolay',
      question: '4. ev hangi temayı anlatır?',
      options: ['Evlilik', 'Eğitim', 'Aile, ev ve kökler', 'Para'],
      answer: 2,
      hint: 'Nereden geldiğinle ilgilidir.'
    },
    {
      difficulty: 'Orta',
      question: '4. ev haritanın hangi yönüdür?',
      options: ['Tepe noktası', 'Güney noktası', 'Doğu noktası', 'Batı noktası'],
      answer: 1,
      hint: 'Ruhunun derinliklerini gösterir.'
    },
    {
      difficulty: 'Zor',
      question: '4. evde Ay varsa bu kişi nasıldır?',
      options: ['Ailesinden uzaklaşmış', 'Aileyle duygusal bağları kuvvetli', 'Bağımsız', 'İlişki odaklı'],
      answer: 1,
      hint: 'Evde güven arar.'
    }
  ],
  5: [
    {
      difficulty: 'Kolay',
      question: '5. ev hangi konuları temsil eder?',
      options: ['İş ve kariyer', 'Aile ilişkileri', 'Aşk, yaratıcılık ve çocuklar', 'Ruhsal karma'],
      answer: 2,
      hint: 'Hayattan keyif alma ve kendini ifade etme evi.'
    },
    {
      difficulty: 'Orta',
      question: '5. evde Venüs varsa kişi nasıl etkilenir?',
      options: ['Aşkı zorlukla yaşar', 'Yaratıcılıkta geri planda kalır', 'Aşk hayatında romantik ve estetik olur', 'Çocuklara karşı ilgisiz olur'],
      answer: 2,
      hint: 'Kalpten sevgiyle yaratır.'
    },
    {
      difficulty: 'Zor',
      question: '5. evde Uranüs varsa aşk nasıl yaşanır?',
      options: ['Sıradan ve bağlı', 'Karmakarışık', 'Ani, sıra dışı ve özgürlük arayan', 'Tutkulu ama geleneksel'],
      answer: 2,
      hint: 'Bağlanmadan sevebilir.'
    }
  ],
  6: [
    {
      difficulty: 'Kolay',
      question: '6. ev genellikle neyle ilişkilidir?',
      options: ['Kariyer ve başarı', 'Günlük rutinler ve sağlık', 'Ailevi geçmiş', 'Maddi yatırımlar'],
      answer: 1,
      hint: 'İş yerindeki tavır ve bedensel düzenin burada.'
    },
    {
      difficulty: 'Orta',
      question: '6. evde Satürn varsa kişi nasıl etkilenebilir?',
      options: ['Sorumluluktan kaçan', 'Sağlık konusunda dikkatsiz', 'Disiplinli ve detaycı', 'Aşırı duygusal'],
      answer: 2,
      hint: 'Çalışma hayatında ciddi ve titizdir.'
    },
    {
      difficulty: 'Zor',
      question: '6. evde Neptün varsa ne olabilir?',
      options: ['Net ve gerçekçi hedefler', 'Belirsizlik, sağlıksal duyarsızlık', 'Fazla enerji', 'Aile baskısı'],
      answer: 1,
      hint: 'Günlük hayatta kaos yaşanabilir.'
    }
  ],
  7: [
    {
      difficulty: 'Kolay',
      question: '7. ev hangi konuyu temsil eder?',
      options: ['Kariyer', 'Bilinçaltı', 'İkili ilişkiler ve evlilik', 'Sağlık'],
      answer: 2,
      hint: 'Aynaya baktığında gördüğün kişi.'
    },
    {
      difficulty: 'Orta',
      question: '7. evde Mars varsa kişi ilişkilerde nasıl olur?',
      options: ['Sakin ve sabırlı', 'Tartışmacı, tutkulu', 'İlgisiz', 'Aşırı fedakâr'],
      answer: 1,
      hint: 'Partner seçiminde enerji arar.'
    },
    {
      difficulty: 'Zor',
      question: '7. ev Akrep burcuysa evlilik nasıl olabilir?',
      options: ['Hafif ve yüzeysel', 'Güçlü bağlarla, kıskançlıkla dolu', 'Maddi odaklı', 'Uzak mesafeli'],
      answer: 1,
      hint: 'Ya hep ya hiç der.'
    }
  ],
  8: [
    {
      difficulty: 'Kolay',
      question: '8. ev hangi temalarla ilgilidir?',
      options: ['Gelecek planları', 'Kardeş ilişkileri', 'Ölüm, dönüşüm ve ortak kaynaklar', 'Eğitim'],
      answer: 2,
      hint: 'Gizli kalan her şey burada.'
    },
    {
      difficulty: 'Orta',
      question: '8. evde Plüton varsa kişi nasıl etkilenebilir?',
      options: ['Duygusal olarak yüzeysel', 'Güçlü dönüşüm deneyimleri', 'Mantıksal odaklı', 'Kaçamak ilişkiler'],
      answer: 1,
      hint: 'Küllerinden doğma potansiyeli taşır.'
    },
    {
      difficulty: 'Zor',
      question: '8. evde Venüs varsa ne olabilir?',
      options: ['Para kayıpları', 'İlişkilerde yüzeysellik', 'Yoğun duygusal bağ, maddi ortaklık', 'Soğukluk'],
      answer: 2,
      hint: 'Hem aşk hem para derinleşir.'
    }
  ],
  9: [
    {
      difficulty: 'Kolay',
      question: '9. ev hangi alanları temsil eder?',
      options: ['Günlük rutin', 'Yüksek öğrenim, inançlar ve yurtdışı', 'Sağlık', 'Ev hayatı'],
      answer: 1,
      hint: 'Ufkun genişlediği alan.'
    },
    {
      difficulty: 'Orta',
      question: '9. evde Jüpiter varsa kişi nasıl etkilenebilir?',
      options: ['Dar bakışlı', 'Felsefi, iyimser ve şanslı', 'Sessiz ve geri planda', 'Duygusal olarak çalkantılı'],
      answer: 1,
      hint: 'İnançla genişler.'
    },
    {
      difficulty: 'Zor',
      question: '9. ev Yay burcundaysa kişi neye ilgi duyar?',
      options: ['Duygular', 'Para', 'Felsefe, seyahat ve eğitim', 'Günlük iş'],
      answer: 2,
      hint: 'Ruhunu gezdirir.'
    }
  ],
  10: [
    {
      difficulty: 'Kolay',
      question: '10. ev neyi temsil eder?',
      options: ['Gizli korkular', 'Kariyer ve toplumdaki yer', 'Aile geçmişi', 'Romantik ilişkiler'],
      answer: 1,
      hint: '"Ne olacağım ben?" sorusunun cevabı.'
    },
    {
      difficulty: 'Orta',
      question: '10. evde Güneş varsa kişi nasıl etkilenebilir?',
      options: ['Gizlenmeyi sever', 'Kendiyle ilgilenmez', 'Kariyerde öne çıkmak ister', 'Sorumluluktan kaçar'],
      answer: 2,
      hint: 'Statüde dikkat çekmek ister.'
    },
    {
      difficulty: 'Zor',
      question: '10. evde Satürn varsa bu neyi anlatır?',
      options: ['Kariyerde kolay başarı', 'Disiplinli ve geç gelen başarı', 'Kaotik bir meslek yaşamı', 'Sanat tutkusu'],
      answer: 1,
      hint: 'Zamanla yükselir.'
    }
  ],
  11: [
    {
      difficulty: 'Kolay',
      question: '11. ev neyle ilişkilidir?',
      options: ['Para', 'Geçmiş', 'Arkadaşlıklar ve hedefler', 'Aile içi kavgalar'],
      answer: 2,
      hint: 'Kalabalıktaki yerini belirler.'
    },
    {
      difficulty: 'Orta',
      question: '11. evde Uranüs varsa ne olur?',
      options: ['Geleneksel sosyal ilişkiler', 'Özgün dostluklar, ani gruplar', 'Aile baskısı', 'Tek başına olma arzusu'],
      answer: 1,
      hint: 'Sıra dışı arkadaşlar hayatına girer.'
    },
    {
      difficulty: 'Zor',
      question: '11. evde Ay varsa kişi nasıl etkilenebilir?',
      options: ['Arkadaşlıkta duygusal bağ arar', 'Mantıksal mesafeyi korur', 'Yalnızlığı sever', 'Güçlü lider olur'],
      answer: 0,
      hint: 'Duygularla bağlı kalabalıklar.'
    }
  ],
  12: [
    {
      difficulty: 'Kolay',
      question: '12. ev hangi temaları anlatır?',
      options: ['Ailevi sorumluluk', 'Bilinçaltı, izolasyon, ruhsal dünya', 'Eğitim ve beceri', 'Günlük işler'],
      answer: 1,
      hint: 'Görünmeyeni görme evi.'
    },
    {
      difficulty: 'Orta',
      question: '12. evde Neptün varsa kişi nasıl etkilenir?',
      options: ['Mantıklı ve gerçekçidir', 'Sezgileri kuvvetli, ama bazen dağınık', 'Sosyal ve dışa dönük', 'Maddi odaklı'],
      answer: 1,
      hint: 'Rüyalarla yaşar, kaçış eğilimi gösterebilir.'
    },
    {
      difficulty: 'Zor',
      question: '12. evde Güneş varsa ne olur?',
      options: ['Dışa dönük bir ego', 'Ego göz önündedir', 'Kendini ifade etmekte zorlanabilir', 'Maddiyat ön planda'],
      answer: 2,
      hint: 'Işık karanlıkta kalır.'
    }
  ]
};

export default function EvlerRoomScreen({ navigation, route }: any) {
  const { user } = route.params || {};
  const [currentView, setCurrentView] = useState<'intro' | 'houses' | 'quiz'>('intro');
  const [selectedHouse, setSelectedHouse] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [houseScore, setHouseScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(20);
  const [showHint, setShowHint] = useState(false);
  const [completedHouses, setCompletedHouses] = useState<number[]>([]);
  const [unlockedHouses, setUnlockedHouses] = useState<number[]>([1]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [canAnswer, setCanAnswer] = useState(true);
  const [showCanAlert, setShowCanAlert] = useState(false);
  
  // Yıldızlı sistem için yeni state'ler
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [houseStars, setHouseStars] = useState<{[key: number]: number}>({});
  const [newBadges, setNewBadges] = useState<any[]>([]);
  
  // Animasyon değerleri
  const darkOverlayAnim = useRef(new Animated.Value(0)).current;
  const wheelAnim = useRef(new Animated.Value(0)).current;
  const houseGlowAnim = useRef(new Animated.Value(0)).current;
  const firstHouseGlowAnim = useRef(new Animated.Value(0)).current;
  const housesRotateAnim = useRef(new Animated.Value(0)).current;
  const houseRotateAnim = useRef(new Animated.Value(0)).current;
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
      if (user?.id) {
        const progress = await getGameProgress(user.id);
        if (progress.completedHouses) {
          setCompletedHouses(progress.completedHouses);
        }
        if (progress.totalScore) {
          setScore(progress.totalScore);
        }
        // Ev yıldızlarını yükle
        if (progress.houseScores) {
          const stars: {[key: number]: number} = {};
          Object.entries(progress.houseScores).forEach(([house, data]: [string, any]) => {
            if (data.stars) {
              stars[parseInt(house)] = data.stars;
            }
          });
          setHouseStars(stars);
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
    // Evler yavaşça dönerek belirme
    Animated.timing(housesRotateAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      // Dönme tamamlandı, main view'a geç
      setCurrentView('houses');
    });
  };

  const handleHousePress = (houseNumber: number) => {
    setSelectedHouse(houseNumber);
    setCurrentView('quiz');
    setCurrentQuestion(0);
    setHouseScore(0);
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
    
    if (idx === houseQuestions[selectedHouse as keyof typeof houseQuestions][currentQuestion].answer) {
      setScore(s => s + 100);
      setHouseScore(hs => hs + 100);
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
    if (currentQuestion < houseQuestions[selectedHouse as keyof typeof houseQuestions].length - 1) {
      setCurrentQuestion(c => c + 1);
      setTime(20);
      setShowHint(false);
      setSelectedAnswer(null);
      setShowAnswerFeedback(false);
      setCanAnswer(true);
    } else {
      // Ev tamamlandı - yıldız hesapla
      const stars = calculateStars({
        totalQuestions: houseQuestions[selectedHouse as keyof typeof houseQuestions].length,
        correctAnswers: houseQuestions[selectedHouse as keyof typeof houseQuestions].length - wrongAnswers,
        wrongAnswers: wrongAnswers
      });
      
      // Ev yıldızlarını güncelle
      const updatedHouseStars = {
        ...houseStars,
        [selectedHouse]: stars
      };
      setHouseStars(updatedHouseStars);
      
      // Ev tamamlandı
      const newCompletedHouses = [...completedHouses, selectedHouse];
      setCompletedHouses(newCompletedHouses);
      
      // İlerlemeyi kaydet (sadece daha önce tamamlanmamışsa)
      if (user?.id && !completedHouses.includes(selectedHouse)) {
        try {
          const gameData = {
            completedHouses: newCompletedHouses,
            totalScore: score + houseScore,
            houseScores: {
              ...updatedHouseStars,
              [selectedHouse]: {
                totalQuestions: houseQuestions[selectedHouse as keyof typeof houseQuestions].length,
                correctAnswers: houseQuestions[selectedHouse as keyof typeof houseQuestions].length - wrongAnswers,
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
      
      // Yıldız gösterimi ile ev tamamlandı mesajı
      const starEmojis = '⭐'.repeat(stars);
      const starText = stars === 3 ? 'Mükemmel!' : stars === 2 ? 'İyi!' : 'Geçer!';
      
      Alert.alert(
        `🎉 EV BAŞARISI! 🎉`, 
        `${selectedHouse}. Evi tamamladın!\n\n${starEmojis} ${starText}\n\nEvin sırlarını çözdün ve yeni kapılar açtın.`
      );
      
      setCurrentView('houses');
      setSelectedHouse(0);
      
      // Tüm evler tamamlandıysa sıralı mesajlar göster
      if (newCompletedHouses.length === 12) {
        setTimeout(() => {
          Alert.alert(
            '🎉 EV USTASI! 🎉', 
            'Tüm evlerin sırlarını çözdün!\n\nEvler artık seninle konuşuyor...',
            [
              {
                text: 'Devam Et',
                onPress: () => {
                  setTimeout(() => {
                    Alert.alert(
                      'Koridora Dönüyorsun',
                      'Evler evreninden çıkıyorsun...\n\nBir sonraki kapıyı bekliyor.',
                      [
                        {
                          text: 'Tamam',
                          onPress: () => navigation.navigate('Corridor', { user, housesCompleted: true })
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
    
    if (idx === houseQuestions[selectedHouse as keyof typeof houseQuestions][currentQuestion].answer) {
      return [styles.option, styles.correctAnswer];
    } else if (idx === selectedAnswer) {
      return [styles.option, styles.wrongAnswer];
    }
    return styles.option;
  };

  const getHousePosition = (index: number) => {
    // Evleri nebula animasyonunun etrafında daire şeklinde sırala
    const angle = (index * 30) * (Math.PI / 180); // 12 ev için 30 derece aralıklarla
    const radius = 140; // Nebula animasyonunun etrafında, daha yakın
    return {
      left: width / 2 + radius * Math.cos(angle) - 45,
      top: (height / 2) - 20 + radius * Math.sin(angle) - 30, // 50px yukarı
    };
  };

  const getGlowOpacity = (houseNumber: number) => {
    if (houseNumber === 1) {
      return firstHouseGlowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1],
      });
    }
    return houseGlowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });
  };

  const getHousesRotateInterpolate = () => {
    return housesRotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  };

  if (currentView === 'intro') {
    return (
      <View style={styles.container}>
        <LottieView source={require('../../assets/lottie/nebula.json')} autoPlay loop style={styles.bgAnim} resizeMode="cover" />
        <Text style={styles.title}>Evler Odası</Text>
        <Text style={styles.subtitle}>Gökyüzünün 12 parçası</Text>
        
        {/* Evler yavaşça dönerek belirme */}
        <Animated.View
          style={[
            styles.housesContainer,
            {
              transform: [{ rotate: getHousesRotateInterpolate() }],
              opacity: housesRotateAnim,
            },
          ]}
        >
          {houses.map((house, index) => {
            const position = getHousePosition(index);
            return (
              <Animated.View
                key={house.number}
                style={[
                  styles.houseContainer,
                  {
                    left: position.left,
                    top: position.top,
                  },
                ]}
              >
                <View style={[styles.houseButton, { borderColor: house.color }]}>
                  <Text style={[styles.houseNumber, { color: house.color }]}>
                    {house.number}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </Animated.View>
      </View>
    );
  }

  if (currentView === 'houses') {
    return (
      <View style={styles.container}>
        <LottieView source={require('../../assets/lottie/nebula.json')} autoPlay loop style={styles.bgAnim} resizeMode="cover" />
        
        {/* Başlık */}
        <Text style={styles.title}>Evler Odası</Text>
        <Text style={styles.subtitle}>Gökyüzünün 12 parçası</Text>
        
        {/* Evler - nebula animasyonunun etrafında dönen */}
        <Animated.View
          style={[
            styles.housesContainer,
            {
              transform: [{ rotate: getHousesRotateInterpolate() }],
            },
          ]}
        >
          {houses.map((house, index) => {
            const position = getHousePosition(index);
            const isUnlocked = unlockedHouses.includes(house.number);
            const isCompleted = completedHouses.includes(house.number);
            
            return (
              <Animated.View
                key={house.number}
                style={[
                  styles.houseContainer,
                  {
                    left: position.left+20,
                    top: position.top+20,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.houseButton,
                    { borderColor: house.color },
                    isUnlocked && styles.unlockedHouse,
                    isCompleted && styles.completedHouse,
                  ]}
                  onPress={() => handleHousePress(house.number)}
                  disabled={!isUnlocked}
                >
                  <Animated.View
                    style={[
                      styles.houseGlow,
                      {
                        backgroundColor: house.color,
                        opacity: getGlowOpacity(house.number),
                      },
                    ]}
                  />
                  <Text style={[styles.houseNumber, { color: house.color }]}>
                    {house.number}
                  </Text>
                  {isCompleted && <Text style={styles.completedText}>✓</Text>}
                  {!isUnlocked && <Text style={styles.lockText}>🔒</Text>}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Kozmik istatistikler - PlanetRoom tasarımı */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>KOZMİK PUAN</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>AÇILAN KAPILAR</Text>
            <Text style={styles.statValue}>{completedHouses.length}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (currentView === 'quiz') {
    const currentQ = houseQuestions[selectedHouse as keyof typeof houseQuestions][currentQuestion];
    const currentHouse = houses.find(h => h.number === selectedHouse);
    
    return (
      <View style={styles.container}>
        <Text style={styles.status}>Toplam Puan: {score}   Can: {lives}   Süre: {time}s</Text>
        <Text style={styles.houseScore}>Bu Ev Puanı: {houseScore}</Text>
        <Text style={styles.title}>{currentHouse?.name}</Text>
        <Text style={styles.subtitle}>{currentHouse?.description}</Text>
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

  return null;
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
  houseContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
  },
  houseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  houseGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
  },
  houseNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1,
  },
  unlockedHouse: {
    backgroundColor: '#2A2A3E',
  },
  completedHouse: {
    backgroundColor: '#3A3A4E',
  },
  completedText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
    zIndex: 1,
  },
  lockText: {
    fontSize: 16,
    marginTop: 2,
    zIndex: 1,
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
    color: '#fff', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    textAlign: 'center' 
  },
  subtitle: { 
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
  houseScore: { 
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
  housesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 