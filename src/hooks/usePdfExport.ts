import { useState } from 'react';

const exportSuccessMessage = 'PDF-Bericht wurde erstellt und kann geteilt werden.';
const exportFailureMessage = 'PDF-Export fehlgeschlagen.';

export function usePdfExport() {
  const [message, setMessage] = useState<string | null>(null);
  const [isExporting, setExporting] = useState(false);

  async function exportPdf(action: () => Promise<unknown>) {
    setMessage(null);
    setExporting(true);
    try {
      await action();
      setMessage(exportSuccessMessage);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : exportFailureMessage);
    } finally {
      setExporting(false);
    }
  }

  return { exportPdf, isExporting, message };
}