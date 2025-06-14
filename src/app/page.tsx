import Link from 'next/link';
import ProjectCard from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { getProjects } from '@/lib/projects';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const allProjects = getProjects();
  const featuredProjects = allProjects.filter(p => p.featured).slice(0, 3); // Show up to 3 featured projects

  return (
    <div className="space-y-16 animate-in fade-in-0 duration-500">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24 rounded-xl bg-gradient-to-br from-background via-secondary to-background shadow-inner">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 text-primary">
            Crafting Digital Excellence
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8">
            Welcome to Musefolio, a curated collection of innovative projects and creative explorations. Discover unique designs and thoughtful user experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/projects" passHref>
              <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
                Explore Projects
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button size="lg" variant="outline" className="group hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline text-4xl font-semibold text-foreground">Featured Work</h2>
            <Link href="/projects" passHref>
               <Button variant="link" className="text-primary hover:text-primary/80 group">
                View All Projects
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
            Need Design Inspiration?
          </h2>
          <p className="text-lg text-foreground/80 max-w-xl mx-auto mb-8">
            Leverage our AI Design Assistant to get tailored recommendations based on your project's style.
          </p>
          <Link href="/ai-assistant" passHref>
            <Button size="lg" variant="default" className="group bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
              Try AI Assistant
              <Sparkles className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
