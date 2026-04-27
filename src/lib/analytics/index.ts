import { PostHog } from 'posthog-react-native';

import { env, isPostHogConfigured } from '@/src/lib/env';

type AnalyticsProperties = Record<string, string | number | boolean | null>;

export const posthog = isPostHogConfigured
  ? new PostHog(env.posthogKey, { host: env.posthogHost })
  : null;

export function capture(event: string, properties?: AnalyticsProperties) {
  posthog?.capture(event, properties);
}

export async function identify(userId: string, properties?: AnalyticsProperties) {
  await posthog?.identify(userId, properties);
}
