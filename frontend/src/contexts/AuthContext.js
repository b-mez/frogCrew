import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Call the mock login API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // For testing - toggle between admin and regular user roles
  const toggleUserRole = () => {
    if (user) {
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // For testing purposes - auto-login with credentials if no user
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !loading) {
      // Hard-code admin user for development
      const adminUser = {
        id: 3,
        name: 'Jack Admn',
        email: 'admin@example.com',
        role: 'ADMIN',
        token: 'fake-jwt-token'
      };
      
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
    }
  }, [loading]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        toggleUserRole,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 