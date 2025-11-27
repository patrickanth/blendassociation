import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { authService, AuthUser } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Sottoscrivi ai cambiamenti di auth
    const unsubscribe = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
      setIsLoading(false);
    });

    // Se già inizializzato, aggiorna subito lo stato
    if (authService.isInitialized()) {
      setUser(authService.getCurrentUser());
      setIsLoading(false);
    }

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await authService.login(email, password);
    } catch (err: any) {
      setError(err.message || 'Errore durante il login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (err: any) {
      setError(err.message || 'Errore durante il logout');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoizza i valori derivati per evitare ricalcoli
  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    error,
    login,
    logout,
    clearError
  }), [user, isLoading, error, login, logout, clearError]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizzato con controllo del contesto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato all\'interno di AuthProvider');
  }
  return context;
};

// Hook per verificare rapidamente se l'utente è admin
export const useIsAdmin = (): boolean => {
  const { isAdmin } = useAuth();
  return isAdmin;
};

// Hook per proteggere componenti admin
export const useRequireAdmin = () => {
  const { isAdmin, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      // Redirect se non admin
      window.location.href = '/admin/login';
    }
  }, [isAdmin, isLoading]);

  return { isAdmin, isLoading };
};