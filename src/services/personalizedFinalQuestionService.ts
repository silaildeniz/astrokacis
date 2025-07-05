import { finalQuestionTemplates, burcOzellikleri, QuestionTemplate } from '../data/finalQuestionTemplates';

export interface UserNatalChart {
  sunSign: string;
  moonSign: string;
  venusSign: string;
  marsSign: string;
  jupiterSign: string;
  saturnSign: string;
  ascendantSign: string;
  sunHouse: number;
  moonHouse: number;
  venusHouse: number;
  marsHouse: number;
  jupiterHouse: number;
  saturnHouse: number;
}

export interface PersonalizedQuestion {
  id: string;
  gosterge: string;
  zorluk: 'kolay' | 'orta' | 'zor';
  soru: string;
  secenekler: string[];
  dogru_cevap: string;
  aciklama: string;
}

// Burç özellikleri için genişletilmiş veritabanı
const extendedBurcOzellikleri: Record<string, Record<string, string>> = {
  'Koç': {
    // Güneş burcu özellikleri
    dogru_ozellik: 'Cesur, enerjik ve girişken',
    yanlis_ozellik1: 'Çekingen ve içine kapanık',
    yanlis_ozellik2: 'Çok sosyal ve dışa dönük',
    yanlis_ozellik3: 'Tutkulu ve derin duygulara sahip',
    dogru_alan: 'Kişisel başarı ve girişimcilik',
    yanlis_alan1: 'Ev ve aile yaşamı',
    yanlis_alan2: 'İletişim ve yakın çevre ile güçlü bağlar',
    yanlis_alan3: 'Gizli ve derin dönüşümler',
    dogru_ifade: 'Güçlü bir liderlik arzun var ve kalabalık önünde parlamak istersin.',
    yanlis_ifade1: 'Kendi iç dünyanda derin araştırmalar yaparsın, özellikle bilgi ve iletişim alanında gizemlere çekilirsin.',
    yanlis_ifade2: 'Yeni fikirler ve özgürlük peşindesin, sürekli hareket halindesin.',
    yanlis_ifade3: 'Dengeli ve uyumlu ilişkiler senin için önemlidir.',
    
    // Ay burcu özellikleri
    dogru_duygu: 'Enerjik ve cesur',
    yanlis_duygu1: 'Duygusal ve koruyucu',
    yanlis_duygu2: 'Mantıklı ve soğukkanlı',
    yanlis_duygu3: 'Meraklı ve değişken',
    dogru_anlam: 'Kişisel başarı ve liderlik alanında duygusal güven',
    yanlis_anlam1: 'Arkadaş çevresi ve sosyal ilişkilerde duygusal bağlar',
    yanlis_anlam2: 'Ev ve aile ortamında duygusal güven',
    yanlis_anlam3: 'Kariyer ve toplum önünde duygusal ifadeler',
    dogru_durum: 'Kendini lider olarak topluluk içinde gösterme arzun baskındır.',
    yanlis_durum1: 'Arkadaş ve sosyal çevrenden duygusal destek alırsın, orada kendini güvende hissedersin.',
    yanlis_durum2: 'Ev ve aile hayatın duygusal olarak seni en çok etkiler.',
    yanlis_durum3: 'Yeni bilgiler öğrenmek seni duygusal olarak tatmin eder.',
    
    // Venüs burcu özellikleri
    dogru_tutum: 'Bağımsız ve özgürlükçü',
    yanlis_tutum1: 'Romantik ve uyumlu ilişkiler arar',
    yanlis_tutum2: 'Tutkulu ve yoğun duygularla dolu',
    yanlis_tutum3: 'Pratik ve gerçekçi',
    
    // Mars burcu özellikleri
    dogru_enerji: 'Ani ve hızlı hareketlerle, savaşçı ruhla',
    yanlis_enerji1: 'Dengeli ve adil bir şekilde, çatışmalardan kaçınarak',
    yanlis_enerji2: 'Sabırlı ve stratejik planlarla',
    yanlis_enerji3: 'Duygusal iniş çıkışlarla',
    dogru_ozellik_mars: 'Hırslı ve savaşçı ruhlu, enerjini doğru kullanma',
    yanlis_ozellik_mars1: 'Barış ve dengeyi koruma, çatışmalardan kaçınma',
    yanlis_ozellik_mars2: 'Sabırlı ve planlı hareket etme',
    yanlis_ozellik_mars3: 'Sosyal ilişkilerde agresiflik ve cesaret',
    
    // Jüpiter burcu özellikleri
    dogru_alan_jupiter: 'Kişisel gelişim ve öğrenme',
    yanlis_alan_jupiter1: 'Sosyal ilişkiler ve arkadaşlıklar',
    yanlis_alan_jupiter2: 'Maddi kazanç ve güvenlik',
    yanlis_alan_jupiter3: 'Ev ve aile hayatı',
    dogru_anlam_jupiter: 'Yurtdışı, eğitim ve felsefe alanında genişleme',
    yanlis_anlam_jupiter1: 'Kariyer ve toplum önünde büyüme',
    yanlis_anlam_jupiter2: 'Aile ve ev hayatında şans',
    yanlis_anlam_jupiter3: 'İletişim ve yakın çevrede fırsatlar',
    dogru_ozellik_jupiter: 'Yeni deneyimlere açık, sürekli öğrenmek isteyen',
    yanlis_ozellik_jupiter1: 'Ev ve aileye bağlı, orada büyürsün',
    yanlis_ozellik_jupiter2: 'Sosyal çevre ve dostluklar ön planda',
    yanlis_ozellik_jupiter3: 'İletişim becerileri yüksek ve topluma katkı sağlar',
    
    // Satürn burcu özellikleri
    dogru_ozellik_saturn: 'Hırslı ve cesur',
    yanlis_ozellik_saturn1: 'Disiplinli ve sorumluluk sahibi',
    yanlis_ozellik_saturn2: 'İnatçı ve sabırsız',
    yanlis_ozellik_saturn3: 'Duygusal ve hassas',
    dogru_gosterge: 'Kariyer ve toplumdaki sorumluluklar',
    yanlis_gosterge1: 'Ev ve aile sorumlulukları',
    yanlis_gosterge2: 'İletişim ve yakın çevrede sınırlar',
    yanlis_gosterge3: 'Kişisel finans ve maddi disiplin',
    dogru_tanim: 'Zorlu şartlar altında bile disiplinle ilerleyip hedeflerine ulaşan',
    yanlis_tanim1: 'Ani kararlar veren, sabırsız ve aceleci',
    yanlis_tanim2: 'Çok duygusal ve savunmasız olan',
    yanlis_tanim3: 'Sosyal çevresinde liderlik yapan ve popüler biri',
    
    // Yükselen burcu özellikleri
    dogru_gorunum: 'Cesur, enerjik ve girişken',
    yanlis_gorunum1: 'Titiz, detaycı ve mükemmeliyetçi',
    yanlis_gorunum2: 'Sakin, dengeli ve uyumlu',
    yanlis_gorunum3: 'Duygusal, hassas ve şefkatli',
    dogru_meslek: 'Liderlik, yönetim ve girişimcilik',
    yanlis_meslek1: 'Sağlık, analiz ve detay gerektiren işler',
    yanlis_meslek2: 'Sanat, tasarım ve yaratıcı alanlar',
    yanlis_meslek3: 'Eğitim ve öğretim',
    dogru_tutum_asc: 'Samimi, sıcak ve dışa dönük',
    yanlis_tutum_asc1: 'Eleştirel, mantıklı ve mesafeli',
    yanlis_tutum_asc2: 'Uyumlu, barışçıl ve sabırlı',
    yanlis_tutum_asc3: 'Maceracı, özgür ruhlu ve cesur'
  },
  'Boğa': {
    // Güneş burcu özellikleri
    dogru_ozellik: 'Kararlı, güvenilir ve sabırlı',
    yanlis_ozellik1: 'Çekingen ve içine kapanık',
    yanlis_ozellik2: 'Çok sosyal ve dışa dönük',
    yanlis_ozellik3: 'Tutkulu ve derin duygulara sahip',
    dogru_alan: 'Maddi güvenlik ve değerler',
    yanlis_alan1: 'Kişisel başarı ve girişimcilik',
    yanlis_alan2: 'İletişim ve yakın çevre ile güçlü bağlar',
    yanlis_alan3: 'Gizli ve derin dönüşümler',
    dogru_ifade: 'Maddi güvenlik ve değerler senin için önemlidir, sabırla hedeflerine ulaşırsın.',
    yanlis_ifade1: 'Kendi iç dünyanda derin araştırmalar yaparsın, özellikle bilgi ve iletişim alanında gizemlere çekilirsin.',
    yanlis_ifade2: 'Yeni fikirler ve özgürlük peşindesin, sürekli hareket halindesin.',
    yanlis_ifade3: 'Dengeli ve uyumlu ilişkiler senin için önemlidir.',
    
    // Ay burcu özellikleri
    dogru_duygu: 'Duygusal ve koruyucu',
    yanlis_duygu1: 'Enerjik ve cesur',
    yanlis_duygu2: 'Mantıklı ve soğukkanlı',
    yanlis_duygu3: 'Meraklı ve değişken',
    dogru_anlam: 'Ev ve aile ortamında duygusal güven',
    yanlis_anlam1: 'Arkadaş çevresi ve sosyal ilişkilerde duygusal bağlar',
    yanlis_anlam2: 'Kişisel başarı ve liderlik alanında duygusal güven',
    yanlis_anlam3: 'Kariyer ve toplum önünde duygusal ifadeler',
    dogru_durum: 'Ev ve aile hayatın duygusal olarak seni en çok etkiler.',
    yanlis_durum1: 'Arkadaş ve sosyal çevrenden duygusal destek alırsın, orada kendini güvende hissedersin.',
    yanlis_durum2: 'Kendini lider olarak topluluk içinde gösterme arzun baskındır.',
    yanlis_durum3: 'Yeni bilgiler öğrenmek seni duygusal olarak tatmin eder.',
    
    // Venüs burcu özellikleri
    dogru_tutum: 'Pratik ve gerçekçi',
    yanlis_tutum1: 'Romantik ve uyumlu ilişkiler arar',
    yanlis_tutum2: 'Bağımsız ve özgürlükçü',
    yanlis_tutum3: 'Tutkulu ve yoğun duygularla dolu',
    
    // Mars burcu özellikleri
    dogru_enerji: 'Sabırlı ve stratejik planlarla',
    yanlis_enerji1: 'Dengeli ve adil bir şekilde, çatışmalardan kaçınarak',
    yanlis_enerji2: 'Ani ve hızlı hareketlerle, savaşçı ruhla',
    yanlis_enerji3: 'Duygusal iniş çıkışlarla',
    dogru_ozellik_mars: 'Sabırlı ve planlı hareket etme',
    yanlis_ozellik_mars1: 'Barış ve dengeyi koruma, çatışmalardan kaçınma',
    yanlis_ozellik_mars2: 'Hırslı ve savaşçı ruhlu, enerjini doğru kullanma',
    yanlis_ozellik_mars3: 'Sosyal ilişkilerde agresiflik ve cesaret',
    
    // Jüpiter burcu özellikleri
    dogru_alan_jupiter: 'Maddi kazanç ve güvenlik',
    yanlis_alan_jupiter1: 'Sosyal ilişkiler ve arkadaşlıklar',
    yanlis_alan_jupiter2: 'Kişisel gelişim ve öğrenme',
    yanlis_alan_jupiter3: 'Ev ve aile hayatı',
    dogru_anlam_jupiter: 'Kariyer ve toplum önünde büyüme',
    yanlis_anlam_jupiter1: 'Yurtdışı, eğitim ve felsefe alanında genişleme',
    yanlis_anlam_jupiter2: 'Aile ve ev hayatında şans',
    yanlis_anlam_jupiter3: 'İletişim ve yakın çevrede fırsatlar',
    dogru_ozellik_jupiter: 'Ev ve aileye bağlı, orada büyürsün',
    yanlis_ozellik_jupiter1: 'Yeni deneyimlere açık, sürekli öğrenmek isteyen',
    yanlis_ozellik_jupiter2: 'Sosyal çevre ve dostluklar ön planda',
    yanlis_ozellik_jupiter3: 'İletişim becerileri yüksek ve topluma katkı sağlar',
    
    // Satürn burcu özellikleri
    dogru_ozellik_saturn: 'Disiplinli ve sorumluluk sahibi',
    yanlis_ozellik_saturn1: 'Hırslı ve cesur',
    yanlis_ozellik_saturn2: 'İnatçı ve sabırsız',
    yanlis_ozellik_saturn3: 'Duygusal ve hassas',
    dogru_gosterge: 'Ev ve aile sorumlulukları',
    yanlis_gosterge1: 'Kariyer ve toplumdaki sorumluluklar',
    yanlis_gosterge2: 'İletişim ve yakın çevrede sınırlar',
    yanlis_gosterge3: 'Kişisel finans ve maddi disiplin',
    dogru_tanim: 'Zorlu şartlar altında bile disiplinle ilerleyip hedeflerine ulaşan',
    yanlis_tanim1: 'Ani kararlar veren, sabırsız ve aceleci',
    yanlis_tanim2: 'Çok duygusal ve savunmasız olan',
    yanlis_tanim3: 'Sosyal çevresinde liderlik yapan ve popüler biri',
    
    // Yükselen burcu özellikleri
    dogru_gorunum: 'Sakin, dengeli ve uyumlu',
    yanlis_gorunum1: 'Titiz, detaycı ve mükemmeliyetçi',
    yanlis_gorunum2: 'Cesur, enerjik ve girişken',
    yanlis_gorunum3: 'Duygusal, hassas ve şefkatli',
    dogru_meslek: 'Finans, bankacılık ve maddi konular',
    yanlis_meslek1: 'Sağlık, analiz ve detay gerektiren işler',
    yanlis_meslek2: 'Liderlik, yönetim ve girişimcilik',
    yanlis_meslek3: 'Eğitim ve öğretim',
    dogru_tutum_asc: 'Uyumlu, barışçıl ve sabırlı',
    yanlis_tutum_asc1: 'Eleştirel, mantıklı ve mesafeli',
    yanlis_tutum_asc2: 'Samimi, sıcak ve dışa dönük',
    yanlis_tutum_asc3: 'Maceracı, özgür ruhlu ve cesur'
  }
  // Diğer burçlar için benzer şekilde devam edecek...
};

