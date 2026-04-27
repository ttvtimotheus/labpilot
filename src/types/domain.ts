export type Bereich = 'mibi' | 'haema' | 'chemie' | 'histo' | 'general' | 'learn';

export type UserRole = 'azubi' | 'mtla' | 'lehrer' | 'andere';

export interface Profile {
  id: string;
  displayName: string | null;
  role: UserRole;
  ausbildungsjahr?: 1 | 2 | 3;
  preferredLanguage: 'de' | 'en';
}

export interface TimerTemplate {
  id: string;
  userId: string;
  name: string;
  durationSeconds: number;
  bereich: Bereich;
  description?: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveTimer {
  id: string;
  templateId?: string;
  name: string;
  durationSeconds: number;
  startedAt: string;
  endsAt: string;
  bereich: Bereich;
  notificationId?: string;
  completedAt?: string;
  cancelled?: boolean;
}

export interface ProtocolStep {
  id: string;
  name: string;
  durationSeconds?: number;
  instructions: string;
  order: number;
}

export interface Protokoll {
  id: string;
  userId?: string;
  name: string;
  bereich: Bereich;
  description: string;
  source: string;
  steps: ProtocolStep[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KolonieCategory {
  id: string;
  label: string;
  colour: string;
  count: number;
}

export interface DifferentialCell {
  id: string;
  label: string;
  shortLabel: string;
  count: number;
}

export interface KnowledgeTopic {
  id: string;
  bereich: Bereich;
  title: string;
  summary: string;
  body: string[];
  tags: string[];
  proOnly?: boolean;
}
