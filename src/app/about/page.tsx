// @/app/about/page.tsx
"use client";

import { fetchAboutPageContent } from './actions'; // Import the new server action
import { UserCircle, Sparkles, History, Database, Cpu, Code as CodeIcon, Loader2, Lightbulb, BrainCircuit, Zap, Building, type LucideIcon } from 'lucide-react'; // Added CodeIcon and more for skills
import ExperienceTimeline from '@/components/experience-timeline';
import type { ExperienceItem } from '@/types/experience';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// ProfileCard and its CSS are no longer imported
import { useEffect, useState } from 'react';
import type { AboutPageContent } from '@/types/page-content';
import type { SkillItem } from '@/types/skill'; // Import SkillItem

// Icon map for skills section - extend as needed
const skillIconMap: { [key: string]: LucideIcon } = {
  Cpu,
  Sparkles,
  Code: CodeIcon,
  Database,
  History: History,
  Zap,
  Lightbulb,
  BrainCircuit,
  Building,
  // Add more Lucide icons here as you define them in your skills JSON
  // e.g., Atom, Palette, Server, Cloud, ...
};


export default function AboutPage() {
  const [content, setContent] = useState<AboutPageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        const fetchedContent = await fetchAboutPageContent();
        setContent(fetchedContent);
      } catch (error) {
        console.error("Failed to fetch about page content:", error);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading About Muse...</p>
      </div>
    );
  }

  if (!content) {
    return <div className="text-center py-10">Failed to load content. Please try again later.</div>;
  }

  // profileImageUrl is no longer needed as ProfileCard is removed
  const experienceItems: ExperienceItem[] = content.experienceItems || [];
  const skillsToDisplay: SkillItem[] = content.skills || []; // Use skills from content


  return (
    <div className="space-y-16 md:space-y-24 animate-in fade-in-0 duration-500">
      {/* About Me Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <UserCircle className="h-16 w-16 md:h-20 md:w-20 mx-auto text-primary mb-4 animate-in fade-in-0 zoom-in-75 duration-700" />
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary animate-in fade-in-0 slide-in-from-bottom-10 duration-700 delay-100">
              {content.mainTitle}
            </h1>
            <p className="text-md sm:text-lg text-muted-foreground mt-3 animate-in fade-in-0 slide-in-from-bottom-10 duration-700 delay-200">{content.mainSubtitle}</p>
          </div>

          {/* Text content, ProfileCard removed */}
          <div className="max-w-3xl mx-auto space-y-6 text-center md:text-left animate-in fade-in-0 slide-in-from-bottom-10 duration-700 delay-300">
            <h2 className="font-headline text-2xl sm:text-3xl text-foreground">{content.greeting} <span className="text-primary">{content.name.split(" ")[0]}</span></h2>
            <p className="text-md sm:text-lg text-foreground/80 leading-relaxed">
              {content.introduction}
            </p>
            <p className="text-foreground/70 leading-relaxed">
              {content.philosophy}
            </p>
             <p className="text-foreground/70 leading-relaxed">
              {content.futureFocus}
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-12 md:py-16 bg-card/50 rounded-xl shadow-inner backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Sparkles className="h-12 w-12 md:h-16 md:w-16 mx-auto text-accent mb-4 animate-in fade-in-0 zoom-in-75 duration-700 delay-100" />
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-foreground animate-in fade-in-0 slide-in-from-bottom-10 duration-700 delay-200">
              {content.coreCompetenciesTitle}
            </h2>
            <p className="text-md sm:text-lg text-muted-foreground mt-3 animate-in fade-in-0 slide-in-from-bottom-10 duration-700 delay-300">{content.coreCompetenciesSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {skillsToDisplay.map((skill, index) => {
              const IconComponent = skillIconMap[skill.iconName] || Sparkles; // Default to Sparkles if icon not found
              return (
                <Card
                  key={skill.name}
                  className="bg-background/70 border-primary/20 shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-10 duration-500"
                  style={{ animationDelay: `${index * 100 + 400}ms` }}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-3">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline text-xl text-foreground">{skill.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-accent/20 text-foreground">{skill.level}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <History className="h-12 w-12 md:h-16 md:w-16 mx-auto text-primary mb-4 animate-in fade-in-0 zoom-in-75 duration-700 delay-100" />
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary animate-in fade-in-0 slide-in-from-bottom-10 duration-700 delay-200">
              {content.chroniclesTitle}
            </h2>
            <p className="text-md sm:text-lg text-muted-foreground mt-3 animate-in fade-in-0 slide-in-from-bottom-10 duration-700 delay-300">{content.chroniclesSubtitle}</p>
          </div>
          <ExperienceTimeline experience={experienceItems} />
        </div>
      </section>
    </div>
  );
}