// Ev anlamları
const evAnlamlari: Record<number, Record<string, string>> = {
  1: {
    dogru_alan: 'Kişisel kimlik ve benlik',
    yanlis_alan1: 'Ev ve aile yaşamı',
    yanlis_alan2: 'İletişim ve yakın çevre ile güçlü bağlar',
    yanlis_alan3: 'Gizli ve derin dönüşümler',
    dogru_anlam: 'Kişisel kimlik ve benlik alanında duygusal güven',
    yanlis_anlam1: 'Arkadaş çevresi ve sosyal ilişkilerde duygusal bağlar',
    yanlis_anlam2: 'Ev ve aile ortamında duygusal güven',
    yanlis_anlam3: 'Kariyer ve toplum önünde duygusal ifadeler',
    dogru_ifade: 'Kişisel kimlik ve benlik alanında güçlü bir liderlik arzun var.',
    yanlis_ifade1: 'Kendi iç dünyanda derin araştırmalar yaparsın.',
    yanlis_ifade2: 'Yeni fikirler ve özgürlük peşindesin.',
    yanlis_ifade3: 'Dengeli ve uyumlu ilişkiler senin için önemlidir.',
    dogru_durum: 'Kişisel kimlik ve benlik alanında kendini en iyi ifade edersin.',
    yanlis_durum1: 'Arkadaş ve sosyal çevrenden duygusal destek alırsın.',
    yanlis_durum2: 'Ev ve aile hayatın duygusal olarak seni en çok etkiler.',
    yanlis_durum3: 'Yeni bilgiler öğrenmek seni duygusal olarak tatmin eder.',
    dogru_tutum: 'Kişisel kimlik ve benlik alanında bağımsız ve özgürlükçü',
    yanlis_tutum1: 'Romantik ve uyumlu ilişkiler arar',
    yanlis_tutum2: 'Tutkulu ve yoğun duygularla dolu',
    yanlis_tutum3: 'Pratik ve gerçekçi',
    dogru_enerji: 'Kişisel kimlik ve benlik alanında ani ve hızlı hareketlerle',
    yanlis_enerji1: 'Dengeli ve adil bir şekilde, çatışmalardan kaçınarak',
    yanlis_enerji2: 'Sabırlı ve stratejik planlarla',
    yanlis_enerji3: 'Duygusal iniş çıkışlarla',
    dogru_ozellik_mars: 'Kişisel kimlik ve benlik alanında hırslı ve savaşçı ruhlu',
    yanlis_ozellik_mars1: 'Barış ve dengeyi koruma, çatışmalardan kaçınma',
    yanlis_ozellik_mars2: 'Sabırlı ve planlı hareket etme',
    yanlis_ozellik_mars3: 'Sosyal ilişkilerde agresiflik ve cesaret',
    dogru_alan_jupiter: 'Kişisel gelişim ve öğrenme',
    yanlis_alan_jupiter1: 'Sosyal ilişkiler ve arkadaşlıklar',
    yanlis_alan_jupiter2: 'Maddi kazanç ve güvenlik',
    yanlis_alan_jupiter3: 'Ev ve aile hayatı',
    dogru_anlam_jupiter: 'Kişisel kimlik ve benlik alanında yurtdışı, eğitim ve felsefe',
    yanlis_anlam_jupiter1: 'Kariyer ve toplum önünde büyüme',
    yanlis_anlam_jupiter2: 'Aile ve ev hayatında şans',
    yanlis_anlam_jupiter3: 'İletişim ve yakın çevrede fırsatlar',
    dogru_ozellik_jupiter: 'Kişisel kimlik ve benlik alanında yeni deneyimlere açık',
    yanlis_ozellik_jupiter1: 'Ev ve aileye bağlı, orada büyürsün',
    yanlis_ozellik_jupiter2: 'Sosyal çevre ve dostluklar ön planda',
    yanlis_ozellik_jupiter3: 'İletişim becerileri yüksek ve topluma katkı sağlar',
    dogru_ozellik_saturn: 'Kişisel kimlik ve benlik alanında hırslı ve cesur',
    yanlis_ozellik_saturn1: 'Disiplinli ve sorumluluk sahibi',
    yanlis_ozellik_saturn2: 'İnatçı ve sabırsız',
    yanlis_ozellik_saturn3: 'Duygusal ve hassas',
    dogru_gosterge: 'Kişisel kimlik ve benlik alanında kariyer ve toplumdaki sorumluluklar',
    yanlis_gosterge1: 'Ev ve aile sorumlulukları',
    yanlis_gosterge2: 'İletişim ve yakın çevrede sınırlar',
    yanlis_gosterge3: 'Kişisel finans ve maddi disiplin',
    dogru_tanim: 'Kişisel kimlik ve benlik alanında zorlu şartlar altında bile disiplinle ilerleyip hedeflerine ulaşan',
    yanlis_tanim1: 'Ani kararlar veren, sabırsız ve aceleci',
    yanlis_tanim2: 'Çok duygusal ve savunmasız olan',
    yanlis_tanim3: 'Sosyal çevresinde liderlik yapan ve popüler biri',
    dogru_gorunum: 'Kişisel kimlik ve benlik alanında cesur, enerjik ve girişken',
    yanlis_gorunum1: 'Titiz, detaycı ve mükemmeliyetçi',
    yanlis_gorunum2: 'Sakin, dengeli ve uyumlu',
    yanlis_gorunum3: 'Duygusal, hassas ve şefkatli',
    dogru_meslek: 'Kişisel kimlik ve benlik alanında liderlik, yönetim ve girişimcilik',
    yanlis_meslek1: 'Sağlık, analiz ve detay gerektiren işler',
    yanlis_meslek2: 'Sanat, tasarım ve yaratıcı alanlar',
    yanlis_meslek3: 'Eğitim ve öğretim',
    dogru_tutum_asc: 'Kişisel kimlik ve benlik alanında samimi, sıcak ve dışa dönük',
    yanlis_tutum_asc1: 'Eleştirel, mantıklı ve mesafeli',
    yanlis_tutum_asc2: 'Uyumlu, barışçıl ve sabırlı',
    yanlis_tutum_asc3: 'Maceracı, özgür ruhlu ve cesur'
  }
  // Diğer evler için benzer şekilde devam edecek...
};

