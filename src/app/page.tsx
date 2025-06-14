import Link from 'next/link';
import ProjectCard from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { getProjects } from '@/lib/projects';
import { getHomePageContent } from '@/lib/page-content'; // Import function to get home page content
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const allProjects = getProjects();
  const featuredProjects = allProjects.filter(p => p.featured).slice(0, 3);
  const content = getHomePageContent(); // Fetch home page content

  return (
    <div className="space-y-16 animate-in fade-in-0 duration-500">
      {/* Hero Section */}
      <section className="relative text-center py-20 md:py-32 rounded-xl shadow-2xl overflow-hidden
                          bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20
                          animate-gradient-shift bg-[length:400%_400%]">
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8
                         bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary
                         animate-in fade-in-0 slide-in-from-bottom-12 duration-700 delay-200">
            {content.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 max-w-3xl mx-auto mb-10
                       animate-in fade-in-0 slide-in-from-bottom-10 duration-700 delay-400">
            {content.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center
                       animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-600">
            <Link href="/projects" passHref>
              <Button size="lg" className="group bg-primary hover:bg-primary/80 text-primary-foreground 
                                         transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-primary/50 shadow-xl
                                         px-10 py-3 text-base sm:text-lg">
                {content.heroButtonExplore}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button size="lg" variant="outline" className="group border-foreground/30 hover:bg-accent hover:text-accent-foreground hover:border-accent
                                                       transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-accent/40 shadow-xl
                                                       px-10 py-3 text-base sm:text-lg">
                {content.heroButtonContact}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline text-4xl font-semibold text-foreground">{content.featuredWorkTitle}</h2>
            <Link href="/projects" passHref>
               <Button variant="link" className="text-primary hover:text-primary/80 group">
                {content.featuredWorkViewAll}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                className={`animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out`}
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* Call to Action for AI Assistant */}
      <section className="py-12 md:py-20 bg-secondary/50 rounded-xl shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="font-headline text-3xl md:text-4xl font-semibold mb-4 text-foreground">
            {content.aiAssistantTitle}
          </h2>
          <p className="text-lg text-foreground/80 max-w-xl mx-auto mb-8">
            {content.aiAssistantSubtitle}
          </p>
          <Link href="/ai-assistant" passHref>
            <Button size="lg" variant="default" className="group bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
              {content.aiAssistantButton}
              <Sparkles className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
