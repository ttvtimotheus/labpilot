import { Button } from '@/src/components/ui/Button';
import { NoticeBanner } from '@/src/components/ui/NoticeBanner';
import type { PdfExportStatus } from '@/src/hooks/usePdfExport';

interface ExportMessageCardProps {
  message: string | null;
  status?: PdfExportStatus;
  onRetry?: () => void;
}

export function ExportMessageCard({ message, status = 'idle', onRetry }: ExportMessageCardProps) {
  if (!message) return null;

  const isError = status === 'error';
  const isSuccess = status === 'success';
  const title = status === 'exporting' ? 'Export laeuft' : isError ? 'Export nicht abgeschlossen' : isSuccess ? 'Export bereit' : 'Export';

  return (
    <NoticeBanner
      title={title}
      description={message}
      tone={isError ? 'danger' : isSuccess ? 'success' : 'info'}
      icon={isError ? 'error-outline' : 'picture-as-pdf'}
      action={onRetry ? <Button label="Erneut versuchen" icon="refresh" variant="secondary" onPress={onRetry} /> : undefined}
    />
  );
}