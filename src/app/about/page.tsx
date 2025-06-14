
// @/app/about/page.tsx
"use client"; // Added "use client" because ProfileCard is a client component

import type { Metadata } from 'next';
// Image component might not be needed if ProfileCard handles the image fully
// import Image from 'next/image'; 
import { UserCircle, Sparkles, History, Database, Cpu, Code } from 'lucide-react';
import ExperienceTimeline from '@/components/experience-timeline';
import { getExperience } from '@/lib/experience';
import type { ExperienceItem } from '@/types/experience';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAboutPageContent } from '@/lib/page-content';
import ProfileCard from '@/components/profile-card'; // Import the new ProfileCard
import '@/components/profile-card.css'; // Import the ProfileCard CSS

// Metadata can remain a server export if AboutPage is a server component by default
// and ProfileCard is client-side. However, since we're making AboutPage client for ProfileCard,
// this metadata might need to be handled differently or be static.
// For now, assuming it can be generated or is static.
// export const metadata: Metadata = { 
//   title: 'About Me - Musefolio',
//   description: 'Discover the architect behind Musefolio. My journey, skills, and vision for the digital frontier.',
// };

// Static skills data - could be made dynamic in a more complex setup
const skills = [
  { name: "Quantum UI/UX Design", icon: Cpu, level: "Expert" },
  { name: "AI-Driven Prototyping", icon: Sparkles, level: "Advanced" },
  { name: "Holographic Interfaces", icon: Code, level: "Proficient" },
  { name: "Neural Network Visualization", icon: Database, level: "Advanced" },
  { name: "Temporal Mechanics (Theoretical)", icon: History, level: "Novice" },
];

export default function AboutPage() {
  const experienceItems: ExperienceItem[] = getExperience();
  const content = getAboutPageContent();

  // Fallback for profile image if not set
  const profileImageUrl = content.profileImage || "https://placehold.co/400x400.png?text=Muse";


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

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-2 flex justify-center items-center animate-in fade-in-0 slide-in-from-left-20 duration-700 delay-300">
              {/* Replace Image with ProfileCard */}
              <ProfileCard
                avatarUrl={profileImageUrl}
                miniAvatarUrl={profileImageUrl} // Can be the same or a different smaller one
                name={content.name}
                title="Digital Artisan & Visionary" // Or derive from content.mainSubtitle
                handle={content.name.toLowerCase().replace(/\s+/g, '_')} // Example handle
                status="Online" // Example status
                iconUrl="https://placehold.co/200x200.png?text=BGPattern" // Placeholder for card's internal pattern
                grainUrl="https://placehold.co/300x300.png?text=GrainFX" // Placeholder for card's grain effect
                enableTilt={true}
                showUserInfo={true}
                className="max-w-sm mx-auto" // Ensure card itself is constrained if needed
                 onContactClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/contact';
                  }
                }}
                contactText="Reach Out"
              />
            </div>
            <div className="lg:col-span-3 space-y-5 animate-in fade-in-0 slide-in-from-right-20 duration-700 delay-400">
              <h2 className="font-headline text-2xl sm:text-3xl text-foreground">{content.greeting} <span className="text-primary">{content.name}</span></h2>
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
            {skills.map((skill, index) => (
              <Card 
                key={skill.name} 
                className="bg-background/70 border-primary/20 shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-10 duration-500"
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-3">
                  <skill.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline text-xl text-foreground">{skill.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">{skill.level}</Badge>
                </CardContent>
              </Card>
            ))}
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
