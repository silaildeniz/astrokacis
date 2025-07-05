import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  SafeAreaView
} from 'react-native';
import LottieView from 'lottie-react-native';
import { aiService } from '../services/aiService';

const { width, height } = Dimensions.get('window');

export default function KaderRoomScreen({ navigation, route }: any) {
  const { user } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{question: string, answer: string}>>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Doğum verileri kontrolü
    if (!user?.birthDate || !user?.birthTime || !user?.birthPlace) {
      Alert.alert(
        'Doğum Verileri Gerekli',
        'Kader odasını kullanabilmek için doğum tarihi, saati ve yeri bilgilerinizi girmeniz gerekiyor.',
        [
          {
            text: 'İptal',
            style: 'cancel',
            onPress: () => navigation.navigate('Corridor', { user })
          },
          {
            text: 'Doğum Verilerini Gir',
            onPress: () => navigation.navigate('BirthInput', { user, fromKader: true })
          }
        ]
      );
      return;
    }

    // Doğum haritası hesaplanmamışsa hesapla
    if (!user?.birthChart) {
      calculateBirthChart();
    }

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
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
      ),
    ]).start();
  }, [user]);

  const calculateBirthChart = async () => {
    if (!user?.birthDate || !user?.birthTime || !user?.birthPlace) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/natal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: user.birthDate,
          time: user.birthTime,
          place: user.birthPlace
        }),
      });

      if (response.ok) {
        const birthChartData = await response.json();
        
        // Kullanıcı nesnesini güncelle
        const updatedUser = {
          ...user,
          birthChart: birthChartData
        };
        
        // Route params'ı güncelle (gerçek uygulamada bu state management ile yapılmalı)
        route.params.user = updatedUser;
      } else {
        console.error('Doğum haritası hesaplanamadı');
      }
    } catch (error) {
      console.error('Doğum haritası hesaplama hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedQuestions = [
    {
      category: 'Kariyer',
      questions: [
        'Hangi meslek alanlarında başarılı olabilirim?',
        'Kariyer değişikliği yapmalı mıyım?',
        'İş hayatımda hangi zorluklarla karşılaşacağım?',
        'Liderlik özelliklerim neler?'
      ]
    },
    {
      category: 'Aşk & İlişkiler',
      questions: [
        'İdeal partnerimin özellikleri neler?',
        'Aşk hayatımda hangi dönemlerde değişiklikler olacak?',
        'Evlilik için uygun zaman ne zaman?',
        'İlişkilerimde hangi sorunları yaşayabilirim?'
      ]
    },
    {
      category: 'Kişisel Gelişim',
      questions: [
        'Güçlü yanlarım neler?',
        'Hangi alanlarda gelişmem gerekiyor?',
        'Ruhsal yolculuğumda hangi dersleri öğrenmem gerekiyor?',
        'Hayat amacım nedir?'
      ]
    },
    {
      category: 'Sağlık & Enerji',
      questions: [
        'Hangi sağlık konularına dikkat etmeliyim?',
        'Enerji seviyemi nasıl yükseltebilirim?',
        'Hangi spor aktiviteleri bana uygun?',
        'Stres yönetimi için ne yapmalıyım?'
      ]
    }
  ];

  const getGlowOpacity = () => {
    return glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });
  };

  const handlePredefinedQuestion = async (selectedQuestion: string) => {
    setQuestion(selectedQuestion);
    await getAIInterpretation(selectedQuestion);
  };

  const handleCustomQuestion = async () => {
    if (!question.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir soru sorun');
      return;
    }
    await getAIInterpretation(question);
  };

  const getAIInterpretation = async (userQuestion: string) => {
    if (!user?.birthChart && !user?.sun_sign) {
      Alert.alert(
        'Doğum Verileri Gerekli',
        'Kader odasını kullanabilmek için doğum bilgilerinizi girmeniz gerekiyor.',
        [
          {
            text: 'İptal',
            style: 'cancel'
          },
          {
            text: 'Doğum Verilerini Gir',
            onPress: () => navigation.navigate('BirthInput', { user, fromKader: true })
          }
        ]
      );
      return;
    }

    setIsLoading(true);
    
    try {
      let response;
      
      if (user?.birthChart) {
        // Tam doğum haritası varsa AI servisini kullan
        response = await aiService.interpretBirthChart({
          question: userQuestion,
          birthChart: user.birthChart,
          user: user
        });
      } else if (user?.sun_sign) {
        // Sadece burç varsa basit yorum yap
        response = await aiService.interpretZodiacOnly({
          question: userQuestion,
          zodiacSign: user.sun_sign,
          user: user
        });
      }
      
      if (response) {
        const newChat = {
          question: userQuestion,
          answer: response.interpretation
        };
        
        setChatHistory(prev => [...prev, newChat]);
        setInterpretation(response.interpretation);
        setQuestion('');
      }
      
    } catch (error) {
      Alert.alert('Hata', 'AI yorumu alınırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setInterpretation('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Kozmik arka plan animasyonu */}
      <LottieView 
        source={require('../../assets/lottie/nebula.json')} 
        autoPlay 
        loop 
        style={styles.bgAnim} 
      />
      
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.title}>🔮 Kader Odası</Text>
        <Text style={styles.subtitle}>{user?.character} "{user?.name}"</Text>
        <Text style={styles.description}>
          {user?.birthChart 
            ? 'AI ile tam doğum haritanızı yorumlayın ve kaderinizin sırlarını keşfedin'
            : user?.sun_sign
            ? `AI ile ${user.sun_sign} burcunuzun enerjisini yorumlayın`
            : 'AI ile doğum haritanızı yorumlayın ve kaderinizin sırlarını keşfedin'
          }
        </Text>
        {user?.sun_sign && !user?.birthChart && (
          <Text style={styles.warningText}>
            ⚠️ Sadece burç bilginiz mevcut. Daha detaylı yorumlar için doğum verilerinizi girin.
          </Text>
        )}
      </Animated.View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Önceden Tanımlı Sorular */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Popüler Sorular</Text>
          <Text style={styles.sectionDescription}>
            Aşağıdaki kategorilerden birini seçin veya kendi sorunuzu sorun
          </Text>
          
          {predefinedQuestions.map((category, index) => (
            <View key={index} style={styles.categoryContainer}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === category.category && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.category ? '' : category.category
                )}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.category && styles.selectedCategoryText
                ]}>
                  {category.category}
                </Text>
              </TouchableOpacity>
              
              {selectedCategory === category.category && (
                <View style={styles.questionsContainer}>
                  {category.questions.map((q, qIndex) => (
                    <TouchableOpacity
                      key={qIndex}
                      style={styles.questionButton}
                      onPress={() => handlePredefinedQuestion(q)}
                      disabled={isLoading}
                    >
                      <Text style={styles.questionText}>{q}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Özel Soru */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💭 Kendi Sorunuzu Sorun</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Doğum haritanız hakkında bir soru sorun..."
              placeholderTextColor="#666"
              value={question}
              onChangeText={setQuestion}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity
              style={[styles.askButton, isLoading && styles.disabledButton]}
              onPress={handleCustomQuestion}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <Text style={styles.askButtonText}>SOR</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Sohbet Geçmişi */}
        {chatHistory.length > 0 && (
          <View style={styles.section}>
            <View style={styles.chatHeader}>
              <Text style={styles.sectionTitle}>🗣️ Sohbet Geçmişi</Text>
              <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
                <Text style={styles.clearButtonText}>Temizle</Text>
              </TouchableOpacity>
            </View>
            
            {chatHistory.map((chat, index) => (
              <View key={index} style={styles.chatItem}>
                <View style={styles.questionBubble}>
                  <Text style={styles.questionBubbleText}>❓ {chat.question}</Text>
                </View>
                <View style={styles.answerBubble}>
                  <Text style={styles.answerBubbleText}>🔮 {chat.answer}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Yükleme Animasyonu */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>AI kaderinizi yorumluyor...</Text>
          </View>
        )}
      </ScrollView>

      {/* Alt Menü */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Corridor', { user })}
        >
          <Text style={styles.backButtonText}>← Koridora Dön</Text>
        </TouchableOpacity>
      </View>
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
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    color: '#b0b0ff',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#b0b0ff',
    fontSize: 14,
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3A3B5A',
  },
  selectedCategory: {
    borderColor: '#FFD700',
    backgroundColor: '#2A2A3E',
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#FFD700',
  },
  questionsContainer: {
    marginTop: 12,
    paddingLeft: 16,
  },
  questionButton: {
    backgroundColor: '#23243A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  questionText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#3A3B5A',
    textAlignVertical: 'top',
  },
  askButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  askButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatItem: {
    marginBottom: 16,
  },
  questionBubble: {
    backgroundColor: '#2A2A3E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  questionBubbleText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  answerBubble: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  answerBubbleText: {
    color: '#b0b0ff',
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 16,
    marginTop: 12,
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#3A3B5A',
  },
  backButton: {
    backgroundColor: '#3A3B5A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
}); 