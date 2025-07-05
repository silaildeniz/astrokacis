export interface QuestionTemplate {
  id: string;
  gosterge: string;
  zorluk: 'kolay' | 'orta' | 'zor';
  soru: string;
  secenekler: string[];
  dogru_cevap: string;
  aciklama: string;
}

export const finalQuestionTemplates: QuestionTemplate[] = [
  // GÜNEŞ BURCU SORULARI
  {
    id: 'sun_easy_1',
    gosterge: 'Güneş',
    zorluk: 'kolay',
    soru: 'Güneş burcun {burc} olduğuna göre, aşağıdakilerden hangisi senin temel kişilik özelliğin olabilir?',
    secenekler: [
      '{dogru_ozellik}',
      '{yanlis_ozellik1}',
      '{yanlis_ozellik2}',
      '{yanlis_ozellik3}'
    ],
    dogru_cevap: '{dogru_ozellik}',
    aciklama: 'Güneş burcu kişinin temel karakterini ve kimliğini temsil eder.'
  },
  {
    id: 'sun_medium_1',
    gosterge: 'Güneş',
    zorluk: 'orta',
    soru: 'Güneş\'in {ev}. evde olması neyi vurgular?',
    secenekler: [
      '{dogru_alan}',
      '{yanlis_alan1}',
      '{yanlis_alan2}',
      '{yanlis_alan3}'
    ],
    dogru_cevap: '{dogru_alan}',
    aciklama: 'Güneş\'in bulunduğu ev, kişinin en çok enerji harcadığı yaşam alanını gösterir.'
  },
  {
    id: 'sun_hard_1',
    gosterge: 'Güneş',
    zorluk: 'zor',
    soru: 'Güneş burcun {burc} ve evin {ev} olduğunda, hangi ifade sana daha uygundur?',
    secenekler: [
      '{dogru_ifade}',
      '{yanlis_ifade1}',
      '{yanlis_ifade2}',
      '{yanlis_ifade3}'
    ],
    dogru_cevap: '{dogru_ifade}',
    aciklama: 'Güneş\'in konumu, kişinin en parladığı yaşam dönemini işaret eder.'
  },

  // AY BURCU SORULARI
  {
    id: 'moon_easy_1',
    gosterge: 'Ay',
    zorluk: 'kolay',
    soru: 'Ay burcun {burc} olduğunda, genellikle hangi duygu durumu hakimdir?',
    secenekler: [
      '{dogru_duygu}',
      '{yanlis_duygu1}',
      '{yanlis_duygu2}',
      '{yanlis_duygu3}'
    ],
    dogru_cevap: '{dogru_duygu}',
    aciklama: 'Ay burcu kişinin duygusal dünyasını ve içsel ihtiyaçlarını gösterir.'
  },
  {
    id: 'moon_medium_1',
    gosterge: 'Ay',
    zorluk: 'orta',
    soru: 'Ay\'ın {ev}. evde yer alması ne anlama gelir?',
    secenekler: [
      '{dogru_anlam}',
      '{yanlis_anlam1}',
      '{yanlis_anlam2}',
      '{yanlis_anlam3}'
    ],
    dogru_cevap: '{dogru_anlam}',
    aciklama: 'Ay\'ın ev konumu, kişinin hangi yaşam alanında duygusal güvenlik aradığını gösterir.'
  },
  {
    id: 'moon_hard_1',
    gosterge: 'Ay',
    zorluk: 'zor',
    soru: 'Ay burcun {burc} ve evin {ev} olduğunda, hangi durum seni en iyi anlatır?',
    secenekler: [
      '{dogru_durum}',
      '{yanlis_durum1}',
      '{yanlis_durum2}',
      '{yanlis_durum3}'
    ],
    dogru_cevap: '{dogru_durum}',
    aciklama: 'Ay\'ın konumu, kişinin rüya dünyası ve sezgisel yeteneklerini etkiler.'
  },

  // VENÜS SORULARI
  {
    id: 'venus_easy_1',
    gosterge: 'Venüs',
    zorluk: 'kolay',
    soru: 'Venüs burcun {burc} olduğunda, aşk hayatında hangi tutum daha baskındır?',
    secenekler: [
      '{dogru_tutum}',
      '{yanlis_tutum1}',
      '{yanlis_tutum2}',
      '{yanlis_tutum3}'
    ],
    dogru_cevap: '{dogru_tutum}',
    aciklama: 'Venüs burcu kişinin aşk tarzını ve çekildiği partner türlerini gösterir.'
  },
  {
    id: 'venus_medium_1',
    gosterge: 'Venüs',
    zorluk: 'orta',
    soru: 'Venüs\'ün {ev}. evde yer alması ilişkilerde ne anlama gelir?',
    secenekler: [
      '{dogru_anlam}',
      '{yanlis_anlam1}',
      '{yanlis_anlam2}',
      '{yanlis_anlam3}'
    ],
    dogru_cevap: '{dogru_anlam}',
    aciklama: 'Venüs\'ün burcu, kişinin estetik zevklerini ve sanatsal yeteneklerini belirler.'
  },
  {
    id: 'venus_hard_1',
    gosterge: 'Venüs',
    zorluk: 'zor',
    soru: 'Venüs burcun {burc} ve evin {ev} olduğunda, aşağıdaki ifadelerden hangisi daha uygundur?',
    secenekler: [
      '{dogru_ifade}',
      '{yanlis_ifade1}',
      '{yanlis_ifade2}',
      '{yanlis_ifade3}'
    ],
    dogru_cevap: '{dogru_ifade}',
    aciklama: 'Venüs\'ün konumu, kişinin ilişkilerde yaşadığı temel dinamikleri gösterir.'
  },

  // MARS SORULARI
  {
    id: 'mars_easy_1',
    gosterge: 'Mars',
    zorluk: 'kolay',
    soru: 'Mars burcun {burc} olduğunda, enerjini nasıl kullanırsın?',
    secenekler: [
      '{dogru_enerji}',
      '{yanlis_enerji1}',
      '{yanlis_enerji2}',
      '{yanlis_enerji3}'
    ],
    dogru_cevap: '{dogru_enerji}',
    aciklama: 'Mars burcu kişinin enerji kullanım tarzını ve motivasyon kaynaklarını gösterir.'
  },
  {
    id: 'mars_medium_1',
    gosterge: 'Mars',
    zorluk: 'orta',
    soru: 'Mars\'ın {ev}. evde olması ne ifade eder?',
    secenekler: [
      '{dogru_ifade}',
      '{yanlis_ifade1}',
      '{yanlis_ifade2}',
      '{yanlis_ifade3}'
    ],
    dogru_cevap: '{dogru_ifade}',
    aciklama: 'Mars\'ın burcu, kişinin fiziksel aktivite tercihlerini ve rekabet tarzını belirler.'
  },
  {
    id: 'mars_hard_1',
    gosterge: 'Mars',
    zorluk: 'zor',
    soru: 'Mars burcun {burc} ve evin {ev} olduğunda, hangi özellik daha baskındır?',
    secenekler: [
      '{dogru_ozellik}',
      '{yanlis_ozellik1}',
      '{yanlis_ozellik2}',
      '{yanlis_ozellik3}'
    ],
    dogru_cevap: '{dogru_ozellik}',
    aciklama: 'Mars\'ın konumu, kişinin çatışma durumlarında nasıl davrandığını gösterir.'
  },

  // JÜPİTER SORULARI
  {
    id: 'jupiter_easy_1',
    gosterge: 'Jüpiter',
    zorluk: 'kolay',
    soru: 'Jüpiter burcun {burc} olduğunda, hangi alanlarda şanslısındır?',
    secenekler: [
      '{dogru_alan}',
      '{yanlis_alan1}',
      '{yanlis_alan2}',
      '{yanlis_alan3}'
    ],
    dogru_cevap: '{dogru_alan}',
    aciklama: 'Jüpiter burcu kişinin en şanslı olduğu alanları ve genişleme fırsatlarını gösterir.'
  },
  {
    id: 'jupiter_medium_1',
    gosterge: 'Jüpiter',
    zorluk: 'orta',
    soru: 'Jüpiter\'in {ev}. evde yer alması ne anlama gelir?',
    secenekler: [
      '{dogru_anlam}',
      '{yanlis_anlam1}',
      '{yanlis_anlam2}',
      '{yanlis_anlam3}'
    ],
    dogru_cevap: '{dogru_anlam}',
    aciklama: 'Jüpiter\'in burcu, kişinin hayat felsefesini ve öğrenme tarzını belirler.'
  },
  {
    id: 'jupiter_hard_1',
    gosterge: 'Jüpiter',
    zorluk: 'zor',
    soru: 'Jüpiter burcun {burc} ve evin {ev} olduğunda, hangi özellik sana daha uygundur?',
    secenekler: [
      '{dogru_ozellik}',
      '{yanlis_ozellik1}',
      '{yanlis_ozellik2}',
      '{yanlis_ozellik3}'
    ],
    dogru_cevap: '{dogru_ozellik}',
    aciklama: 'Jüpiter\'in konumu, kişinin hangi kültürlerle ve yabancı deneyimlerle bağlantılı olduğunu gösterir.'
  },

  // SATÜRN SORULARI
  {
    id: 'saturn_easy_1',
    gosterge: 'Satürn',
    zorluk: 'kolay',
    soru: 'Satürn burcun {burc} olduğunda, hangi özellik daha çok görülür?',
    secenekler: [
      '{dogru_ozellik}',
      '{yanlis_ozellik1}',
      '{yanlis_ozellik2}',
      '{yanlis_ozellik3}'
    ],
    dogru_cevap: '{dogru_ozellik}',
    aciklama: 'Satürn burcu kişinin en çok zorluk yaşadığı alanları ve öğrenmesi gereken dersleri gösterir.'
  },
  {
    id: 'saturn_medium_1',
    gosterge: 'Satürn',
    zorluk: 'orta',
    soru: 'Satürn\'ün {ev}. evde yer alması neyi gösterir?',
    secenekler: [
      '{dogru_gosterge}',
      '{yanlis_gosterge1}',
      '{yanlis_gosterge2}',
      '{yanlis_gosterge3}'
    ],
    dogru_cevap: '{dogru_gosterge}',
    aciklama: 'Satürn\'ün burcu, kişinin en çok sorumluluk aldığı ve başarılı olduğu meslek alanını gösterir.'
  },
  {
    id: 'saturn_hard_1',
    gosterge: 'Satürn',
    zorluk: 'zor',
    soru: 'Satürn burcun {burc} ve evin {ev} olduğunda, aşağıdaki ifadelerden hangisi seni tanımlar?',
    secenekler: [
      '{dogru_tanim}',
      '{yanlis_tanim1}',
      '{yanlis_tanim2}',
      '{yanlis_tanim3}'
    ],
    dogru_cevap: '{dogru_tanim}',
    aciklama: 'Satürn\'ün konumu, kişinin en zorlu yaşam dönemlerini ve öğrenme süreçlerini gösterir.'
  },

  // YÜKSELEN BURÇ SORULARI
  {
    id: 'asc_easy_1',
    gosterge: 'Yükselen',
    zorluk: 'kolay',
    soru: 'Yükselen burcun {burc} olduğunda, dış dünyaya nasıl görünürsün?',
    secenekler: [
      '{dogru_gorunum}',
      '{yanlis_gorunum1}',
      '{yanlis_gorunum2}',
      '{yanlis_gorunum3}'
    ],
    dogru_cevap: '{dogru_gorunum}',
    aciklama: 'Yükselen burç kişinin dış dünyaya nasıl göründüğünü ve ilk izlenimini gösterir.'
  },
  {
    id: 'asc_medium_1',
    gosterge: 'Yükselen',
    zorluk: 'orta',
    soru: 'Yükselen burcun {burc} olduğunda, hangi meslekte başarılı olman daha olasıdır?',
    secenekler: [
      '{dogru_meslek}',
      '{yanlis_meslek1}',
      '{yanlis_meslek2}',
      '{yanlis_meslek3}'
    ],
    dogru_cevap: '{dogru_meslek}',
    aciklama: 'Yükselen burç kişinin hangi tür insanlarla kolayca iletişim kurduğunu gösterir.'
  },
  {
    id: 'asc_hard_1',
    gosterge: 'Yükselen',
    zorluk: 'zor',
    soru: 'Yükselen burcun {burc} olduğunda, sosyal ilişkilerinde hangi tutum öne çıkar?',
    secenekler: [
      '{dogru_tutum}',
      '{yanlis_tutum1}',
      '{yanlis_tutum2}',
      '{yanlis_tutum3}'
    ],
    dogru_cevap: '{dogru_tutum}',
    aciklama: 'Yükselen burç kişinin hangi yaşam alanında en çok gelişim ve değişim yaşadığını gösterir.'
  }
];

// Burç özellikleri veritabanı - her burç için doğru ve yanlış cevaplar
export const burcOzellikleri: Record<string, Record<string, string>> = {
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