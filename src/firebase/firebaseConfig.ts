import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDOIyR8HbO77tTho92iHpRtDvaMfNUOflo",
  authDomain: "astrokacis.firebaseapp.com",
  projectId: "astrokacis",
  storageBucket: "astrokacis.firebasestorage.app",
  messagingSenderId: "557703824357",
  appId: "1:557703824357:web:5d4d604906c1469fe9250c",
  measurementId: "G-B5MVM9PMMQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 