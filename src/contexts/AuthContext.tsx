import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'personal' | 'student') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = storage.get<User>(STORAGE_KEYS.USER);
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string, role: 'personal' | 'student') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newUser: User = {
      id: role === 'personal' ? 'personal1' : 'student1',
      name: role === 'personal' ? 'Personal Trainer' : 'Aluno Demo',
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      createdAt: new Date(),
    };

    setUser(newUser);
    storage.set(STORAGE_KEYS.USER, newUser);
  };

  const logout = () => {
    setUser(null);
    storage.remove(STORAGE_KEYS.USER);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
