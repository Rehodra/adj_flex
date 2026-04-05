import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hardcoded Demo User for standalone frontend deployment
  const [user, setUser] = useState<User | null>({
    id: "demo_advocate_001",
    email: "advocate@adjournment.ai",
    name: "Demo Advocate",
    picture: "https://ui-avatars.com/api/?name=Demo+Advocate&background=2563eb&color=fff"
  });

  useEffect(() => {
    // We keep this empty for demo mode to ignore local storage redirects
  }, []);

  const login = (token: string, userData: User) => {
    console.log("Login triggered with token:", token);
    setUser(userData);
  };

  const logout = () => {
    // In demo mode, logout does nothing or resets to demo user
    console.log("Logout triggered in demo mode");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: true, login, logout }}>
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
