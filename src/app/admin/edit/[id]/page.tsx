// @/app/admin/edit/[id]/page.tsx
"use client";

import { useActionState } from "react";
import { useEffect, use, useState } from "react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProjectForm from "@/components/admin/project-form";
import { handleEditProject, fetchProjectForAdminEdit, type FormState } from "../../actions"; // Import fetchProjectForAdminEdit
// No longer directly importing from @/lib/projects
import type { Project } from "@/types/project";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


type PageParams = { id: string };
type EditProjectPageProps = {
  params: Promise<PageParams>; 
};

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const resolvedParams = use(params); 

  const [project, setProject] = useState<Project | null | undefined>(undefined); 
  const [loading, setLoading] = useState(true);
  
  const initialState: FormState = { message: "", success: false };
  const [state, formAction] = useActionState(handleEditProject, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function loadProject() { // Renamed for clarity
      if (resolvedParams?.id) {
        try {
          setLoading(true);
          const fetchedProject = await fetchProjectForAdminEdit(resolvedParams.id); // Use server action
          setProject(fetchedProject);
        } catch (error) {
          console.error("Failed to fetch project:", error);
          setProject(null); 
          toast({
            title: "Error",
            description: "Failed to load project data.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setProject(null); 
      }
    }
    loadProject();
  }, [resolvedParams, toast]);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
        action: state.success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />,
      });
      if (state.success) {
         router.push('/admin'); 
      }
    }
  }, [state, toast, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto py-8 text-center">
        <h1 className="font-headline text-3xl text-destructive mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-6">The project you are trying to edit does not exist or could not be loaded.</p>
        <Link href="/admin" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Panel
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 animate-in fade-in-0 duration-500">
      <Link href="/admin" passHref className="mb-6 inline-block">
        <Button variant="outline" className="group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Admin Panel
        </Button>
      </Link>
      
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">Edit Project: {project.title}</CardTitle>
          <CardDescription>Update the details for this project.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm
            formAction={formAction}
            initialState={state}
            project={project} 
            buttonText="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}
