'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const changeEmail = (newEmail) =>
    auth.currentUser ? auth.currentUser.updateEmail(newEmail) : Promise.reject('No user');

  const changePassword = (newPassword) =>
    auth.currentUser ? auth.currentUser.updatePassword(newPassword) : Promise.reject('No user');

  const resetPassword = (email) =>
    sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        changeEmail,
        changePassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
