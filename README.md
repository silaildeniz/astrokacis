# Astro Kaçış - Astroloji Quiz Oyunu

Zodyak'ta hapsolmuş kullanıcının, astroloji bilgisiyle kozmik bulmacaları çözerek kaçmaya çalıştığı interaktif bir mobil oyun.

## 🌟 Özellikler

- **12 Burç Odası**: Her burç için özel quiz'ler
- **10 Gezegen Odası**: Güneş sistemindeki gezegenlerle ilgili sorular
- **4 Element Odası**: Ateş, Toprak, Hava, Su elementleri
- **12 Ev Odası**: Astrolojik evler hakkında bilgiler
- **🔮 Kader Odası**: AI destekli doğum haritası yorumlama
- **Final Sınavı**: Kişisel doğum haritası bilgileri
- **Animasyonlar**: Lottie animasyonları ile etkileyici görsel efektler
- **İlerleme Takibi**: Oyun ilerlemesi ve skor sistemi
- **Firebase Entegrasyonu**: Kullanıcı verileri ve email talepleri
- **AI Entegrasyonu**: OpenAI/GPT ile astrolojik yorumlar

## 🚀 Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- Expo CLI
- Android Studio / Xcode (emülatör için)

### Adımlar
1. Projeyi klonlayın:
```bash
git clone [repository-url]
cd astrokacis
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Firebase konfigürasyonunu ayarlayın:
   - `src/firebase/firebaseConfig.ts` dosyasını düzenleyin
   - Firebase Console'dan aldığınız bilgileri girin

4. Uygulamayı başlatın:
```bash
npm start
```

## 📱 Ekranlar

### Ana Ekranlar
- **WelcomeScreen**: Hoş geldin ekranı
- **BirthInputScreen**: Doğum bilgileri girişi
- **CharacterScreen**: Burç seçimi
- **CorridorScreen**: Ana koridor ve oda seçimi

### Quiz Odaları
- **PlanetRoomScreen**: Gezegen quiz'leri
- **ZodiacRoomScreen**: Burç quiz'leri
- **ElementRoomScreen**: Element quiz'leri
- **EvlerRoomScreen**: Ev quiz'leri
- **KaderRoomScreen**: AI destekli doğum haritası yorumlama

### Diğer Ekranlar
- **FinalScreen**: Final sınavı
- **PremiumScreen**: Premium özellikler
- **ReportScreen**: Doğum haritası raporu

## 🛠️ Teknolojiler

- **React Native**: Mobil uygulama framework'ü
- **Expo**: Geliştirme platformu
- **TypeScript**: Tip güvenliği
- **Firebase**: Backend servisleri
- **Lottie**: Animasyonlar
- **React Navigation**: Navigasyon sistemi

## 📊 Veri Yapısı

### Kullanıcı Verileri
```typescript
interface User {
  id?: string;
  name: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  character: string;
  createdAt?: Date;
}
```

### Oyun İlerlemesi
```typescript
interface GameProgress {
  userId: string;
  planetRoomCompleted: boolean;
  zodiacRoomCompleted: boolean;
  elementRoomCompleted: boolean;
  evlerRoomCompleted: boolean;
  finalCompleted: boolean;
  totalScore: number;
  livesRemaining: number;
  lastPlayedAt: Date;
}
```

## 🎮 Oyun Mekaniği

### Quiz Sistemi
- Her oda 10 soru içerir
- 3 can hakkı
- 30 saniye süre
- İpucu sistemi
- Süre uzatma özelliği

### İlerleme Sistemi
- Odalar sırayla açılır
- Skor sistemi
- Başarı rozetleri
- İlerleme kaydetme

## 🔧 Geliştirme

### Proje Yapısı
```
src/
├── components/          # Yeniden kullanılabilir bileşenler
├── firebase/           # Firebase konfigürasyonu ve servisleri
├── navigation/         # Navigasyon sistemi
├── screens/           # Uygulama ekranları
├── services/          # Servis katmanı
└── types/             # TypeScript tip tanımları
```