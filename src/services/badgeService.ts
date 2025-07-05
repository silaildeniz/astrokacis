import { Badge, AchievementBadge, ProgressBadge, SpecialBadge, UserBadges } from '../types/badgeTypes';
import { saveGameProgress, getGameProgress } from '../firebase/firestoreService';

// Başarı rozetleri - her gezegen/burç/element için
export const createAchievementBadge = (targetId: string, stars: number): AchievementBadge => {
  const getBadgeInfo = (targetId: string, stars: number) => {
    const levels = {
      1: { name: 'Adayı', color: '#CD7F32', icon: '🥉' },
      2: { name: 'Öğrencisi', color: '#C0C0C0', icon: '🥈' },
      3: { name: 'Ustası', color: '#FFD700', icon: '🥇' }
    };
    
    return {
      name: `${targetId} ${levels[stars as keyof typeof levels].name}`,
      description: `${targetId} ile ilgili ${stars}/3 yıldız başarısı`,
      color: levels[stars as keyof typeof levels].color,
      icon: levels[stars as keyof typeof levels].icon
    };
  };

  const info = getBadgeInfo(targetId, stars);
  
  return {
    id: `${targetId.toLowerCase()}_${stars}_stars`,
    name: info.name,
    description: info.description,
    category: 'achievement',
    icon: info.icon,
    color: info.color,
    unlocked: false,
    targetId,
    stars,
    maxStars: 3,
    level: stars === 1 ? 'bronze' : stars === 2 ? 'silver' : 'gold'
  };
};

// İlerleme rozetleri
export const progressBadges: ProgressBadge[] = [
  {
    id: 'planet_collector',
    name: 'Gezegen Koleksiyoncusu',
    description: '5 gezegeni tamamla',
    category: 'progress',
    icon: '🏆',
    color: '#FFD700',
    unlocked: false,
    currentCount: 0,
    requiredCount: 5
  },
  {
    id: 'zodiac_expert',
    name: 'Burç Uzmanı',
    description: '6 burcu tamamla',
    category: 'progress',
    icon: '🌟',
    color: '#FFD700',
    unlocked: false,
    currentCount: 0,
    requiredCount: 6
  },
  {
    id: 'element_master',
    name: 'Element Ustası',
    description: '3 elementi tamamla',
    category: 'progress',
    icon: '🌪️',
    color: '#FFD700',
    unlocked: false,
    currentCount: 0,
    requiredCount: 3
  },
  {
    id: 'astrology_student',
    name: 'Astroloji Öğrencisi',
    description: '10 toplam tamamlama',
    category: 'progress',
    icon: '🎓',
    color: '#FFD700',
    unlocked: false,
    currentCount: 0,
    requiredCount: 10
  }
];

// Özel rozetler
export const specialBadges: SpecialBadge[] = [
  {
    id: 'fast_thinker',
    name: 'Hızlı Düşünür',
    description: '10 soruya 30 saniyede cevap ver',
    category: 'special',
    icon: '⚡',
    color: '#FFD700',
    unlocked: false,
    condition: 'speed_challenge',
    completed: false
  },
  {
    id: 'sharp_eye',
    name: 'Keskin Göz',
    description: 'Hiç ipucu kullanmadan tamamla',
    category: 'special',
    icon: '🎯',
    color: '#FFD700',
    unlocked: false,
    condition: 'no_hints',
    completed: false
  },
  {
    id: 'fire_master',
    name: 'Ateşli',
    description: 'Tüm ateş burçlarını mükemmel tamamla',
    category: 'special',
    icon: '🔥',
    color: '#FF4444',
    unlocked: false,
    condition: 'fire_perfect',
    completed: false
  },
  {
    id: 'water_master',
    name: 'Su Gibi',
    description: 'Tüm su burçlarını mükemmel tamamla',
    category: 'special',
    icon: '💧',
    color: '#4444FF',
    unlocked: false,
    condition: 'water_perfect',
    completed: false
  },
  {
    id: 'air_master',
    name: 'Hava Gibi',
    description: 'Tüm hava burçlarını mükemmel tamamla',
    category: 'special',
    icon: '🌪️',
    color: '#FFFFFF',
    unlocked: false,
    condition: 'air_perfect',
    completed: false
  },
  {
    id: 'earth_master',
    name: 'Toprak Gibi',
    description: 'Tüm toprak burçlarını mükemmel tamamla',
    category: 'special',
    icon: '🌱',
    color: '#44FF44',
    unlocked: false,
    condition: 'earth_perfect',
    completed: false
  }
];

