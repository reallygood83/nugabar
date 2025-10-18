'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isDevMode: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  isDevMode: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

  useEffect(() => {
    // 개발 모드에서는 더미 사용자 생성
    if (isDevMode) {
      const dummyUser = {
        uid: 'dev-user-123',
        email: 'dev@nugabar.com',
        displayName: '개발자 테스트',
      } as User;
      setUser(dummyUser);
      setLoading(false);
      return;
    }

    // 프로덕션 모드에서는 실제 Firebase 인증 사용
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDevMode]);

  const signInWithGoogle = async () => {
    if (isDevMode) {
      console.log('개발 모드: Google 로그인 시뮬레이션');
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google 로그인 실패:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (isDevMode) {
      console.log('개발 모드: 로그아웃 시뮬레이션');
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, isDevMode }}>
      {children}
    </AuthContext.Provider>
  );
}
