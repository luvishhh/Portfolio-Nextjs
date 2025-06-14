// @/app/admin/page.tsx
"use client"; // Make this a client component to handle delete confirmation

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getProjects } from '@/lib/projects'; // Direct import for display
import type { Project } from '@/types/project';
import { handleDeleteProject } from './actions';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, ExternalLink, Eye } from 'lucide-react';

export default function AdminPage() {
  // Forcing dynamic rendering to see updates from actions
  // This is a workaround for in-memory data store. With a DB, revalidatePath would be primary.
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  // Function to fetch projects, can be called to refresh
  const fetchProjects = () => {
    const currentProjects = getProjects(); // This gets the current state of in-memory projectsData
    setProjects([...currentProjects]); // Create new array reference to trigger re-render
  };

  useEffect(() => {
    fetchProjects();
  }, []);


  const onDeleteConfirm = async (projectId: string) => {
    const result = await handleDeleteProject(projectId);
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
    if (result.success) {
      fetchProjects(); // Re-fetch to update list
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-4xl font-bold text-primary">Admin Panel</h1>
        <Link href="/admin/new" passHref>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Project
          </Button>
        </Link>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Manage Projects</h2>
        {projects.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.featured ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/projects/${project.slug}`} passHref target="_blank">
                      <Button variant="outline" size="icon" title="View Project">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/edit/${project.id}`} passHref>
                      <Button variant="outline" size="icon" title="Edit Project">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" title="Delete Project">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project "{project.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteConfirm(project.id)} className="bg-destructive hover:bg-destructive/90">
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
          <p className="text-muted-foreground">No projects found. Add one to get started!</p>
        )}
      </div>
    </div>
  );
}

