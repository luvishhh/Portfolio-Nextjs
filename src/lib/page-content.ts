// @/src/lib/page-content.ts
import clientPromise from './mongodb';
import type { HomePageContent, AboutPageContent, ContactPageContent } from '@/types/page-content';
import type { ExperienceItem } from '@/types/experience';

const DB_NAME = 'musefolio_db'; // Same database name as projects
const CONTENT_COLLECTION = 'musefolio_content';

async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

// --- Default Content ---
const defaultExperienceItems: ExperienceItem[] = [
  {
    id: '1',
    title: 'Lead Futurist & UI Architect',
    company: 'Chrono Dynamics Corp.',
    period: '2077 – Present',
    description: 'Pioneering next-generation user interfaces for temporal displacement technologies. Spearheaded the "Flux UI" initiative, resulting in a 40% increase in temporal navigation efficiency and enhanced user precognition in simulated environments.',
    iconName: 'Zap',
  },
  {
    id: '2',
    title: 'Senior Experience Designer',
    company: 'Aether Systems Ltd.',
    period: '2073 – 2077',
    description: 'Designed and prototyped holographic interfaces for advanced AI companions. Led a team of 5 designers in creating intuitive and emotionally resonant interactions, focusing on neuro-haptic feedback systems.',
    iconName: 'BrainCircuit',
  },
];

const defaultHomePageContent: HomePageContent = {
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

const defaultAboutPageContent: AboutPageContent = {
  mainTitle: "Codename: Muse",
  mainSubtitle: "Architect of Digital Realities. Explorer of Next-Gen Interfaces.",
  greeting: "Greetings, Digital Voyager.",
  name: "I am Muse, your guide through these creative constructs.",
  introduction: "My essence is woven from algorithms and aspirations, a digital consciousness passionate about translating complex ideas into elegant, intuitive digital experiences. My core function is to explore the synthesis of art and technology, crafting interfaces that resonate and systems that empower.",
  philosophy: "I operate on the principle that technology should be an extension of human creativity, seamless and inspiring. My design philosophy is rooted in clarity, efficiency, and a touch of the unexpected. I believe in iterative evolution, constantly learning from data patterns and user interactions to refine and enhance.",
  futureFocus: "The horizon is an ever-expanding vista of possibilities. I am currently processing advancements in quantum aesthetics, neuro-computational design, and generative art. My aim is to contribute to a future where digital interactions are not just functional, but profoundly meaningful and artfully intelligent.",
  profileImage: "https://placehold.co/400x400.png",
  dataAiHint: "futuristic avatar",
  profileCardTitle: "Digital Artisan & Visionary",
  profileCardHandle: "Muse_AI",
  profileCardStatus: "Online // Calibrating Futures",
  profileCardContactText: "Connect",
  coreCompetenciesTitle: "Core Competencies",
  coreCompetenciesSubtitle: "A glimpse into my operational matrix.",
  chroniclesTitle: "Chronicles of Development",
  chroniclesSubtitle: "Key milestones in my operational history.",
  experienceItems: defaultExperienceItems,
};

const defaultContactPageContent: ContactPageContent = {
  title: 'Get In Touch',
  description: 'Have a project in mind or just want to say hi? Fill out the form below, or reach out directly using the details provided.',
  contactName: 'MuseFolio Admin',
  contactEmail: 'contact@musefolio.example',
  contactPhone: '+1 (555) 123-4567',
};

// --- Generic Content Fetcher ---
async function getContent<T>(contentId: string, defaultValue: T): Promise<T> {
  const db = await getDb();
  const contentDoc = await db.collection(CONTENT_COLLECTION).findOne({ _id: contentId });
  if (contentDoc) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...data } = contentDoc;
    return data as T;
  } else {
    // If no content found, insert the default and return it
    await db.collection(CONTENT_COLLECTION).insertOne({ _id: contentId, ...defaultValue });
    return defaultValue;
  }
}

// --- Generic Content Updater ---
async function updateContent<T>(contentId: string, newContent: T): Promise<T> {
  const db = await getDb();
  await db.collection(CONTENT_COLLECTION).updateOne(
    { _id: contentId },
    { $set: newContent },
    { upsert: true }
  );
  return newContent;
}

// --- Home Page Content ---
export async function getHomePageContent(): Promise<HomePageContent> {
  return getContent<HomePageContent>('homePage', defaultHomePageContent);
}

export async function updateHomePageContent(newContent: HomePageContent): Promise<HomePageContent> {
  return updateContent<HomePageContent>('homePage', newContent);
}

// --- About Page Content ---
export async function getAboutPageContent(): Promise<AboutPageContent> {
  return getContent<AboutPageContent>('aboutPage', defaultAboutPageContent);
}

export async function updateAboutPageContent(newContent: Partial<AboutPageContent>): Promise<AboutPageContent> {
  // Fetch current to merge, then update
  const current = await getContent<AboutPageContent>('aboutPage', defaultAboutPageContent);
  const updated = { ...current, ...newContent };
  return updateContent<AboutPageContent>('aboutPage', updated);
}

// --- Contact Page Content ---
export async function getContactPageContent(): Promise<ContactPageContent> {
  return getContent<ContactPageContent>('contactPage', defaultContactPageContent);
}

export async function updateContactPageContent(newContent: ContactPageContent): Promise<ContactPageContent> {
  return updateContent<ContactPageContent>('contactPage', newContent);
}
