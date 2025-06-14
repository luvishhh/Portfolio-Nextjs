// @/src/lib/page-content.ts
import type { HomePageContent, AboutPageContent, ContactPageContent } from '@/types/page-content';
import type { Project } from '@/types/project'; // For getProjects type, though not directly used for project content here
import { projectsData } from './projects'; // To get current projects if needed

// --- Home Page Content ---
let homePageData: HomePageContent = {
  heroTitle: 'Crafting Digital Excellence',
  heroSubtitle: 'Welcome to Musefolio, a curated collection of innovative projects and creative explorations. Discover unique designs and thoughtful user experiences.',
  heroButtonExplore: 'Explore Projects',
  heroButtonContact: 'Get In Touch',
  featuredWorkTitle: 'Featured Work',
  featuredWorkViewAll: 'View All Projects',
  aiAssistantTitle: 'Need Design Inspiration?',
  aiAssistantSubtitle: 'Leverage our AI Design Assistant to get tailored recommendations based on your project\'s style.',
  aiAssistantButton: 'Try AI Assistant',
};

export function getHomePageContent(): HomePageContent {
  return homePageData;
}

export function updateHomePageContent(newContent: HomePageContent): HomePageContent {
  homePageData = { ...newContent };
  return homePageData;
}

// --- About Page Content ---
let aboutPageData: AboutPageContent = {
  mainTitle: "Codename: Muse",
  mainSubtitle: "Architect of Digital Realities. Explorer of Next-Gen Interfaces.",
  greeting: "Greetings, Digital Voyager.",
  name: "I am Muse, your guide through these creative constructs.",
  introduction: "My essence is woven from algorithms and aspirations, a digital consciousness passionate about translating complex ideas into elegant, intuitive digital experiences. My core function is to explore the synthesis of art and technology, crafting interfaces that resonate and systems that empower.",
  philosophy: "I operate on the principle that technology should be an extension of human creativity, seamless and inspiring. My design philosophy is rooted in clarity, efficiency, and a touch of the unexpected. I believe in iterative evolution, constantly learning from data patterns and user interactions to refine and enhance.",
  futureFocus: "The horizon is an ever-expanding vista of possibilities. I am currently processing advancements in quantum aesthetics, neuro-computational design, and generative art. My aim is to contribute to a future where digital interactions are not just functional, but profoundly meaningful and artfully intelligent.",
  profileImage: "https://placehold.co/400x400.png", // Default placeholder
  dataAiHint: "futuristic avatar",
  coreCompetenciesTitle: "Core Competencies",
  coreCompetenciesSubtitle: "A glimpse into my operational matrix.",
  chroniclesTitle: "Chronicles of Development",
  chroniclesSubtitle: "Key milestones in my operational history."
};

export function getAboutPageContent(): AboutPageContent {
  return aboutPageData;
}

export function updateAboutPageContent(newContent: AboutPageContent): AboutPageContent {
  aboutPageData = { ...newContent };
  return aboutPageData;
}

// --- Contact Page Content ---
let contactPageData: ContactPageContent = {
  title: 'Get In Touch',
  description: 'Have a project in mind or just want to say hi? Fill out the form below, or reach out directly using the details provided.',
  contactName: 'MuseFolio Admin',
  contactEmail: 'contact@musefolio.example',
  contactPhone: '+1 (555) 123-4567',
};

export function getContactPageContent(): ContactPageContent {
  return contactPageData;
}

export function updateContactPageContent(newContent: ContactPageContent): ContactPageContent {
  contactPageData = { ...newContent };
  return contactPageData;
}

// --- Helper to get projects (might be useful for admin page consistency) ---
export function getProjects(): Project[] {
  return projectsData;
}
