import { db } from './firebaseConfig';
import { collection, addDoc, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export const addUser = async (userData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), userData);
    return docRef.id;
  } catch (e) {
    throw e;
  }
};

export const sendEmail = async (emailData: { to: string; subject: string; body: string }) => {
  try {
    const docRef = await addDoc(collection(db, 'emails'), {
      ...emailData,
      timestamp: new Date(),
      status: 'pending'
    });
    return docRef.id;
  } catch (e) {
    throw e;
  }
};

// Oyun ilerlemesi kaydetme fonksiyonları
export const saveGameProgress = async (userId: string, progressData: {
  completedPlanets?: string[];
  completedZodiacs?: string[];
  completedElements?: string[];
  completedHouses?: number[];
  planetScores?: any;
  zodiacScores?: any;
  elementScores?: any;
  houseScores?: any;
  badges?: any[];
  totalScore?: number;
  lastUpdated?: Date;
}) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...progressData,
      lastUpdated: new Date()
    }, { merge: true });
  } catch (e) {
    console.error('Oyun ilerlemesi kaydedilemedi:', e);
    throw e;
  }
};

export const getGameProgress = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return {
        completedPlanets: [],
        completedZodiacs: [],
        totalScore: 0,
        lastUpdated: null
      };
    }
  } catch (e) {
    console.error('Oyun ilerlemesi alınamadı:', e);
    return {
      completedPlanets: [],
      completedZodiacs: [],
      totalScore: 0,
      lastUpdated: null
    };
  }
};

export const updateUserScore = async (userId: string, newScore: number) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalScore: newScore,
      lastUpdated: new Date()
    });
  } catch (e) {
    console.error('Puan güncellenemedi:', e);
    throw e;
  }
}; 