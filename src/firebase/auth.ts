
import { 
  Auth,
  UserCredential,
  createUserWithEmailAndPassword as firebaseCreateUser, 
  signInWithEmailAndPassword as firebaseSignIn, 
  signOut as firebaseSignOut, 
  GoogleAuthProvider as FirebaseGoogleProvider, 
  signInWithPopup as firebaseSignInWithPopup,
  User,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { logError } from '../services/monitoring';

// Create user with email and password
export const registerWithEmail = async (
  email: string, 
  password: string, 
  name: string
) => {
  try {
    const userCredential = await firebaseCreateUser(auth, email, password);
    const user = userCredential.user;
    
    // Create a user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      createdAt: new Date(),
      isAdmin: false,
    });
    
    return user;
  } catch (error) {
    logError(error as Error, { context: 'registerWithEmail' });
    throw error;
  }
};

// Sign in with email and password
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await firebaseSignIn(auth, email, password);
    return userCredential.user;
  } catch (error) {
    logError(error as Error, { context: 'loginWithEmail' });
    throw error;
  }
};

// Sign in with Google
export const loginWithGoogle = async () => {
  try {
    const provider = new FirebaseGoogleProvider();
    const userCredential = await firebaseSignInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user exists in Firestore, if not create a new document
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        createdAt: new Date(),
        isAdmin: false,
      });
    }
    
    return user;
  } catch (error) {
    logError(error as Error, { context: 'loginWithGoogle' });
    throw error;
  }
};

// Sign out
export const logout = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    logError(error as Error, { context: 'logout' });
    throw error;
  }
};

// Check if user is admin
export const checkUserIsAdmin = async (user: User) => {
  if (!user) return false;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.isAdmin === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    logError(error as Error, { context: 'checkUserIsAdmin' });
    return false;
  }
};

// Get user data including admin status
export const getUserData = async (user: User) => {
  if (!user) return null;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    logError(error as Error, { context: 'getUserData' });
    return null;
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};
