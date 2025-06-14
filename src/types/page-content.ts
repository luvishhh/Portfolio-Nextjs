// @/src/types/page-content.ts
import type { ExperienceItem } from '@/types/experience';

export interface HomePageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonExplore: string;
  heroButtonContact: string;
  featuredWorkTitle: string;
  featuredWorkViewAll: string;
  aiAssistantTitle: string;
  aiAssistantSubtitle: string;
  aiAssistantButton: string;
}

export interface AboutPageContent {
  mainTitle: string; // e.g., "Codename: Muse"
  mainSubtitle: string; // e.g., "Architect of Digital Realities..."
  greeting: string;
  name: string;
  introduction: string;
  philosophy: string;
  futureFocus: string;
  profileImage: string; // URL
  dataAiHint: string;
  // Profile Card specific text fields
  profileCardTitle: string;
  profileCardHandle: string;
  profileCardStatus: string;
  profileCardContactText: string;
  // Skills section
  coreCompetenciesTitle: string;
  coreCompetenciesSubtitle: string;
  // Experience section
  chroniclesTitle: string;
  chroniclesSubtitle: string;
  experienceItems: ExperienceItem[];
}

export interface ContactPageContent {
  title: string;
  description: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

