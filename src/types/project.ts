export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  detailedDescription: string;
  images: string[]; // URLs for images
  featured?: boolean;
  tags?: string[];
  liveLink?: string;
  repoLink?: string;
  year?: number;
  client?: string;
  role?: string;
  technologies?: string[];
  dataAiHint?: string; // For placeholder main image
}
