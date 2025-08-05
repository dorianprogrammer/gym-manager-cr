import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, getDocs, collection, query, orderBy } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0Kz6-aEZlx5dS1kDyx2c_Hkyhky04kH8",
  authDomain: "gymmanager-192c3.firebaseapp.com",
  projectId: "gymmanager-192c3",
  storageBucket: "gymmanager-192c3.firebasestorage.app",
  messagingSenderId: "1013033051012",
  appId: "1:1013033051012:web:533abb0f6d6fd65092b3d1",
  measurementId: "G-QDV8ZXEMHK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

export const getMembers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "members"));
    const members = [];
    querySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() });
    });
    return { members, error: null };
  } catch (error) {
    console.error("Error fetching members:", error);
    return { members: [], error: error.message };
  }
};

export const getCheckIns = async (memberId = null) => {
  try {
    let q = collection(db, "checkins");
    if (memberId) {
      q = query(q, where("memberId", "==", memberId));
    }
    q = query(q, orderBy("timestamp", "desc"));

    const querySnapshot = await getDocs(q);
    const checkins = [];
    querySnapshot.forEach((doc) => {
      checkins.push({ id: doc.id, ...doc.data() });
    });
    return { checkins, error: null };
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    return { checkins: [], error: error.message };
  }
};

export const getPayments = async (memberId = null) => {
  try {
    let q = collection(db, "payments");
    if (memberId) {
      q = query(q, where("memberId", "==", memberId));
    }
    q = query(q, orderBy("date", "desc"));

    const querySnapshot = await getDocs(q);
    const payments = [];
    querySnapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() });
    });
    return { payments, error: null };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return { payments: [], error: error.message };
  }
};
