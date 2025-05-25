import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const BASE_URL = 'https://localhost:7073';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (token && refreshToken) {
      setUser({ token, refreshToken });
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      console.log('Attempting sign in with:', email);
      const response = await fetch(`${BASE_URL}/auth/sign-in?Login=${encodeURIComponent(email)}&Password=${encodeURIComponent(password)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '6131',
        },
      });

      console.log('Sign in response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Sign in failed with status:', response.status, 'Error:', errorText);
        throw new Error('Sign in failed');
      }

      const data = await response.json();
      console.log('Sign in successful:', data);
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshTokem);
      
      setUser({ 
        token: data.accessToken, 
        refreshToken: data.refreshTokem,
        expirationTime: data.expirationTime
      });
      
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email, password) => {
    try {
      console.log('Attempting sign up with:', email);
      const response = await fetch(`${BASE_URL}/auth/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '6131',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      console.log('Sign up response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Sign up failed with status:', response.status, 'Error:', errorText);
        throw new Error('Sign up failed');
      }

      console.log('Sign up successful');
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await fetch(`${BASE_URL}/auth/token/refresh?RefreshToken=${encodeURIComponent(refreshToken)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '6131',
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      localStorage.setItem('accessToken', data.accessToken);
      
      setUser(prev => ({ 
        ...prev, 
        token: data.accessToken,
        expirationTime: data.expirationDate
      }));
      
      return data.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      signOut();
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};