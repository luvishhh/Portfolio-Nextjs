// @/components/project-card.tsx
import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types/project'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'

interface ProjectCardProps {
  project: Project
  className?: string
  style?: React.CSSProperties
}

export default function ProjectCard({
  project,
  className,
  style,
}: ProjectCardProps) {
  const hasValidMainImage =
    typeof project.imageUrl === 'string' && project.imageUrl.trim() !== ''

  return (
    <Card
      className={`flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-card ${className}`}
      style={style}
    >
      <CardHeader className='p-0'>
        {hasValidMainImage ? (
          <Link href={`/projects/${project.slug}`} passHref>
            <div className='aspect-video relative overflow-hidden cursor-pointer'>
              <Image
                src={project.imageUrl}
                alt={project.title}
                layout='fill'
                objectFit='cover'
                className='transition-transform duration-500 ease-in-out hover:scale-105'
                data-ai-hint={project.dataAiHint || 'project image'}
              />
            </div>
          </Link>
        ) : (
          <div className='aspect-video bg-destructive text-destructive-foreground flex flex-col items-center justify-center p-4 text-center'>
            <p className='text-md font-semibold'>
              IMAGE DATA MISSING OR INVALID
            </p>
            <p className='text-xs mt-1'>
              URL:{' '}
              {project.imageUrl
                ? `"${project.imageUrl}"`
                : 'Not found in project.imageUrl'}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className='p-6 flex-grow'>
        <Link href={`/projects/${project.slug}`} passHref>
          <CardTitle className='font-headline text-2xl mb-2 hover:text-primary transition-colors cursor-pointer'>
            {project.title}
          </CardTitle>
        </Link>
        <p className='text-muted-foreground text-sm mb-4 line-clamp-3'>
          {project.description}
        </p>
        {project.tags && project.tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {project.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant='secondary'
                className='text-xs bg-accent/20 text-accent-foreground hover:bg-accent/30'
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className='p-6 pt-0'>
        <Link href={`/projects/${project.slug}`} passHref className='w-full'>
          <Button
            variant='outline'
            className='w-full group hover:bg-primary hover:text-primary-foreground transition-colors'
          >
            View Details
            <ArrowRight className='ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1' />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
