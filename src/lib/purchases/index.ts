import { Platform } from 'react-native';
import Purchases, { type CustomerInfo } from 'react-native-purchases';

import { env, isRevenueCatConfigured } from '@/src/lib/env';

let configuredUserId: string | null = null;

export async function configurePurchases(userId: string) {
  if (!isRevenueCatConfigured || configuredUserId === userId) return;

  const apiKey = Platform.OS === 'ios' ? env.revenueCatIosKey : env.revenueCatAndroidKey;
  if (!apiKey) return;

  Purchases.configure({ apiKey, appUserID: userId });
  configuredUserId = userId;
}

export async function getOfferings() {
  if (!isRevenueCatConfigured) return null;
  return Purchases.getOfferings();
}

export async function purchasePackageById(packageId: string) {
  const offerings = await getOfferings();
  const target = offerings?.current?.availablePackages.find((pkg) => pkg.identifier === packageId);

  if (!target) throw new Error('Dieses Angebot ist aktuell nicht verfügbar.');
  return Purchases.purchasePackage(target);
}

export async function restorePurchases() {
  if (!isRevenueCatConfigured) return null;
  return Purchases.restorePurchases();
}

export function hasProEntitlement(info: CustomerInfo | null) {
  return Boolean(info?.entitlements.active.pro);
}
