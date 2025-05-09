import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem('authToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/validate', {
          method: 'GET',
          headers: {
            'token': token
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          sessionStorage.removeItem('authToken');
          
          // Only redirect if not already on login page
          if (router.pathname !== '/admin' && router.pathname.startsWith('/admin')) {
            router.push('/admin');
          }
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        setIsAuthenticated(false);
        sessionStorage.removeItem('authToken');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const login = (token) => {
    sessionStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    const token = sessionStorage.getItem('authToken');
    
    if (token) {
      try {
        // Optional: Invalidate token on server
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    sessionStorage.removeItem('authToken');
    setIsAuthenticated(false);
    router.push('/admin');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}