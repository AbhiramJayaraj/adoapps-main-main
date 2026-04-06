import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Mock configuration for MVP development
// In production, these should be environment variables (e.g. import.meta.env.VITE_FIREBASE_API_KEY)
const firebaseConfig = {
  apiKey: "MOCK_API_KEY",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "mock-project",
  storageBucket: "mock-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Mock utility for Health Modes and User persistence for now
export const getMockUserProfile = () => {
  return {
    id: "user123",
    name: "Arjun",
    age: 45,
    weight: 80,
    healthMode: "Diabetes Mode",
    goals: "Manage blood sugar, lose 5kg."
  }
};
