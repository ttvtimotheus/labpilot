import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

import { env, isSupabaseConfigured } from '@/src/lib/env';
import { supabase } from '@/src/lib/supabase/client';

let configured = false;

export function isGoogleSignInConfigured() {
  const hasWebClientId = Boolean(env.googleWebClientId);
  const hasIosClientId = Platform.OS !== 'ios' || Boolean(env.googleIosClientId);

  return hasWebClientId && hasIosClientId;
}

export function configureGoogleSignIn() {
  if (configured) return;
  if (!isGoogleSignInConfigured()) return;

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

  if (!isGoogleSignInConfigured()) {
    throw new Error(
      Platform.OS === 'ios'
        ? 'Google-Anmeldung ist auf iOS noch nicht konfiguriert. Hinterlege EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID und EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID.'
        : 'Google-Anmeldung ist noch nicht konfiguriert. Hinterlege EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.'
    );
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
