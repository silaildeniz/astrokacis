import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import AstroButton from '../components/AstroButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addUser } from '../firebase/firestoreService';
import { calculateBirthChart, BirthChartRequest } from '../services/birthChartService';

const OPENCAGE_KEY = "02791b16b5c644b3884f375cc877dc08";

const zodiacSigns = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];

const characterMap: { [key: string]: string } = {
  'Koç': 'Ateş Savaşçısı',
  'Boğa': 'Toprak Ruhu',
  'İkizler': 'Zihin Yolcusu',
  'Yengeç': 'Kalp Muhafızı',
  'Aslan': 'Güneşin Çocuğu',
  'Başak': 'Detaycı Bilge',
  'Terazi': 'Denge Ustası',
  'Akrep': 'Gölgelerin Efendisi',
  'Yay': 'Bilgelik Avcısı',
  'Oğlak': 'Strateji Uzmanı',
  'Kova': 'Yıldız Kaşifi',
  'Balık': 'Rüya Yolcusu'
};

const elementMap: { [key: string]: string } = {
  'Koç': 'Ateş', 'Aslan': 'Ateş', 'Yay': 'Ateş',
  'Boğa': 'Toprak', 'Başak': 'Toprak', 'Oğlak': 'Toprak',
  'İkizler': 'Hava', 'Terazi': 'Hava', 'Kova': 'Hava',
  'Yengeç': 'Su', 'Akrep': 'Su', 'Balık': 'Su'
};

