export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'achievement' | 'progress' | 'special';
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  level?: 'bronze' | 'silver' | 'gold';
}

export interface AchievementBadge extends Badge {
  category: 'achievement';
  targetId: string; // gezegen/burç/element adı
  stars: number; // 1, 2, veya 3 yıldız
  maxStars: number;
}

export interface ProgressBadge extends Badge {
  category: 'progress';
  currentCount: number;
  requiredCount: number;
}

export interface SpecialBadge extends Badge {
  category: 'special';
  condition: string;
  completed: boolean;
}

export interface UserBadges {
  userId: string;
  badges: Badge[];
  totalBadges: number;
  unlockedBadges: number;
} 