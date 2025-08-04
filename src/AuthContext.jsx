import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
const base_url = process.env.REACT_APP_BASE_URL;
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('isAuthenticated'); //why doule negation?
    // This checks if 'isAuthenticated' exists in localStorage and returns true or false
  });

  const login = () => {    
    localStorage.setItem('isAuthenticated', true);
    setIsAuthenticated(true);

    // axios.get(`${base_url}/login`) 
    //   .then(response => {
    //         localStorage.setItem('isAuthenticated', 'true');
    //         setIsAuthenticated(true);
    //         localStorage.setItem('user', JSON.stringify(response.data));
    //   })
    //   .catch(error => {
    //     console.error("Login failed:", error);
    //     localStorage.removeItem('isAuthenticated');
    //     setIsAuthenticated(false);
    //   });
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
