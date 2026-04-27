import * as AppleAuthentication from 'expo-apple-authentication';

import { isSupabaseConfigured } from '@/src/lib/env';
import { supabase } from '@/src/lib/supabase/client';

export async function signInWithAppleIdToken() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase ist noch nicht konfiguriert. Offline-Modus ist verfügbar.');
  }

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error('Apple hat kein identityToken zurückgegeben.');
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
  });

  if (error) throw error;
  return data;
}