// Rozet kontrolü ve güncelleme
export const checkAndUpdateBadges = async (userId: string, gameData: any) => {
  try {
    const userBadges = await getUserBadges(userId);
    const newBadges: Badge[] = [];
    
    // Başarı rozetlerini kontrol et - Gezegenler
    if (gameData.planetScores) {
      Object.entries(gameData.planetScores).forEach(([planet, score]: [string, any]) => {
        const stars = calculateStars(score);
        const badge = createAchievementBadge(planet, stars);
        if (!userBadges.badges.find((b: Badge) => b.id === badge.id)) {
          badge.unlocked = true;
          badge.unlockedAt = new Date();
          newBadges.push(badge);
        }
      });
    }
    
    // Başarı rozetlerini kontrol et - Burçlar
    if (gameData.zodiacScores) {
      Object.entries(gameData.zodiacScores).forEach(([zodiac, score]: [string, any]) => {
        const stars = calculateStars(score);
        const badge = createAchievementBadge(zodiac, stars);
        if (!userBadges.badges.find((b: Badge) => b.id === badge.id)) {
          badge.unlocked = true;
          badge.unlockedAt = new Date();
          newBadges.push(badge);
        }
      });
    }
    
    // Başarı rozetlerini kontrol et - Elementler
    if (gameData.elementScores) {
      Object.entries(gameData.elementScores).forEach(([element, score]: [string, any]) => {
        const stars = calculateStars(score);
        const badge = createAchievementBadge(element, stars);
        if (!userBadges.badges.find((b: Badge) => b.id === badge.id)) {
          badge.unlocked = true;
          badge.unlockedAt = new Date();
          newBadges.push(badge);
        }
      });
    }
    
    // Başarı rozetlerini kontrol et - Evler
    if (gameData.houseScores) {
      Object.entries(gameData.houseScores).forEach(([house, score]: [string, any]) => {
        const stars = calculateStars(score);
        const badge = createAchievementBadge(`${house}. Ev`, stars);
        if (!userBadges.badges.find((b: Badge) => b.id === badge.id)) {
          badge.unlocked = true;
          badge.unlockedAt = new Date();
          newBadges.push(badge);
        }
      });
    }
    
    // İlerleme rozetlerini kontrol et
    const totalPlanets = gameData.completedPlanets?.length || 0;
    const totalZodiacs = gameData.completedZodiacs?.length || 0;
    const totalElements = gameData.completedElements?.length || 0;
    const totalHouses = gameData.completedHouses?.length || 0;
    const totalCompletions = totalPlanets + totalZodiacs + totalElements + totalHouses;
    
    progressBadges.forEach(badge => {
      let currentCount = 0;
      switch (badge.id) {
        case 'planet_collector':
          currentCount = totalPlanets;
          break;
        case 'zodiac_expert':
          currentCount = totalZodiacs;
          break;
        case 'element_master':
          currentCount = totalElements;
          break;
        case 'astrology_student':
          currentCount = totalCompletions;
          break;
      }
      
      if (currentCount >= badge.requiredCount && !badge.unlocked) {
        badge.unlocked = true;
        badge.unlockedAt = new Date();
        newBadges.push(badge);
      }
    });
    
    // Yeni rozetler varsa kaydet
    if (newBadges.length > 0) {
      await mergeUserBadges(userId, newBadges);
    }
    
    return newBadges;
  } catch (error) {
    console.error('Rozet kontrolü hatası:', error);
    return [];
  }
};

// Kullanıcı rozetlerini mevcut ilerlemeye ekle (diğer progress alanlarını silmeden)
export const mergeUserBadges = async (userId: string, newBadges: Badge[]) => {
  try {
    const progress = await getGameProgress(userId);
    const currentBadges: Badge[] = progress.badges || [];
    const merged = [...currentBadges, ...newBadges];
    await saveGameProgress(userId, { ...progress, badges: merged });
  } catch (error) {
    console.error('Rozet birleştirme hatası:', error);
  }
};

// Yıldız hesaplama
export const calculateStars = (score: any): number => {
  if (!score || typeof score !== 'object') return 0;
  
  const totalQuestions = score.totalQuestions || 3;
  const correctAnswers = score.correctAnswers || 0;
  const wrongAnswers = score.wrongAnswers || 0;
  
  if (wrongAnswers === 0) return 3; // Mükemmel
  if (wrongAnswers === 1) return 2; // İyi
  return 1; // Geçer
};

// Kullanıcı rozetlerini getir
export const getUserBadges = async (userId: string): Promise<UserBadges> => {
  try {
    const progress = await getGameProgress(userId);
    return {
      userId,
      badges: progress.badges || [],
      totalBadges: progress.badges?.length || 0,
      unlockedBadges: progress.badges?.filter((b: Badge) => b.unlocked).length || 0
    };
  } catch (error) {
    console.error('Rozet getirme hatası:', error);
    return {
      userId,
      badges: [],
      totalBadges: 0,
      unlockedBadges: 0
    };
  }
};

// Kullanıcı rozetlerini kaydet
export const saveUserBadges = async (userId: string, badges: Badge[]) => {
  try {
    await saveGameProgress(userId, { badges });
  } catch (error) {
    console.error('Rozet kaydetme hatası:', error);
  }
}; 