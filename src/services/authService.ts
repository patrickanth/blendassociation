import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase';

// Tipo User semplificato
export interface AuthUser {
  uid: string;
  email: string;
  isAdmin: boolean;
}

// Stato globale semplice
let currentUser: AuthUser | null = null;
let authInitialized = false;
const authStateCallbacks: ((user: AuthUser | null) => void)[] = [];

// Lista admin (può essere estesa in futuro)
const ADMIN_EMAILS = process.env.REACT_APP_ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];

class AuthService {
  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        // Verifica se è admin senza chiamare il database
        const isAdmin = ADMIN_EMAILS.includes(firebaseUser.email.toLowerCase());
        
        if (isAdmin) {
          currentUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            isAdmin: true
          };
        } else {
          // Non è admin, logout automatico
          currentUser = null;
          signOut(auth);
        }
      } else {
        currentUser = null;
      }

      authInitialized = true;
      this.notifyListeners();
    });
  }

  async login(email: string, password: string): Promise<AuthUser> {
    try {
      // Verifica prima se l'email è nella lista admin
      if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
        throw new Error('Accesso negato. Solo gli amministratori possono accedere.');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.email) {
        throw new Error('Email non verificata');
      }

      currentUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        isAdmin: true
      };

      return currentUser;

    } catch (error: any) {
      console.error('Errore login:', error);
      
      // Messaggi di errore user-friendly
      if (error.code === 'auth/user-not-found') {
        throw new Error('Email non trovata');
      }
      if (error.code === 'auth/wrong-password') {
        throw new Error('Password errata');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('Email non valida');
      }
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Troppi tentativi. Riprova tra qualche minuto');
      }
      
      throw new Error(error.message || 'Errore durante il login');
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      currentUser = null;
      this.notifyListeners();
    } catch (error) {
      console.error('Errore logout:', error);
      throw error;
    }
  }

  getCurrentUser(): AuthUser | null {
    return currentUser;
  }

  isAuthenticated(): boolean {
    return currentUser !== null;
  }

  isInitialized(): boolean {
    return authInitialized;
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    authStateCallbacks.push(callback);
    
    // Se già inizializzato, notifica subito
    if (authInitialized) {
      callback(currentUser);
    }
    
    // Cleanup function
    return () => {
      const index = authStateCallbacks.indexOf(callback);
      if (index > -1) {
        authStateCallbacks.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    authStateCallbacks.forEach(callback => {
      try {
        callback(currentUser);
      } catch (error) {
        console.error('Errore in auth listener:', error);
      }
    });
  }
}

// Singleton
export const authService = new AuthService();