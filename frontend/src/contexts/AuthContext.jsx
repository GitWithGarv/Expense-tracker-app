import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils/fetcher';
import { http } from '../utils/http';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useSWR('/api/user/session', fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  const session = error ? null : data;

  const value = {
    session,
    isLoading,
    logout: async () => {
      try {
        await http.post('/api/user/logout');
      } catch (err) {
        console.error("Logout error", err);
      } finally {
        mutate('/api/user/session', null, false);
        navigate('/', { replace: true });
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
