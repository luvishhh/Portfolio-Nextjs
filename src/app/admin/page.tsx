// @/app/admin/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { Project } from '@/types/project'
import {
  handleDeleteProject,
  fetchProjectsForAdminDashboard,
  handleLogout,
} from './actions'
import { useToast } from '@/hooks/use-toast'
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Home,
  UserCircle as UserIcon,
  Mail,
  Loader2,
  LogOut,
  Inbox,
} from 'lucide-react' // Added Inbox icon
import { useFormState, useFormStatus } from 'react-dom'

function LogoutButton() {
  const { pending } = useFormStatus()
  return (
    <Button type='submit' variant='outline' disabled={pending}>
      {pending ? (
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
      ) : (
        <LogOut className='mr-2 h-4 w-4' />
      )}
      {pending ? 'Logging out...' : 'Logout'}
    </Button>
  )
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadProjects = async () => {
    try {
      setLoading(true)
      const currentProjects = await fetchProjectsForAdminDashboard()
      setProjects(currentProjects)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      toast({
        title: 'Error',
        description: 'Failed to load projects. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDeleteConfirm = async (projectId: string) => {
    const result = await handleDeleteProject(projectId)
    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    })
    if (result.success) {
      loadProjects()
    }
  }

  return (
    <div className='space-y-8 animate-in fade-in-0 duration-500'>
      <div className='flex items-center justify-between'>
        <h1 className='font-headline text-4xl font-bold text-primary'>
          Admin Panel
        </h1>
        <form action={handleLogout}>
          <LogoutButton />
        </form>
      </div>

      {/* Manage Page Content Section */}
      <Card className='shadow-md'>
        <CardHeader>
          <CardTitle className='text-2xl font-semibold text-foreground'>
            Manage Page Content
          </CardTitle>
          <CardDescription>
            Edit the content for key pages of your website.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <Card className='flex flex-col'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <Home className='h-6 w-6 text-primary' />
                <CardTitle className='font-headline text-xl'>
                  Home Page
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='flex-grow'>
              <p className='text-sm text-muted-foreground'>
                Edit content for your main landing page.
              </p>
            </CardContent>
            <CardFooter>
              <Link href='/admin/edit-home' passHref className='w-full'>
                <Button className='w-full'>
                  <Edit className='mr-2 h-4 w-4' /> Edit Home Content
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className='flex flex-col'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <UserIcon className='h-6 w-6 text-primary' />
                <CardTitle className='font-headline text-xl'>
                  About Page
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='flex-grow'>
              <p className='text-sm text-muted-foreground'>
                Edit content for your about page.
              </p>
            </CardContent>
            <CardFooter>
              <Link href='/admin/edit-about' passHref className='w-full'>
                <Button className='w-full'>
                  <Edit className='mr-2 h-4 w-4' /> Edit About Content
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className='flex flex-col'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <Mail className='h-6 w-6 text-primary' />
                <CardTitle className='font-headline text-xl'>
                  Contact Page
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='flex-grow'>
              <p className='text-sm text-muted-foreground'>
                Edit content for your contact page.
              </p>
            </CardContent>
            <CardFooter>
              <Link href='/admin/edit-contact' passHref className='w-full'>
                <Button className='w-full'>
                  <Edit className='mr-2 h-4 w-4' /> Edit Contact Content
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>

      {/* Inbox Section */}
      <Card className='shadow-md'>
        <CardHeader>
          <CardTitle className='text-2xl font-semibold text-foreground'>
            Contact Messages
          </CardTitle>
          <CardDescription>
            View messages submitted through your contact form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href='/admin/inbox' passHref className='w-full'>
            <Button className='w-full md:w-auto'>
              <Inbox className='mr-2 h-4 w-4' /> View Inbox
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Manage Projects Section */}
      <Card className='shadow-md'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle className='text-2xl font-semibold text-foreground'>
              Manage Projects
            </CardTitle>
            <CardDescription>
              Add, edit, or delete your portfolio projects.
            </CardDescription>
          </div>
          <Link href='/admin/new' passHref>
            <Button className='bg-primary hover:bg-primary/90 text-primary-foreground'>
              <PlusCircle className='mr-2 h-5 w-5' /> Add New Project
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex justify-center items-center py-10'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <p className='ml-3 text-muted-foreground'>Loading projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className='font-medium'>
                      {project.title}
                    </TableCell>
                    <TableCell>{project.featured ? 'Yes' : 'No'}</TableCell>
                    <TableCell className='text-right space-x-2'>
                      <Link
                        href={`/projects/${project.slug}`}
                        passHref
                        target='_blank'
                      >
                        <Button
                          variant='outline'
                          size='icon'
                          title='View Project'
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Link href={`/admin/edit/${project.id}`} passHref>
                        <Button
                          variant='outline'
                          size='icon'
                          title='Edit Project'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant='destructive'
                            size='icon'
                            title='Delete Project'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the project "{project.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteConfirm(project.id)}
                              className='bg-destructive hover:bg-destructive/90'
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className='text-muted-foreground text-center py-5'>
              No projects found. Add one to get started!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