export class PersonalizedFinalQuestionService {
  private static getBurcOzellikleri(burc: string): Record<string, string> {
    return extendedBurcOzellikleri[burc] || extendedBurcOzellikleri['Koç'];
  }

  private static getEvAnlamlari(ev: number): Record<string, string> {
    return evAnlamlari[ev] || evAnlamlari[1];
  }

  private static fillTemplate(template: QuestionTemplate, natalChart: UserNatalChart): PersonalizedQuestion {
    // Hangi gezegen için soru sorulduğuna göre doğru burç ve ev verilerini al
    let planetSign = natalChart.sunSign;
    let planetHouse = natalChart.sunHouse;
    let burcOzellikleri = this.getBurcOzellikleri(planetSign);

    console.log(`Filling template for ${template.gosterge}:`, {
      originalSign: planetSign,
      originalHouse: planetHouse
    });

    switch (template.gosterge) {
      case 'Güneş':
        planetSign = natalChart.sunSign;
        planetHouse = natalChart.sunHouse;
        burcOzellikleri = this.getBurcOzellikleri(planetSign);
        break;
      case 'Ay':
        planetSign = natalChart.moonSign;
        planetHouse = natalChart.moonHouse;
        burcOzellikleri = this.getBurcOzellikleri(planetSign);
        break;
      case 'Venüs':
        planetSign = natalChart.venusSign;
        planetHouse = natalChart.venusHouse;
        burcOzellikleri = this.getBurcOzellikleri(planetSign);
        break;
      case 'Mars':
        planetSign = natalChart.marsSign;
        planetHouse = natalChart.marsHouse;
        burcOzellikleri = this.getBurcOzellikleri(planetSign);
        break;
      case 'Jüpiter':
        planetSign = natalChart.jupiterSign;
        planetHouse = natalChart.jupiterHouse;
        burcOzellikleri = this.getBurcOzellikleri(planetSign);
        break;
      case 'Satürn':
        planetSign = natalChart.saturnSign;
        planetHouse = natalChart.saturnHouse;
        burcOzellikleri = this.getBurcOzellikleri(planetSign);
        break;
      case 'Yükselen':
        planetSign = natalChart.ascendantSign;
        planetHouse = 1; // Yükselen her zaman 1. evde
        burcOzellikleri = this.getBurcOzellikleri(planetSign);
        break;
      default:
        planetSign = natalChart.sunSign;
        planetHouse = natalChart.sunHouse;
        burcOzellikleri = this.getBurcOzellikleri(planetSign);
    }

    console.log(`After switch for ${template.gosterge}:`, {
      planetSign,
      planetHouse
    });

    const evAnlamlari = this.getEvAnlamlari(planetHouse);

    let filledSoru = template.soru;
    let filledSecenekler = [...template.secenekler];
    let filledDogruCevap = template.dogru_cevap;

    // Burç placeholder'larını doldur
    filledSoru = filledSoru.replace(/{burc}/g, planetSign);
    filledSecenekler = filledSecenekler.map(secenek => 
      secenek.replace(/{burc}/g, planetSign)
    );
    filledDogruCevap = filledDogruCevap.replace(/{burc}/g, planetSign);

    // Ev placeholder'larını doldur
    filledSoru = filledSoru.replace(/{ev}/g, planetHouse.toString());
    filledSecenekler = filledSecenekler.map(secenek => 
      secenek.replace(/{ev}/g, planetHouse.toString())
    );
    filledDogruCevap = filledDogruCevap.replace(/{ev}/g, planetHouse.toString());

    // Özellik placeholder'larını doldur
    Object.keys(burcOzellikleri).forEach(key => {
      const placeholder = `{${key}}`;
      filledSoru = filledSoru.replace(new RegExp(placeholder, 'g'), burcOzellikleri[key]);
      filledSecenekler = filledSecenekler.map(secenek => 
        secenek.replace(new RegExp(placeholder, 'g'), burcOzellikleri[key])
      );
      filledDogruCevap = filledDogruCevap.replace(new RegExp(placeholder, 'g'), burcOzellikleri[key]);
    });

    // Ev anlamları placeholder'larını doldur
    Object.keys(evAnlamlari).forEach(key => {
      const placeholder = `{${key}}`;
      filledSoru = filledSoru.replace(new RegExp(placeholder, 'g'), evAnlamlari[key]);
      filledSecenekler = filledSecenekler.map(secenek => 
        secenek.replace(new RegExp(placeholder, 'g'), evAnlamlari[key])
      );
      filledDogruCevap = filledDogruCevap.replace(new RegExp(placeholder, 'g'), evAnlamlari[key]);
    });

    return {
      id: template.id,
      gosterge: template.gosterge,
      zorluk: template.zorluk,
      soru: filledSoru,
      secenekler: filledSecenekler,
      dogru_cevap: filledDogruCevap,
      aciklama: template.aciklama
    };
  }

