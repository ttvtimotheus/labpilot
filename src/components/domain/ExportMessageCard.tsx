import { NoticeBanner } from '@/src/components/ui/NoticeBanner';

interface ExportMessageCardProps {
  message: string | null;
}

export function ExportMessageCard({ message }: ExportMessageCardProps) {
  if (!message) return null;

  return <NoticeBanner title="Export" description={message} tone="info" icon="picture-as-pdf" />;
}