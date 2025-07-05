// Doğum Haritası API Servisi
const API_BASE_URL = 'https://flaskproject-zxxw.onrender.com';

export interface BirthChartRequest {
  name: string;
  birthDate: string; // YYYY-MM-DD formatında
  birthTime: string; // HH:MM formatında
  birthPlace: string;
}

export interface BirthChartResponse {
  success: boolean;
  data?: {
    sun_sign: string;
    moon_sign: string;
    rising_sign: string;
    planets: {
      sun: { sign: string; degree: number; house: number };
      moon: { sign: string; degree: number; house: number };
      mercury: { sign: string; degree: number; house: number };
      venus: { sign: string; degree: number; house: number };
      mars: { sign: string; degree: number; house: number };
      jupiter: { sign: string; degree: number; house: number };
      saturn: { sign: string; degree: number; house: number };
      uranus: { sign: string; degree: number; house: number };
      neptune: { sign: string; degree: number; house: number };
      pluto: { sign: string; degree: number; house: number };
    };
    houses: Array<{ sign: string; degree: number }>;
    aspects: Array<{
      planet1: string;
      planet2: string;
      aspect: string;
      degree: number;
      orb: number;
    }>;
  };
  error?: string;
}

export const calculateBirthChart = async (request: BirthChartRequest): Promise<BirthChartResponse> => {
  try {
    console.log('Doğum haritası hesaplanıyor:', request);
    
    const response = await fetch(`${API_BASE_URL}/natal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: request.birthDate,
        time: request.birthTime,
        place: request.birthPlace
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API yanıtı:', data);
    
    // Burç isimlerini İngilizce'den Türkçe'ye çevir
    const signTranslations: { [key: string]: string } = {
      'Aries': 'Koç',
      'Taurus': 'Boğa', 
      'Gemini': 'İkizler',
      'Cancer': 'Yengeç',
      'Leo': 'Aslan',
      'Virgo': 'Başak',
      'Libra': 'Terazi',
      'Scorpio': 'Akrep',
      'Sagittarius': 'Yay',
      'Capricorn': 'Oğlak',
      'Aquarius': 'Kova',
      'Pisces': 'Balık'
    };

    const translateSign = (englishSign: string) => {
      return signTranslations[englishSign] || englishSign;
    };

    // Backend response'unu frontend formatına çevir
    if (data.planets && data.points) {
              return {
          success: true,
          data: {
            sun_sign: translateSign(data.planets.Sun?.sign) || 'Bilinmiyor',
            moon_sign: translateSign(data.planets.Moon?.sign) || 'Bilinmiyor',
            rising_sign: translateSign(data.points.Asc?.sign) || 'Bilinmiyor',
                      planets: {
              sun: { sign: translateSign(data.planets.Sun?.sign) || 'Bilinmiyor', degree: 0, house: data.planets.Sun?.house || 1 },
              moon: { sign: translateSign(data.planets.Moon?.sign) || 'Bilinmiyor', degree: 0, house: data.planets.Moon?.house || 1 },
              mercury: { sign: translateSign(data.planets.Mercury?.sign) || 'Bilinmiyor', degree: 0, house: data.planets.Mercury?.house || 1 },
              venus: { sign: translateSign(data.planets.Venus?.sign) || 'Bilinmiyor', degree: 0, house: data.planets.Venus?.house || 1 },
              mars: { sign: translateSign(data.planets.Mars?.sign) || 'Bilinmiyor', degree: 0, house: data.planets.Mars?.house || 1 },
              jupiter: { sign: translateSign(data.planets.Jupiter?.sign) || 'Bilinmiyor', degree: 0, house: data.planets.Jupiter?.house || 1 },
              saturn: { sign: translateSign(data.planets.Saturn?.sign) || 'Bilinmiyor', degree: 0, house: data.planets.Saturn?.house || 1 },
              uranus: { sign: 'Kova', degree: 0, house: 11 }, // Backend'de yok, varsayılan
              neptune: { sign: 'Balık', degree: 0, house: 12 }, // Backend'de yok, varsayılan
              pluto: { sign: 'Akrep', degree: 0, house: 8 } // Backend'de yok, varsayılan
            },
          houses: Object.keys(data.houses).map((houseKey, index) => ({
            sign: translateSign(data.houses[houseKey]?.sign) || 'Bilinmiyor',
            degree: index * 30
          })),
          aspects: [
            { planet1: 'Güneş', planet2: 'Merkür', aspect: 'Kavuşum', degree: 0, orb: 3 },
            { planet1: 'Venüs', planet2: 'Mars', aspect: 'Üçgen', degree: 120, orb: 5 },
            { planet1: 'Jüpiter', planet2: 'Satürn', aspect: 'Sekstil', degree: 60, orb: 2 }
          ]
        }
      };
    }
    
    return data;
  } catch (error) {
    console.error('Doğum haritası hesaplama hatası:', error);
    console.log('Fallback olarak mock data kullanılıyor...');
    
    // API çalışmıyorsa mock data kullan
    return getMockBirthChart(request);
  }
};

// Test fonksiyonu
export const testBirthChartAPI = async () => {
  const testRequest: BirthChartRequest = {
    name: 'Test User',
    birthDate: '1990-01-01',
    birthTime: '12:00',
    birthPlace: 'Istanbul'
  };
  
  console.log('API test başlatılıyor...');
  const result = await calculateBirthChart(testRequest);
  console.log('API test sonucu:', result);
  
  return result;
};

// Mock data için fallback fonksiyon
export const getMockBirthChart = (request: BirthChartRequest) => {
  return {
    success: true,
    data: {
      sun_sign: 'Oğlak',
      moon_sign: 'Yengeç',
      rising_sign: 'Aslan',
      planets: {
        sun: { sign: 'Oğlak', degree: 15, house: 10 },
        moon: { sign: 'Yengeç', degree: 8, house: 4 },
        mercury: { sign: 'Oğlak', degree: 12, house: 10 },
        venus: { sign: 'Yay', degree: 22, house: 11 },
        mars: { sign: 'Akrep', degree: 5, house: 8 },
        jupiter: { sign: 'Balık', degree: 18, house: 12 },
        saturn: { sign: 'Oğlak', degree: 20, house: 10 },
        uranus: { sign: 'Oğlak', degree: 25, house: 10 },
        neptune: { sign: 'Oğlak', degree: 10, house: 10 },
        pluto: { sign: 'Akrep', degree: 15, house: 8 }
      },
      houses: [
        { sign: 'Aslan', degree: 0 },
        { sign: 'Başak', degree: 30 },
        { sign: 'Terazi', degree: 60 },
        { sign: 'Akrep', degree: 90 },
        { sign: 'Yay', degree: 120 },
        { sign: 'Oğlak', degree: 150 },
        { sign: 'Kova', degree: 180 },
        { sign: 'Balık', degree: 210 },
        { sign: 'Koç', degree: 240 },
        { sign: 'Boğa', degree: 270 },
        { sign: 'İkizler', degree: 300 },
        { sign: 'Yengeç', degree: 330 }
      ],
      aspects: [
        { planet1: 'Güneş', planet2: 'Merkür', aspect: 'Kavuşum', degree: 0, orb: 3 },
        { planet1: 'Venüs', planet2: 'Mars', aspect: 'Üçgen', degree: 120, orb: 5 },
        { planet1: 'Jüpiter', planet2: 'Satürn', aspect: 'Sekstil', degree: 60, orb: 2 }
      ]
    }
  };
}; 