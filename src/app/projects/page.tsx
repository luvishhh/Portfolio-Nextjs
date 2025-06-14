import ProjectCard from '@/components/project-card';
import { getProjects } from '@/lib/projects';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects - Musefolio',
  description: 'Explore all creative projects showcased on Musefolio.',
};

export default async function ProjectsPage() { // Made async
  const projects = await getProjects(); // Awaited

  return (
    <div className="animate-in fade-in-0 duration-500">
      <section className="py-8">
        <h1 className="font-headline text-5xl font-bold mb-12 text-center text-primary">
          Our Portfolio
        </h1>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
               <ProjectCard 
                key={project.id} 
                project={project} 
                className={`animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out`}
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg">No projects found. Check back soon!</p>
        )}
      </section>
    </div>
  );
}
