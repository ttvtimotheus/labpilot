import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { env, isSupabaseConfigured } from '@/src/lib/env';
import { supabase } from '@/src/lib/supabase/client';

let configured = false;

export function configureGoogleSignIn() {
  if (configured) return;

  GoogleSignin.configure({
    webClientId: env.googleWebClientId || undefined,
    iosClientId: env.googleIosClientId || undefined,
  });
  configured = true;
}

export async function signInWithGoogleIdToken() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase ist noch nicht konfiguriert. Offline-Modus ist verfügbar.');
  }

  configureGoogleSignIn();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const result = await GoogleSignin.signIn();
  const idToken = result.data?.idToken;

  if (!idToken) {
    throw new Error('Google hat kein idToken zurückgegeben.');
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });

  if (error) throw error;
  return data;
}
