import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, GameProgress } from '../types';

const STORAGE_KEYS = {
  USER: 'astrokacis_user',
  GAME_PROGRESS: 'astrokacis_game_progress',
  SETTINGS: 'astrokacis_settings',
  HIGH_SCORE: 'astrokacis_high_score',
};

export const storageService = {
  // User Storage
  saveUser: async (user: User): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  getUser: async (): Promise<User | null> => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  clearUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  },

  // Game Progress Storage
  saveGameProgress: async (progress: GameProgress): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GAME_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving game progress:', error);
    }
  },

  getGameProgress: async (): Promise<GameProgress | null> => {
    try {
      const progressData = await AsyncStorage.getItem(STORAGE_KEYS.GAME_PROGRESS);
      return progressData ? JSON.parse(progressData) : null;
    } catch (error) {
      console.error('Error getting game progress:', error);
      return null;
    }
  },

  updateGameProgress: async (updates: Partial<GameProgress>): Promise<void> => {
    try {
      const currentProgress = await storageService.getGameProgress();
      const updatedProgress = { ...currentProgress, ...updates };
      await storageService.saveGameProgress(updatedProgress as GameProgress);
    } catch (error) {
      console.error('Error updating game progress:', error);
    }
  },

  // Settings Storage
  saveSettings: async (settings: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  getSettings: async (): Promise<any> => {
    try {
      const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settingsData ? JSON.parse(settingsData) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  },

  // High Score Storage
  saveHighScore: async (score: number): Promise<void> => {
    try {
      const currentHighScore = await storageService.getHighScore();
      if (score > currentHighScore) {
        await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
      }
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  },

  getHighScore: async (): Promise<number> => {
    try {
      const highScoreData = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
      return highScoreData ? parseInt(highScoreData, 10) : 0;
    } catch (error) {
      console.error('Error getting high score:', error);
      return 0;
    }
  },

  // Clear All Data
  clearAllData: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.GAME_PROGRESS,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.HIGH_SCORE,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
}; 