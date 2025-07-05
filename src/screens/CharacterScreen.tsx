import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const icons: any = {
  koc: require('../../assets/icons/koc.jpg'),
  boga: require('../../assets/icons/boga.jpg'),
  ikizler: require('../../assets/icons/ikizler.jpg'),
  yengec: require('../../assets/icons/yengec.jpg'),
  aslan: require('../../assets/icons/aslan.jpg'),
  basak: require('../../assets/icons/basak.jpg'),
  terazi: require('../../assets/icons/terazi.jpg'),
  akrep: require('../../assets/icons/akrep.jpg'),
  yay: require('../../assets/icons/yay.jpg'),
  oglak: require('../../assets/icons/oglak.jpg'),
  kova: require('../../assets/icons/kova.jpg'),
  balik: require('../../assets/icons/balik.jpg'),
};

const zodiacSigns = ['Koç', 'Boğa', 'İkizler', 'Yengec', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];

export default function CharacterScreen({ route, navigation }: any) {
  const { user } = route.params;
  const iconKey = user.sun_sign.toLowerCase();
  
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showZodiacMessage, setShowZodiacMessage] = useState(false);
  
  // Animasyon değerleri
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const zodiacScaleAnim = useRef(new Animated.Value(0)).current;
  const zodiacOpacityAnim = useRef(new Animated.Value(0)).current;
  const darkOverlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimationSequence();
  }, []);

  const startAnimationSequence = () => {
    // 1. Burç 3D olarak belirir ve büyür
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimationPhase(1);
      startZodiacCircleAnimation();
    });
  };

  const startZodiacCircleAnimation = () => {
    // 2. Zodyak çemberi parçalanmaya başlar
    Animated.timing(zodiacScaleAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setAnimationPhase(2);
      startDarknessAnimation();
    });
  };

  const startDarknessAnimation = () => {
    // 3. Ekran kararır
    Animated.timing(darkOverlayAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      setShowZodiacMessage(true);
      setTimeout(() => {
        navigation.navigate('Corridor', { user });
      }, 4000);
    });
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const zodiacPositions = zodiacSigns.map((_, index) => {
    const angle = (index * 30) * (Math.PI / 180);
    const radius = 120;
    return {
      left: width / 2 + radius * Math.cos(angle) - 30,
      top: height / 2 + radius * Math.sin(angle) - 30,
    };
  });

  // Uzun başlıkları iki satıra böl
  const formatCharacterTitle = (character: string) => {
    const words = character.split(' ');
    if (words.length <= 2) return character;
    
    // İlk iki kelimeyi ilk satıra, kalanları ikinci satıra
    const firstLine = words.slice(0, 2).join(' ');
    const secondLine = words.slice(2).join(' ');
    return { firstLine, secondLine };
  };

  const characterTitle = formatCharacterTitle(user.character);

  return (
    <View style={styles.container}>
              <LottieView 
                source={require('../../assets/lottie/nebula.json')} 
                autoPlay 
                loop 
                style={styles.bgAnim}
                resizeMode="cover"
              />
      
      {/* Ana burç ikonu - 3D animasyon */}
      <Animated.View
        style={[
          styles.mainIconContainer,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotateInterpolate },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <Image source={icons[iconKey]} style={styles.icon} />
        <View style={styles.titleContainer}>
          {typeof characterTitle === 'string' ? (
            <Text style={styles.characterTitle}>{characterTitle}</Text>
          ) : (
            <>
              <Text style={styles.characterTitle}>{characterTitle.firstLine}</Text>
              <Text style={styles.characterTitle}>{characterTitle.secondLine}</Text>
            </>
          )}
          <Text style={styles.nameTitle}>"{user.name}"</Text>
        </View>
      </Animated.View>

      {/* Zodyak çemberi - parçalanma animasyonu */}
      {animationPhase >= 1 && (
        <View style={styles.zodiacCircle}>
          {zodiacSigns.map((sign, index) => (
            <Animated.View
              key={sign}
              style={[
                styles.zodiacIcon,
                {
                  left: zodiacPositions[index].left,
                  top: zodiacPositions[index].top,
                  transform: [{ scale: zodiacScaleAnim }],
                  opacity: zodiacOpacityAnim,
                },
              ]}
            >
              <Image source={icons[sign.toLowerCase()]} style={styles.smallIcon} />
            </Animated.View>
          ))}
        </View>
      )}

      {/* Karanlık overlay */}
      <Animated.View
        style={[
          styles.darkOverlay,
          {
            opacity: darkOverlayAnim,
          },
        ]}
      />

      {/* Zodyak mesajı */}
      {showZodiacMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.zodiacMessage}>
            ZODYAK SENİ İÇİNE ALDI
          </Text>
          <Text style={styles.zodiacSubMessage}>
            KAÇMAK İÇİN GÖKSEL BİLGİLERİ ÇÖZMELİSİN..
          </Text>
        </View>
      )}

      <Text style={styles.subtitle}>Zaman durmuş gibi…{"\n"}Zodyak senin uyanmanı bekliyor.</Text>
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
  mainIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  icon: { 
    width: 120, 
    height: 120, 
    marginBottom: 24,
    borderRadius: 60,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    maxWidth: width - 40,
  },
  characterTitle: { 
    color: '#fff', 
    fontSize: Math.min(22, width * 0.05), // Biraz daha küçük font
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 2,
    lineHeight: Math.min(26, width * 0.06), // Satır yüksekliği
  },
  nameTitle: { 
    color: '#FFD700', 
    fontSize: Math.min(20, width * 0.045), // İsim için daha küçük
    fontWeight: 'bold', 
    textAlign: 'center', 
    fontStyle: 'italic',
  },
  subtitle: { 
    color: '#b0b0ff', 
    fontSize: 18, 
    textAlign: 'center',
    position: 'absolute',
    bottom: 50,
  },
  zodiacCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  zodiacIcon: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 20,
  },
  messageContainer: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 30,
  },
  zodiacMessage: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  zodiacSubMessage: {
    color: '#b0b0ff',
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: '#b0b0ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
}); 