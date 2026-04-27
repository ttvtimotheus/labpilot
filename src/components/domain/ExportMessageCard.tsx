import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';

interface ExportMessageCardProps {
  message: string | null;
}

export function ExportMessageCard({ message }: ExportMessageCardProps) {
  if (!message) return null;

  return (
    <Card>
      <AppText variant="bodyEmph">Export</AppText>
      <AppText muted>{message}</AppText>
    </Card>
  );
}