// @/src/types/page-content.ts

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
  coreCompetenciesTitle: string;
  coreCompetenciesSubtitle: string;
  chroniclesTitle: string;
  chroniclesSubtitle: string;
}

export interface ContactPageContent {
  title: string;
  description: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}
