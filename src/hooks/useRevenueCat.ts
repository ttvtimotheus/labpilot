import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

import { isRevenueCatConfigured } from '@/src/lib/env';
import { getOfferings, hasProEntitlement, purchasePackageById, restorePurchases } from '@/src/lib/purchases';

type RevenueCatAction = 'idle' | 'loading' | 'purchasing' | 'restoring';

export function useRevenueCat() {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOfferingId, setCurrentOfferingId] = useState<string | null>(null);
  const [action, setAction] = useState<RevenueCatAction>(isRevenueCatConfigured ? 'loading' : 'idle');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    setMessage(null);

    if (!isRevenueCatConfigured) {
      setPackages([]);
      setCurrentOfferingId(null);
      setAction('idle');
      return;
    }

    setAction('loading');
    try {
      const offerings = await getOfferings();
      setCurrentOfferingId(offerings?.current?.identifier ?? null);
      setPackages(offerings?.current?.availablePackages ?? []);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Angebote konnten nicht geladen werden.');
    } finally {
      setAction('idle');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const purchase = useCallback(async (packageId: string) => {
    setError(null);
    setMessage(null);
    setAction('purchasing');
    try {
      const result = await purchasePackageById(packageId);
      setCustomerInfo(result.customerInfo);
      setMessage(hasProEntitlement(result.customerInfo) ? 'LabPilot Pro ist aktiv.' : 'Kauf abgeschlossen. Entitlement wird aktualisiert.');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Kauf konnte nicht abgeschlossen werden.');
    } finally {
      setAction('idle');
    }
  }, []);

  const restore = useCallback(async () => {
    setError(null);
    setMessage(null);
    setAction('restoring');
    try {
      const info = await restorePurchases();
      setCustomerInfo(info);
      setMessage(hasProEntitlement(info) ? 'Kaeufe wiederhergestellt. Pro ist aktiv.' : 'Keine aktive Pro-Berechtigung gefunden.');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Kaeufe konnten nicht wiederhergestellt werden.');
    } finally {
      setAction('idle');
    }
  }, []);

  return useMemo(
    () => ({
      action,
      currentOfferingId,
      customerInfo,
      error,
      isConfigured: isRevenueCatConfigured,
      isLoading: action === 'loading',
      isPurchasing: action === 'purchasing',
      isRestoring: action === 'restoring',
      isWorking: action !== 'idle',
      message,
      packages,
      purchase,
      refresh,
      restore,
    }),
    [action, currentOfferingId, customerInfo, error, message, packages, purchase, refresh, restore],
  );
}