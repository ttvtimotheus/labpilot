import { useEffect, useState } from 'react';
import Purchases, { type CustomerInfo } from 'react-native-purchases';

import { hasProEntitlement } from '@/src/lib/purchases';
import { isRevenueCatConfigured } from '@/src/lib/env';

export function useEntitlements() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    if (!isRevenueCatConfigured) return;

    const listener = (info: CustomerInfo) => setCustomerInfo(info);
    Purchases.addCustomerInfoUpdateListener(listener);
    Purchases.getCustomerInfo().then(setCustomerInfo).catch(() => setCustomerInfo(null));

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  return {
    isPro: hasProEntitlement(customerInfo),
    customerInfo,
  };
}
