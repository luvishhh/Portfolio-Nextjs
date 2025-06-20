import { getProjectBySlug, getProjects } from '@/lib/projects'
import type { Project } from '@/types/project'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  ExternalLink,
  Briefcase,
  CalendarDays,
  User,
  Layers,
  GitFork,
} from 'lucide-react'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    return {
      title: 'Project Not Found - Musefolio',
    }
  }

  const hasValidImage =
    typeof project.imageUrl === 'string' && project.imageUrl.trim() !== ''

  return {
    title: `${project.title} - Musefolio`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: hasValidImage ? [project.imageUrl] : [],
    },
  }
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  const projectDetails = [
    { label: 'Client', value: project.client, icon: Briefcase },
    { label: 'Year', value: project.year, icon: CalendarDays },
    { label: 'Role', value: project.role, icon: User },
    {
      label: 'Technologies',
      value: project.technologies?.join(', '),
      icon: Layers,
    },
  ]

  const hasValidMainImage =
    typeof project.imageUrl === 'string' && project.imageUrl.trim() !== ''

  return (
    <div className='max-w-4xl mx-auto py-8 px-4 animate-in fade-in-0 duration-500'>
      <Link href='/projects' passHref>
        <Button variant='outline' className='mb-8 group'>
          <ArrowLeft className='mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1' />
          Back to Projects
        </Button>
      </Link>

      <article className='space-y-12'>
        <header className='space-y-4'>
          <h1 className='font-headline text-4xl md:text-5xl font-bold text-primary'>
            {project.title}
          </h1>
          {project.description && (
            <p className='text-lg text-muted-foreground'>
              {project.description}
            </p>
          )}
          {project.tags && project.tags.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant='secondary'
                  className='bg-accent/20 text-accent-foreground hover:bg-accent/30'
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {hasValidMainImage ? (
          <section className='rounded-lg overflow-hidden shadow-xl'>
            <Image
              src={project.imageUrl}
              alt={`Main image for ${project.title}`}
              width={1200}
              height={800}
              className='w-full h-auto object-cover'
              priority
              data-ai-hint={project.dataAiHint || 'project showcase'}
            />
          </section>
        ) : (
          <div className='aspect-video bg-destructive text-destructive-foreground rounded-lg shadow-xl flex flex-col items-center justify-center p-4 text-center'>
            <p className='text-lg font-semibold'>
              IMAGE DATA MISSING OR INVALID
            </p>
            <p className='text-sm mt-1'>
              URL:{' '}
              {project.imageUrl
                ? `"${project.imageUrl}"`
                : 'Not found in project.imageUrl'}
            </p>
          </div>
        )}

        <section className='prose prose-lg max-w-none dark:prose-invert text-foreground/90'>
          <h2 className='font-headline text-3xl font-semibold mb-4'>
            Project Overview
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html: project.detailedDescription.replace(/\n/g, '<br />'),
            }}
          />
        </section>

        <section className='grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border rounded-lg bg-card shadow-sm'>
          {projectDetails.map(
            (detail) =>
              detail.value && (
                <div key={detail.label} className='flex items-start space-x-3'>
                  <detail.icon className='h-6 w-6 text-primary mt-1 flex-shrink-0' />
                  <div>
                    <h3 className='font-semibold text-md text-foreground'>
                      {detail.label}
                    </h3>
                    <p className='text-muted-foreground text-sm'>
                      {detail.value}
                    </p>
                  </div>
                </div>
              )
          )}
        </section>

        {(project.liveLink || project.repoLink) && (
          <section className='flex flex-col sm:flex-row gap-4'>
            {project.liveLink && (
              <a
                href={project.liveLink}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button className='w-full sm:w-auto group bg-primary hover:bg-primary/90 text-primary-foreground'>
                  View Live Project
                  <ExternalLink className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110' />
                </Button>
              </a>
            )}
            {project.repoLink && (
              <a
                href={project.repoLink}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button
                  variant='outline'
                  className='w-full sm:w-auto group hover:bg-accent hover:text-accent-foreground'
                >
                  View Repository
                  <GitFork className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12' />
                </Button>
              </a>
            )}
          </section>
        )}
        {/* Image Gallery section removed as there's only one image now */}
      </article>
    </div>
  )
}
