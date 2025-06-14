// @/src/types/experience.ts
import type { LucideIcon } from 'lucide-react';

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string; // e.g., "Jan 2020 - Present"
  description: string;
  icon?: LucideIcon;
}