  public static generatePersonalizedQuestions(natalChart: UserNatalChart): PersonalizedQuestion[] {
    const questions: PersonalizedQuestion[] = [];
    
    // Her göstergeden bir soru seç (toplam 9 soru)
    const gostergeler = ['Güneş', 'Ay', 'Venüs', 'Mars', 'Jüpiter', 'Satürn', 'Yükselen'];
    
    gostergeler.forEach(gosterge => {
      const gostergeSorulari = finalQuestionTemplates.filter(q => q.gosterge === gosterge);
      
      // Her zorluk seviyesinden bir soru seç
      const zorluklar: ('kolay' | 'orta' | 'zor')[] = ['kolay', 'orta', 'zor'];
      
      zorluklar.forEach(zorluk => {
        const zorlukSorulari = gostergeSorulari.filter(q => q.zorluk === zorluk);
        if (zorlukSorulari.length > 0) {
          const randomSoru = zorlukSorulari[Math.floor(Math.random() * zorlukSorulari.length)];
          const personalizedSoru = this.fillTemplate(randomSoru, natalChart);
          questions.push(personalizedSoru);
        }
      });
    });

    // Soruları karıştır
    return questions.sort(() => Math.random() - 0.5);
  }

  public static getQuestionByGosterge(natalChart: UserNatalChart, gosterge: string, zorluk: 'kolay' | 'orta' | 'zor'): PersonalizedQuestion | null {
    const gostergeSorulari = finalQuestionTemplates.filter(q => q.gosterge === gosterge && q.zorluk === zorluk);
    
    if (gostergeSorulari.length === 0) {
      return null;
    }

    const randomSoru = gostergeSorulari[Math.floor(Math.random() * gostergeSorulari.length)];
    return this.fillTemplate(randomSoru, natalChart);
  }
} 