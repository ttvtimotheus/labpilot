import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Sentry from '@sentry/react-native';
import { useEffect, useState, type ReactNode } from 'react';

import '@/src/lib/i18n';
import { isSentryConfigured, env } from '@/src/lib/env';
import { AuthProvider } from '@/src/lib/auth/AuthProvider';
import { migrateLocalDb } from '@/src/lib/db/client';

if (isSentryConfigured) {
  Sentry.init({ dsn: env.sentryDsn, enableNative: true });
}

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    migrateLocalDb().catch((error) => {
      if (isSentryConfigured) Sentry.captureException(error);
    });
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            networkMode: 'offlineFirst',
          },
          mutations: {
            networkMode: 'offlineFirst',
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
