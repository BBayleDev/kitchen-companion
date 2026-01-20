import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserCredentials, SignUpData } from '@/types/user';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: UserCredentials) => Promise<{ error?: string }>;
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'recipe_app_users';
const SESSION_KEY = 'recipe_app_session';

const getStoredUsers = (): Array<User & { password: string }> => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: Array<User & { password: string }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getSession = (): User | null => {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const saveSession = (user: User | null) => {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = getSession();
    if (session) {
      setUser(session);
    }
    setIsLoading(false);
  }, []);

  const signIn = async (credentials: UserCredentials): Promise<{ error?: string }> => {
    const users = getStoredUsers();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (!foundUser) {
      return { error: 'No account found with this email address' };
    }

    if (foundUser.password !== credentials.password) {
      return { error: 'Incorrect password' };
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    saveSession(userWithoutPassword);
    
    toast({
      title: "Welcome back!",
      description: `Signed in as ${userWithoutPassword.pseudo}`,
    });

    return {};
  };

  const signUp = async (data: SignUpData): Promise<{ error?: string }> => {
    const users = getStoredUsers();
    
    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { error: 'An account with this email already exists' };
    }

    // Check if pseudo already exists
    if (users.some((u) => u.pseudo.toLowerCase() === data.pseudo.toLowerCase())) {
      return { error: 'This username is already taken' };
    }

    const newUser: User & { password: string } = {
      id: crypto.randomUUID(),
      email: data.email,
      pseudo: data.pseudo,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'user',
      password: data.password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    saveSession(userWithoutPassword);

    toast({
      title: "Account created!",
      description: `Welcome, ${userWithoutPassword.pseudo}!`,
    });

    return {};
  };

  const signOut = () => {
    setUser(null);
    saveSession(null);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
