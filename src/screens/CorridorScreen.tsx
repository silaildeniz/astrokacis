import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, ScrollView, Dimensions, Alert, SafeAreaView, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import { saveGameProgress, getGameProgress } from '../firebase/firestoreService';
import { getUserBadges } from '../services/badgeService';

export default function CorridorScreen({ navigation, route }: any) {
  const { user, planetsCompleted, zodiacsCompleted, elementsCompleted, housesCompleted, aspectsCompleted } = route.params;
  
  // Test modu state'i
  const [testMode, setTestMode] = useState(false);
  
  // Rozet sistemi state'leri
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [userBadges, setUserBadges] = useState<any>({ badges: [], totalBadges: 0, unlockedBadges: 0 });
  
  // Odaların durumunu dinamik olarak belirle
  const getRooms = () => [
    { 
      key: '1', 
      name: 'Gezegenler Odası', 
      description: '🪐 Göksel güçlerin sırlarını çöz ve kozmik enerjileri keşfet..',
      unlocked: testMode || true, 
      screen: 'PlanetRoom', 
      color: '#FF6B6B' 
    },
    { 
      key: '2', 
      name: 'Burçlar Odası', 
      description: '⭐ Zodyak çarkının 12 kapısından geç ve burçların gizemini çöz..',
      unlocked: testMode || planetsCompleted, 
      screen: 'ZodiacRoom', 
      color: '#4ECDC4' 
    },
    { 
      key: '3', 
      name: 'Elementler Odası', 
      description: '🔥 Doğanın 4 temel kuvvetini hisset ve elementlerin gücünü öğren..',
      unlocked: testMode || zodiacsCompleted, 
      screen: 'ElementRoom', 
      color: '#FF6B6B' 
    },
    { 
      key: '4', 
      name: 'Evler Odası', 
      description: '🏠 Hayatının 12 alanını keşfet ve astrolojik tekerleği çöz..',
      unlocked: testMode || elementsCompleted, 
      screen: 'EvlerRoom', 
      color: '#45B7D1' 
    },
    { 
      key: '5', 
      name: 'Final Odası', 
      description: '⚡ Kendi haritanla yüzleş ve gökyüzünün sana yazdığı kaderi oku..',
      unlocked: testMode || housesCompleted, 
      screen: 'Final', 
      color: '#DDA0DD' 
    },
    { 
      key: '6', 
      name: '🔮 Kader Odası', 
      description: '🔮 AI ile kaderinin sırlarını keşfet ve geleceğinin kapılarını arala..',
      unlocked: true, 
      screen: 'KaderRoom', 
      color: '#9B59B6' 
    },
  ];
  
  const rooms = getRooms();
  
  const [unlockedRooms, setUnlockedRooms] = useState(
    housesCompleted ? 6 : elementsCompleted ? 5 : zodiacsCompleted ? 4 : planetsCompleted ? 3 : 2
  );
  const [showKozmikMessage, setShowKozmikMessage] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showBurcMessage, setShowBurcMessage] = useState(false);
  const [showElementMessage, setShowElementMessage] = useState(false);
  const [showEvlerMessage, setShowEvlerMessage] = useState(false);

  const [showFinalMessage, setShowFinalMessage] = useState(false);
  
  // Animasyon değerleri
  const glowAnim = useRef(new Animated.Value(0)).current;
  const portalAnim = useRef(new Animated.Value(0)).current;
  const messageAnim = useRef(new Animated.Value(0)).current;
  const burcGlowAnim = useRef(new Animated.Value(0)).current;
  const elementGlowAnim = useRef(new Animated.Value(0)).current;
  const evlerGlowAnim = useRef(new Animated.Value(0)).current;

  const finalGlowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startPortalAnimation();
    
    // Rozetleri yükle
    if (user?.id) {
      loadUserBadges();
    }
    
    // Gezegenler tamamlandıysa Burçlar Odası'nı aç
    if (planetsCompleted) {
      setTimeout(() => {
        setShowBurcMessage(true);
        Animated.timing(burcGlowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }).start();
      }, 1000);
    }
    
    // Burçlar tamamlandıysa Elementler Odası'nı aç
    if (zodiacsCompleted) {
      setTimeout(() => {
        setShowElementMessage(true);
        Animated.timing(elementGlowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }).start();
      }, 2000);
    }
    
    // Elementler tamamlandıysa Evler Odası'nı aç
    if (elementsCompleted) {
      setTimeout(() => {
        setShowEvlerMessage(true);
        Animated.timing(evlerGlowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }).start();
      }, 3000);
    }
    
    // Evler tamamlandıysa Final Odası'nı aç
    if (aspectsCompleted) {
      setTimeout(() => {
        setShowFinalMessage(true);
        Animated.timing(finalGlowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }).start();
      }, 5000);
    }
  }, [planetsCompleted, zodiacsCompleted, elementsCompleted, housesCompleted]);

  const loadUserBadges = async () => {
    try {
      if (user?.id) {
        const badges = await getUserBadges(user.id);
        setUserBadges(badges);
      }
    } catch (error) {
      console.error('Rozetler yüklenemedi:', error);
    }
  };

  const startPortalAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const handleRoomPress = (room: any, index: number) => {
    if (room.unlocked) {
      if (room.screen === 'PlanetRoom') {
        // Gezegenler odası için özel mesaj göster
        setSelectedRoom(room);
        setShowKozmikMessage(true);
        Animated.timing(messageAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start();
      } else if (room.screen === 'ZodiacRoom') {
        // Burçlar odası için özel mesaj göster
        setSelectedRoom(room);
        setShowKozmikMessage(true);
        Animated.timing(messageAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start();
      } else if (room.screen === 'ElementRoom') {
        // Elementler odası için özel mesaj göster
        setSelectedRoom(room);
        setShowKozmikMessage(true);
        Animated.timing(messageAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start();
      } else if (room.screen === 'EvlerRoom') {
        // Evler odası için özel mesaj göster
        setSelectedRoom(room);
        setShowKozmikMessage(true);
        Animated.timing(messageAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start();
      } else if (room.screen === 'Final') {
        // Final odası için özel mesaj göster
        setSelectedRoom(room);
        setShowKozmikMessage(true);
        Animated.timing(messageAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start();
      } else if (room.screen === 'KaderRoom') {
        // Kader odası için direkt geçiş (her zaman açık)
        startPortalTransition(room);
      } else {
        // Diğer odalar için direkt geçiş
        startPortalTransition(room);
      }
    }
  };

  const startPortalTransition = (room: any) => {
    // Önce siyah ekrana geç (1.5 saniye)
    Animated.timing(portalAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start(() => {
      // Siyah ekranda 0.5 saniye bekle
      setTimeout(() => {
        navigation.navigate(room.screen, { user });
        // Navigasyon sonrası animasyonu sıfırla
        setTimeout(() => {
          portalAnim.setValue(0);
        }, 100);
      }, 500);
    });
  };

  const handleKozmikMessageConfirm = () => {
    Animated.timing(messageAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowKozmikMessage(false);
      if (selectedRoom) {
        startPortalTransition(selectedRoom);
      }
    });
  };

  const getGlowOpacity = (index: number) => {
    return glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });
  };

  const getBurcGlowOpacity = () => {
    return burcGlowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
  };

  const getElementGlowOpacity = () => {
    return elementGlowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
  };

  const getEvlerGlowOpacity = () => {
    return evlerGlowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
  };



  const getFinalGlowOpacity = () => {
    return finalGlowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
  };

  if (showKozmikMessage) {
    const isPlanetRoom = selectedRoom?.screen === 'PlanetRoom';
    const isZodiacRoom = selectedRoom?.screen === 'ZodiacRoom';
    const isElementRoom = selectedRoom?.screen === 'ElementRoom';
    const isEvlerRoom = selectedRoom?.screen === 'EvlerRoom';

    const isFinalRoom = selectedRoom?.screen === 'Final';
    
    return (
      <View style={styles.container}>
        <LottieView source={require('../../assets/lottie/nebula.json')} autoPlay loop style={styles.bgAnim} />
        
        <Animated.View
          style={[
            styles.messageOverlay,
            {
              opacity: messageAnim,
            },
          ]}
        >
          <View style={styles.kozmikMessageContainer}>
            {isPlanetRoom ? (
              <>
                <Text style={styles.kozmikTitle}>KOZMİK DÜĞÜM</Text>
                <Text style={styles.kozmikMessage}>
                  BURADAN ÇIKMANIN TEK YOLU BİLGİ KAPILARINI AÇMAK
                </Text>
                <Text style={styles.kozmikSubMessage}>
                  İLK SINAVIN GEZEGENLER
                </Text>
                <Text style={styles.kozmikQuestion}>
                  BAKALIM ONLARI TANIYABİLECEK MİSİN ?
                </Text>
              </>
            ) : isZodiacRoom ? (
              <>
                <Text style={styles.kozmikTitle}>BURÇLAR EVRENİ</Text>
                <Text style={styles.kozmikMessage}>
                  ARTIK GEZEGENLERİ TANIYORSUN AMA ONLAR BURÇLAR ÜZERİNDEN KONUŞUR
                </Text>
                <Text style={styles.kozmikSubMessage}>
                  ZODYAK ÇARKI SENİ BEKLİYOR
                </Text>
                <Text style={styles.kozmikQuestion}>
                  BURÇLARIN SIRLARINA HAZIR MISIN ?
                </Text>
              </>
            ) : isElementRoom ? (
              <>
                <Text style={styles.kozmikTitle}>ELEMENTLER DÜNYASI</Text>
                <Text style={styles.kozmikMessage}>
                  DOĞANIN 4 TEMEL KUVVETİ SENİ BEKLİYOR
                </Text>
                <Text style={styles.kozmikSubMessage}>
                  ATEŞ, SU, TOPRAK, HAVA
                </Text>
                <Text style={styles.kozmikQuestion}>
                  ELEMENTLERİN GÜCÜNÜ HİSSEDEBİLİR MİSİN ?
                </Text>
              </>
            ) : isEvlerRoom ? (
              <>
                <Text style={styles.kozmikTitle}>EVLER EVRENİ</Text>
                <Text style={styles.kozmikMessage}>
                  GÖKYÜZÜ 12 PARÇAYA BÖLÜNDÜ HER BİRİ SENİN HAYATINDA BAŞKA BİR ALANI AYDINLATIYOR
                </Text>
                <Text style={styles.kozmikSubMessage}>
                  ASTROLOJİK TEKERLEK SENİ BEKLİYOR
                </Text>
                <Text style={styles.kozmikQuestion}>
                  HAYATININ 12 ALANINI KEŞFEDEBİLİR MİSİN ?
                </Text>
              </>
            ) : isFinalRoom ? (
              <>
                <Text style={styles.kozmikTitle}>FİNAL</Text>
                <Text style={styles.kozmikMessage}>
                  GÖKYÜZÜNÜN SANA YAZDIĞI HARİTAYLA KARŞILAŞMAYA HAZIR MISIN
                </Text>
                <Text style={styles.kozmikSubMessage}>
                  KENDİ HARİTANI OKUYAMIYORSAN HİÇBİR KAPI SANA AÇILMAZ
                </Text>
                <Text style={styles.kozmikQuestion}>
                  SON SINAVIN BAŞLIYOR ?
                </Text>
              </>
            ) : null}
            
            <TouchableOpacity 
              style={styles.enterButton}
              onPress={handleKozmikMessageConfirm}
            >
              <Text style={styles.enterButtonText}>GİR</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Kozmik arka plan animasyonu */}
      <LottieView source={require('../../assets/lottie/nebula.json')} autoPlay loop style={styles.bgAnim} resizeMode="cover" />
      
      {/* Portal overlay */}
      <Animated.View
        style={[
          styles.portalOverlay,
          {
            opacity: portalAnim,
          },
        ]}
      />

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Kozmik Koridor</Text>
        <Text style={styles.subtitle}>{user?.character} "{user?.name}"</Text>
        <Text style={styles.description}>Göksel bilgileri çözmek için odaları keşfet</Text>

        {/* Üst butonlar container */}
        <View style={styles.topButtonsContainer}>
          {/* Test Modu Butonu */}
          <TouchableOpacity 
            style={[styles.testModeButton, testMode && styles.testModeActive]} 
            onPress={() => setTestMode(!testMode)}
          >
            <Text style={styles.testModeText}>
              {testMode ? '🔓 Test Modu Açık' : '🔒 Test Modu'}
            </Text>
          </TouchableOpacity>

          {/* Rozetler Butonu */}
          <TouchableOpacity 
            style={styles.badgesButton} 
            onPress={() => setShowBadgesModal(true)}
          >
            <Text style={styles.badgesButtonText}>
              🏆 Rozetlerim ({userBadges.unlockedBadges}/{userBadges.totalBadges})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.roomsContainer}>
          {rooms.map((room, index) => (
            <Animated.View
              key={room.key}
              style={[
                styles.roomWrapper,
                {
                  shadowOpacity: room.screen === 'ZodiacRoom' && planetsCompleted 
                    ? getBurcGlowOpacity() 
                    : room.screen === 'ElementRoom' && zodiacsCompleted
                    ? getElementGlowOpacity()
                    : room.screen === 'EvlerRoom' && elementsCompleted
                    ? getEvlerGlowOpacity()

                    : room.screen === 'Final' && aspectsCompleted
                    ? getFinalGlowOpacity()
                    : getGlowOpacity(index),
                  shadowColor: room.screen === 'ZodiacRoom' && planetsCompleted 
                    ? '#4ECDC4' 
                    : room.screen === 'ElementRoom' && zodiacsCompleted
                    ? '#FF6B6B'
                    : room.screen === 'EvlerRoom' && elementsCompleted
                    ? '#45B7D1'

                    : room.screen === 'Final' && aspectsCompleted
                    ? '#DDA0DD'
                    : room.color,
                  shadowRadius: (room.screen === 'ZodiacRoom' && planetsCompleted) || 
                               (room.screen === 'ElementRoom' && zodiacsCompleted) ||
                               (room.screen === 'EvlerRoom' && elementsCompleted) ||

                               (room.screen === 'Final' && aspectsCompleted) ? 30 : 20,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.room,
                  !room.unlocked && styles.locked,
                  { borderColor: room.color },
                  room.screen === 'ZodiacRoom' && planetsCompleted && styles.burcRoom,
                  room.screen === 'ElementRoom' && zodiacsCompleted && styles.elementRoom,
                  room.screen === 'EvlerRoom' && elementsCompleted && styles.evlerRoom,
                  room.screen === 'Final' && aspectsCompleted && styles.finalRoom,
                  room.screen === 'KaderRoom' && styles.kaderRoom,
                ]}
                onPress={() => handleRoomPress(room, index)}
                disabled={!room.unlocked}
              >
                <View style={[styles.portalGlow, { backgroundColor: room.color }]} />
                <Text style={styles.roomText}>{room.name}</Text>
                <Text style={[
                  styles.roomDescription,
                  !room.unlocked && styles.lockedDescription
                ]}>
                  {room.description}
                </Text>
                {!room.unlocked && (
                  <View style={styles.lockContainer}>
                    <Text style={styles.lockText}>🔒</Text>
                    <Text style={styles.lockSubText}>Kilitli</Text>
                  </View>
                )}
                {room.unlocked && (
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>✨</Text>
                    <Text style={styles.statusSubText}>Açık</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          İlerleme: {unlockedRooms}/6 Oda
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(unlockedRooms / 6) * 100}%` }]} />
        </View>
      </View>

      {/* Rozetler Modal */}
      <Modal
        visible={showBadgesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBadgesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🏆 Rozetlerim</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowBadgesModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.badgesScrollView}>
              {userBadges.badges.length === 0 ? (
                <View style={styles.emptyBadgesContainer}>
                  <Text style={styles.emptyBadgesText}>🎯</Text>
                  <Text style={styles.emptyBadgesTitle}>Henüz rozet kazanmadın</Text>
                  <Text style={styles.emptyBadgesDescription}>
                    Odaları tamamlayarak rozetler kazanabilirsin!
                  </Text>
                </View>
              ) : (
                <View style={styles.badgesGrid}>
                  {userBadges.badges.map((badge: any, index: number) => (
                    <View key={badge.id || index} style={styles.badgeItem}>
                      <View style={[
                        styles.badgeIcon,
                        { backgroundColor: badge.unlocked ? badge.color : '#333' }
                      ]}>
                        <Text style={styles.badgeIconText}>{badge.icon}</Text>
                      </View>
                      <Text style={[
                        styles.badgeName,
                        !badge.unlocked && styles.lockedBadgeName
                      ]}>
                        {badge.name}
                      </Text>
                      <Text style={[
                        styles.badgeDescription,
                        !badge.unlocked && styles.lockedBadgeDescription
                      ]}>
                        {badge.description}
                      </Text>
                      {badge.unlocked && (
                        <Text style={styles.badgeUnlockedText}>✓ Kazanıldı</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0A0A0A',
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
  portalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 10,
  },
  messageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kozmikMessageContainer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 32,
    margin: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  kozmikTitle: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  kozmikMessage: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  kozmikSubMessage: {
    color: '#b0b0ff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  kozmikQuestion: {
    color: '#FFD700',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  enterButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  enterButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: { 
    color: '#FFD700', 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 20,
    marginBottom: 8,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: { 
    color: '#fff', 
    fontSize: 20, 
    textAlign: 'center', 
    marginBottom: 8 
  },
  description: { 
    color: '#b0b0ff', 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 32,
    fontStyle: 'italic'
  },
  roomsContainer: {
    paddingBottom: 20,
  },
  roomWrapper: {
    marginBottom: 20,
    elevation: 10,
  },
  room: { 
    backgroundColor: '#1A1A2E', 
    borderRadius: 16, 
    padding: 28, 
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  locked: { 
    opacity: 0.5,
    borderColor: '#333',
  },
  portalGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    borderRadius: 16,
  },
  roomText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1,
  },
  roomDescription: {
    color: '#b0b0ff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
    fontStyle: 'italic',
    lineHeight: 18,
    opacity: 0.9,
    textShadowColor: 'rgba(176, 176, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  lockContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  lockText: {
    fontSize: 24,
    marginBottom: 4,
  },
  lockSubText: { 
    color: '#b0b0ff', 
    fontSize: 12 
  },
  statusContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 24,
    marginBottom: 4,
  },
  statusSubText: { 
    color: '#4CAF50', 
    fontSize: 12,
    fontWeight: 'bold'
  },
  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  burcRoom: {
    borderColor: '#4ECDC4',
  },
  elementRoom: {
    borderColor: '#FF6B6B',
  },
  evlerRoom: {
    borderColor: '#45B7D1',
  },

  finalRoom: {
    borderColor: '#DDA0DD',
  },
  testModeButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  testModeActive: {
    backgroundColor: '#4CAF50',
  },
  testModeText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  badgesButton: {
    backgroundColor: '#9B59B6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  badgesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  kaderRoom: {
    borderColor: '#9B59B6',
  },
  lockedDescription: {
    opacity: 0.4,
    color: '#666',
  },
  // Modal stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF4444',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  badgesScrollView: {
    flex: 1,
    padding: 20,
  },
  emptyBadgesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyBadgesText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyBadgesTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyBadgesDescription: {
    color: '#b0b0ff',
    fontSize: 16,
    textAlign: 'center',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '48%',
    backgroundColor: '#23243A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeIconText: {
    fontSize: 24,
  },
  badgeName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  lockedBadgeName: {
    color: '#666',
  },
  badgeDescription: {
    color: '#b0b0ff',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  lockedBadgeDescription: {
    color: '#444',
  },
  badgeUnlockedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 