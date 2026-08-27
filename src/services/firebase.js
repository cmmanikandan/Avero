import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock_firebase_api_key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'avero-marketplace.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'avero-marketplace',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'avero-marketplace.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:mockappid123456',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-MOCKMEASURE'
};

// Initialize Firebase App instance safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Real Live Firebase Authentication Service
 */
export const firebaseAuthService = {
  /**
   * Real Live Google 1-Click Popup Sign-In
   */
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=1366E2&color=fff`,
        emailVerified: user.emailVerified,
        token: idToken,
        provider: 'google.com'
      };
    } catch (error) {
      console.error('[Firebase Auth] Google Sign-In Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google Sign-In popup was closed before completing.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Google Sign-In request was cancelled.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Google popup was blocked by your browser. Please allow popups.');
      } else if (error.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'your deployed domain';
        throw new Error(`Domain "${domain}" is not authorized. Add "${domain}" in Firebase Console > Authentication > Settings > Authorized domains.`);
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google Sign-In is not enabled in your Firebase project. Enable "Google" under Firebase Console > Authentication > Sign-in method.');
      } else if (error.code === 'auth/invalid-api-key' || error.code === 'auth/api-key-not-valid' || error.code === 'auth/configuration-not-found') {
        throw new Error('Firebase environment variables (VITE_FIREBASE_API_KEY, etc.) are missing or invalid in your deployment settings.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error during Google Sign-In. Please check your internet connection and try again.');
      }
      throw new Error(error.message || 'Google Sign-In failed. Please check your Firebase configuration.');
    }
  },

  /**
   * Real Live Email/Password Sign-In
   */
  async signInWithEmailAndPassword(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=1366E2&color=fff`,
        emailVerified: user.emailVerified,
        token: idToken
      };
    } catch (error) {
      console.error('[Firebase Auth] Email Login Error:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        throw new Error('Incorrect email or password. Please check your credentials.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Access to this account has been temporarily disabled due to many failed login attempts. Reset your password or try again later.');
      }
      throw error;
    }
  },

  /**
   * Real Live Create New User with Email and Password
   */
  async createUserWithEmailAndPassword(email, password, displayName = '') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (displayName) {
        await updateProfile(user, {
          displayName,
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1366E2&color=fff`
        });
      }

      // Send Email Verification
      try {
        await sendEmailVerification(user);
      } catch (_) {}

      const idToken = await user.getIdToken();

      return {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || user.email)}&background=1366E2&color=fff`,
        emailVerified: user.emailVerified,
        token: idToken
      };
    } catch (error) {
      console.error('[Firebase Auth] User Registration Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account already exists with this email. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      }
      throw error;
    }
  },

  /**
   * Real Live Password Reset Email Dispatcher
   */
  async sendPasswordResetEmail(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, email };
    } catch (error) {
      console.error('[Firebase Auth] Reset Password Error:', error);
      if (error.code === 'auth/user-not-found') {
        throw new Error('No user account found with this email address.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      throw error;
    }
  },

  /**
   * Real Live Sign Out
   */
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('[Firebase Auth] Sign Out Error:', error);
      return { success: true };
    }
  },

  /**
   * Listen to Live Auth State Changes
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
};
