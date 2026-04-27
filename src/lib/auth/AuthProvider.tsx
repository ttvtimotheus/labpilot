import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';

import { signInWithAppleIdToken } from '@/src/lib/auth/apple';
import { configureGoogleSignIn, signInWithGoogleIdToken } from '@/src/lib/auth/google';
import { configurePurchases } from '@/src/lib/purchases';
import { appStorage } from '@/src/lib/storage/mmkv';
import { supabase } from '@/src/lib/supabase/client';
import { isSupabaseConfigured } from '@/src/lib/env';

interface AuthContextValue {
  isReady: boolean;
  isSignedIn: boolean;
  isGuest: boolean;
  session: Session | null;
  userId: string;
  error: string | null;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  continueOffline: () => void;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const guestStorageKey = 'auth.guestMode';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setGuest] = useState(() => appStorage.getBoolean(guestStorageKey) ?? false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    configureGoogleSignIn();

    if (!isSupabaseConfigured) {
      setReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setGuest(false);
      appStorage.remove(guestStorageKey);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const userId = session?.user.id ?? (isGuest ? 'local-user' : null);
    if (userId) {
      configurePurchases(userId);
    }
  }, [isGuest, session?.user.id]);

  const runAuthAction = useCallback(async (action: () => Promise<unknown>) => {
    setError(null);
    try {
      await action();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Anmeldung fehlgeschlagen.');
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const signedIn = Boolean(session) || isGuest;

    return {
      isReady,
      isSignedIn: signedIn,
      isGuest,
      session,
      userId: session?.user.id ?? 'local-user',
      error,
      signInWithApple: () => runAuthAction(signInWithAppleIdToken),
      signInWithGoogle: () => runAuthAction(signInWithGoogleIdToken),
      continueOffline: () => {
        appStorage.set(guestStorageKey, true);
        setGuest(true);
        setError(null);
      },
      signOut: async () => {
        setError(null);
        appStorage.remove(guestStorageKey);
        setGuest(false);
        if (isSupabaseConfigured) {
          await supabase.auth.signOut();
        }
        setSession(null);
      },
      clearError: () => setError(null),
    };
  }, [error, isGuest, isReady, runAuthAction, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