export default function BirthInputScreen({ navigation, route }: any) {
  const { fromFinal, fromKader, user } = route.params || {};
  const [name, setName] = useState(user?.name || '');
  const [birthDate, setBirthDate] = useState(user?.birthDate ? new Date(user.birthDate) : new Date());
  const [birthTime, setBirthTime] = useState(user?.birthTime ? new Date(`2000-01-01T${user.birthTime}`) : new Date());
  const [birthPlace, setBirthPlace] = useState(user?.birthPlace || '');
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [selectedZodiac, setSelectedZodiac] = useState(user?.sun_sign || '');
  const [inputMode, setInputMode] = useState<'full' | 'zodiac'>(fromFinal ? 'full' : 'full');
  const [isLoading, setIsLoading] = useState(false);
  
  // Şehir önerileri için state'ler
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Şehir arama fonksiyonu
  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearchingCities(true);
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${OPENCAGE_KEY}&limit=5&no_annotations=1`
      );
      const data = await response.json();
      
      const cities = data.results
        .map((result: any) => ({
          name: result.components.city || result.components.town || result.components.village,
          country: result.components.country,
          fullName: `${result.components.city || result.components.town || result.components.village}, ${result.components.country}`,
          lat: result.geometry.lat,
          lng: result.geometry.lng
        }))
        .filter((city: any) => city.name && city.country); // Sadece geçerli şehirleri al
      
      setCitySuggestions(cities);
      setShowSuggestions(cities.length > 0);
    } catch (error) {
      console.error('Şehir arama hatası:', error);
      setCitySuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearchingCities(false);
    }
  };

  // Şehir seçme fonksiyonu
  const selectCity = (city: any) => {
    setBirthPlace(city.fullName);
    setCitySuggestions([]);
    setShowSuggestions(false);
  };

  // Şehir input değişikliği
  const handleCityInputChange = (text: string) => {
    setBirthPlace(text);
    searchCities(text);
  };

  const handleFullSubmit = async () => {
    // Validation: Saat ve şehir zorunlu
    if (!birthTime || !birthPlace.trim()) {
      Alert.alert('Eksik Bilgi', 'Doğum saati ve şehir bilgisi zorunludur.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Doğum haritası hesaplama
      const birthChartRequest: BirthChartRequest = {
        name: name || 'Anonim',
        birthDate: birthDate.toISOString().split('T')[0], // YYYY-MM-DD formatı
        birthTime: birthTime.toTimeString().slice(0, 5), // HH:MM formatı
        birthPlace: birthPlace.trim()
      };
      
      console.log('Doğum haritası hesaplanıyor...', birthChartRequest);
      
      const birthChartResponse = await calculateBirthChart(birthChartRequest);
      
      if (!birthChartResponse.success) {
        console.warn('API başarısız, mock data kullanılıyor');
        // API başarısız olsa bile mock data ile devam et
      }
      
      console.log('Doğum haritası başarıyla hesaplandı:', birthChartResponse.data);
      
      // Kullanıcı verilerini hazırla
      const userData = {
        name: name || 'Anonim',
        birthDate: birthDate.toISOString().split('T')[0],
        birthTime: birthTime.toTimeString().slice(0,5),
        birthPlace: birthPlace.trim(),
        character: characterMap[birthChartResponse.data!.sun_sign] || 'Rüya Yolcusu',
        element: elementMap[birthChartResponse.data!.sun_sign] || 'Su',
        birthChart: birthChartResponse.data,
        sun_sign: birthChartResponse.data!.sun_sign,
        score: user?.score || 0,
        lives: user?.lives || 3,
        premium: user?.premium || false,
        createdAt: new Date()
      };
      
      if (fromFinal) {
        // Final'dan geldiyse doğrudan Final'a geri dön
        navigation.navigate('Final', { user: { ...user, ...userData }, aspectsCompleted: true });
      } else if (fromKader) {
        // Kader odasından geldiyse doğrudan Kader odasına geri dön
        navigation.navigate('KaderRoom', { user: { ...user, ...userData } });
      } else {
        const userId = await addUser(userData);
        navigation.navigate('Character', { user: { ...userData, id: userId } });
      }
      
    } catch (error) {
      console.error('Doğum haritası hesaplama hatası:', error);
      Alert.alert(
        'Hata', 
        'Doğum haritası hesaplanırken bir hata oluştu. Lütfen tekrar deneyin.',
        [
          { text: 'Tamam', onPress: () => setIsLoading(false) }
        ]
      );
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleZodiacSubmit = async () => {
    if (!selectedZodiac) {
      Alert.alert('Eksik Bilgi', 'Lütfen bir burç seçin.');
      return;
    }
    
    const character = characterMap[selectedZodiac];
    const element = elementMap[selectedZodiac];
    
    const userData = {
      name: name || 'Anonim',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
      sun_sign: selectedZodiac,
      character,
      element,
      score: 0,
      lives: 3,
      premium: false,
      createdAt: new Date()
    };
    const userId = await addUser(userData);
    navigation.navigate('Character', { user: { ...userData, id: userId } });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Android'de sadece "set" butonuna basıldığında kapat
    if (Platform.OS === 'android' && event.type === 'set') {
      setShowDate(false);
    }
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    // Android'de sadece "set" butonuna basıldığında kapat
    if (Platform.OS === 'android' && event.type === 'set') {
      setShowTime(false);
    }
    if (selectedTime) {
      setBirthTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>
        {fromKader ? '🔮 KADER ODASI İÇİN' : 'ZAMAN DURMUŞ..'}
      </Text>
      <Text style={styles.subTitle}>
        {fromKader 
          ? 'Doğum verilerinizi girerek AI ile kaderinizi keşfedin..'
          : 'ZODYAK EVRENİ SENİN UYANMANI BEKLİYOR..'
        }
      </Text>
      
      <Text style={styles.label}>Adın (İsteğe bağlı):</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="Adınızı girin (opsiyonel)" 
        placeholderTextColor="#aaa" 
      />

      {inputMode === 'full' ? (
        <>
          <Text style={styles.label}>Doğum Tarihi:</Text>
          <TouchableOpacity 
            style={[styles.dateButton, showDate && styles.activeDateButton]} 
            onPress={() => setShowDate(true)}
          >
            <Text style={[styles.dateButtonText, showDate && styles.activeDateButtonText]}>
              {birthDate.toLocaleDateString('tr-TR')}
            </Text>
            {showDate && <Text style={styles.activeIndicator}>●</Text>}
          </TouchableOpacity>
          
          {showDate && (
            <>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  style={styles.dateTimePicker}
                  textColor="#000"
                />
              </View>
              {Platform.OS === 'ios' && (
                <View style={styles.pickerButtons}>
                  <TouchableOpacity 
                    style={styles.pickerButton} 
                    onPress={() => setShowDate(false)}
                  >
                    <Text style={styles.pickerButtonText}>Tamam</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          
          <Text style={styles.label}>Doğum Saati (Zorunlu):</Text>
          <TouchableOpacity 
            style={[styles.dateButton, showTime && styles.activeDateButton]} 
            onPress={() => setShowTime(true)}
          >
            <Text style={[styles.dateButtonText, showTime && styles.activeDateButtonText]}>
              {birthTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {showTime && <Text style={styles.activeIndicator}>●</Text>}
          </TouchableOpacity>
          
          {showTime && (
            <>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={birthTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                  style={styles.dateTimePicker}
                  textColor="#000"
                />
              </View>
              {Platform.OS === 'ios' && (
                <View style={styles.pickerButtons}>
                  <TouchableOpacity 
                    style={styles.pickerButton} 
                    onPress={() => setShowTime(false)}
                  >
                    <Text style={styles.pickerButtonText}>Tamam</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          
          <Text style={styles.label}>Doğum Yeri (Zorunlu):</Text>
          <View style={styles.cityInputContainer}>
            <TextInput 
              style={styles.input} 
              value={birthPlace} 
              onChangeText={handleCityInputChange}
              placeholder="Şehir adını girin" 
              placeholderTextColor="#aaa" 
            />
            
            {/* Şehir önerileri */}
            {showSuggestions && (
              <View style={styles.suggestionsContainer}>
                {isSearchingCities ? (
                  <View style={styles.suggestionItem}>
                    <Text style={styles.loadingText}>Şehirler aranıyor...</Text>
                  </View>
                ) : (
                  <ScrollView style={styles.suggestionsList}>
                    {citySuggestions.map((city, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => selectCity(city)}
                      >
                        <Text style={styles.suggestionText}>{city.fullName}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#b0b0ff" />
              <Text style={styles.loadingTextMain}>Doğum haritası hesaplanıyor...</Text>
            </View>
          ) : (
            <AstroButton 
              title="Devam Et" 
              onPress={handleFullSubmit} 
              disabled={!birthTime || !birthPlace.trim()} 
            />
          )}
        </>
      ) : (
        <>
          <Text style={styles.label}>Burç Seç:</Text>
          <View style={styles.zodiacGrid}>
            {zodiacSigns.map((sign) => (
              <TouchableOpacity
                key={sign}
                style={[styles.zodiacButton, selectedZodiac === sign && styles.selectedZodiac]}
                onPress={() => setSelectedZodiac(sign)}
              >
                <Text style={[styles.zodiacText, selectedZodiac === sign && styles.selectedZodiacText]}>
                  {sign}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <AstroButton 
            title="Devam Et" 
            onPress={handleZodiacSubmit} 
            disabled={!selectedZodiac} 
          />
        </>
      )}

      <TouchableOpacity 
        style={styles.switchMode}
        onPress={() => setInputMode(inputMode === 'full' ? 'zodiac' : 'full')}
      >
        <Text style={styles.switchModeText}>
          {inputMode === 'full' 
            ? 'Doğum bilgilerini girmek istemiyorsan sadece burcunu gir' 
            : 'Tam doğum bilgilerini gir'
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#181A20', 
    padding: 24, 
    justifyContent: 'center' 
  },
  mainTitle: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 8 
  },
  subTitle: { 
    color: '#b0b0ff', 
    fontSize: 18, 
    textAlign: 'center', 
    marginBottom: 32,
    fontStyle: 'italic'
  },
  label: { 
    color: '#fff', 
    fontSize: 18, 
    marginTop: 16,
    marginBottom: 8
  },
  input: { 
    backgroundColor: '#23243A', 
    color: '#fff', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 16
  },
  cityInputContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 50, // Input'un altında
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1001,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#333',
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  suggestionText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingText: {
    color: '#b0b0ff',
    textAlign: 'center',
    padding: 15,
    fontStyle: 'italic',
  },
  dateButton: {
    backgroundColor: '#23243A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center'
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16
  },
  zodiacGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  zodiacButton: {
    backgroundColor: '#23243A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: '48%',
    alignItems: 'center'
  },
  selectedZodiac: {
    backgroundColor: '#3A3B5A',
    borderWidth: 2,
    borderColor: '#b0b0ff'
  },
  zodiacText: {
    color: '#fff',
    fontSize: 16
  },
  selectedZodiacText: {
    color: '#b0b0ff',
    fontWeight: 'bold'
  },
  switchMode: {
    marginTop: 24,
    padding: 12,
    alignItems: 'center'
  },
  switchModeText: {
    color: '#b0b0ff',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  loadingTextMain: {
    color: '#b0b0ff',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center'
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8
  },
  pickerButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8
  },
  pickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  activeDateButton: {
    backgroundColor: '#3A3B5A',
    borderColor: '#4ECDC4',
    borderWidth: 2
  },
  activeDateButtonText: {
    color: '#4ECDC4',
    fontWeight: 'bold'
  },
  activeIndicator: {
    color: '#4ECDC4',
    fontSize: 12,
    marginLeft: 8
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateTimePicker: {
    backgroundColor: '#fff',
    color: '#000',
  }
}); 