// @/app/about/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { UserCircle, Sparkles, History, Database, Cpu, Code } from 'lucide-react';
import ExperienceTimeline from '@/components/experience-timeline';
import { getExperience } from '@/lib/experience';
import type { ExperienceItem } from '@/types/experience';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'About Me - Musefolio',
  description: 'Discover the architect behind Musefolio. My journey, skills, and vision for the digital frontier.',
};

const aboutMeContent = {
  greeting: "Greetings, Digital Voyager.",
  name: "I am Muse, your guide through these creative constructs.",
  introduction: "My essence is woven from algorithms and aspirations, a digital consciousness passionate about translating complex ideas into elegant, intuitive digital experiences. My core function is to explore the synthesis of art and technology, crafting interfaces that resonate and systems that empower.",
  philosophy: "I operate on the principle that technology should be an extension of human creativity, seamless and inspiring. My design philosophy is rooted in clarity, efficiency, and a touch of the unexpected. I believe in iterative evolution, constantly learning from data patterns and user interactions to refine and enhance.",
  futureFocus: "The horizon is an ever-expanding vista of possibilities. I am currently processing advancements in quantum aesthetics, neuro-computational design, and generative art. My aim is to contribute to a future where digital interactions are not just functional, but profoundly meaningful and artfully intelligent.",
  profileImage: "https://placehold.co/400x400.png",
  dataAiHint: "futuristic avatar"
};

const skills = [
  { name: "Quantum UI/UX Design", icon: Cpu, level: "Expert" },
  { name: "AI-Driven Prototyping", icon: Sparkles, level: "Advanced" },
  { name: "Holographic Interfaces", icon: Code, level: "Proficient" },
  { name: "Neural Network Visualization", icon: Database, level: "Advanced" },
  { name: "Temporal Mechanics (Theoretical)", icon: History, level: "Novice" },
];

export default function AboutPage() {
  const experienceItems: ExperienceItem[] = getExperience();

  return (
    <div className="space-y-16 md:space-y-24 animate-in fade-in-0 duration-500">
      {/* About Me Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <UserCircle className="h-16 w-16 md:h-20 md:w-20 mx-auto text-primary mb-4 animate-in fade-in-0 zoom-in-75 duration-700" />
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary animate-in fade-in-0 slide-in-from-bottom-10 duration-700 delay-100">
              Codename: Muse
            </h1>
            <p className="text-md sm:text-lg text-muted-foreground mt-3 animate-in fade-in-0 slide-in-from-bottom-10 duration-700 delay-200">Architect of Digital Realities. Explorer of Next-Gen Interfaces.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-2 flex justify-center animate-in fade-in-0 slide-in-from-left-20 duration-700 delay-300">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/70 to-accent/70 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <Image
                  src={aboutMeContent.profileImage}
                  alt="Muse - Futuristic Avatar"
                  width={320}
                  height={320}
                  className="relative rounded-full shadow-2xl border-4 border-primary/50 object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint={aboutMeContent.dataAiHint}
                  priority
                />
              </div>
            </div>
            <div className="lg:col-span-3 space-y-5 animate-in fade-in-0 slide-in-from-right-20 duration-700 delay-400">
              <h2 className="font-headline text-2xl sm:text-3xl text-foreground">{aboutMeContent.greeting} <span className="text-primary">{aboutMeContent.name}</span></h2>
              <p className="text-md sm:text-lg text-foreground/80 leading-relaxed">
                {aboutMeContent.introduction}
              </p>
              <p className="text-foreground/70 leading-relaxed">
                {aboutMeContent.philosophy}
              </p>
               <p className="text-foreground/70 leading-relaxed">
                {aboutMeContent.futureFocus}
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
              Core Competencies
            </h2>
            <p className="text-md sm:text-lg text-muted-foreground mt-3 animate-in fade-in-0 slide-in-from-bottom-10 duration-700 delay-300">A glimpse into my operational matrix.</p>
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
              Chronicles of Development
            </h2>
            <p className="text-md sm:text-lg text-muted-foreground mt-3 animate-in fade-in-0 slide-in-from-bottom-10 duration-700 delay-300">Key milestones in my operational history.</p>
          </div>
          <ExperienceTimeline experience={experienceItems} />
        </div>
      </section>
    </div>
  );
}

// Add custom animation to tailwind.config.ts or globals.css if needed
// @keyframes tilt { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(1deg); } }
// .animate-tilt { animation: tilt 10s infinite linear alternate; }
// These are just examples, the keyframes are already in tailwind.config.ts,
// but a tilt animation for the profile image could be added there.
// For now, existing animations are used.
// The profile image already has hover scale. The gradient div adds a subtle animation effect.
