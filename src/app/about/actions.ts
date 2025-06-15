// @/src/app/about/actions.ts
'use server';

import { getAboutPageContent as dbGetAboutPageContent } from '@/lib/page-content';
import type { AboutPageContent } from '@/types/page-content';

export async function fetchAboutPageContent(): Promise<AboutPageContent | null> {
  try {
    const content = await dbGetAboutPageContent();
    return content;
  } catch (error) {
    console.error("Error fetching about page content in server action:", error);
    return null; 
  }
}
