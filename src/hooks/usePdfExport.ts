import { useState } from 'react';

const exportSuccessMessage = 'PDF-Bericht wurde erstellt und kann geteilt werden.';
const exportFailureMessage = 'PDF-Export fehlgeschlagen. Bitte erneut versuchen.';
const exportProgressMessage = 'PDF wird vorbereitet. Du kannst gleich teilen.';

export type PdfExportStatus = 'idle' | 'exporting' | 'success' | 'error';

export function usePdfExport() {
  const [message, setMessage] = useState<string | null>(null);
  const [isExporting, setExporting] = useState(false);
  const [status, setStatus] = useState<PdfExportStatus>('idle');
  const [lastAction, setLastAction] = useState<(() => Promise<unknown>) | null>(null);

  async function exportPdf(action: () => Promise<unknown>) {
    setLastAction(() => action);
    setMessage(exportProgressMessage);
    setStatus('exporting');
    setExporting(true);
    try {
      await action();
      setMessage(exportSuccessMessage);
      setStatus('success');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : exportFailureMessage);
      setStatus('error');
    } finally {
      setExporting(false);
    }
  }

  async function retryExport() {
    if (!lastAction || isExporting) return;
    await exportPdf(lastAction);
  }

  function clearExportMessage() {
    setMessage(null);
    setStatus('idle');
  }

  return { exportPdf, retryExport, clearExportMessage, canRetry: status === 'error' && !!lastAction, isExporting, message, exportStatus: status };
}