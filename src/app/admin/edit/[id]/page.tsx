// @/app/admin/edit/[id]/page.tsx
"use client";

import { useActionState } from "react";
import { useEffect, use } from "react"; // Import use
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProjectForm from "@/components/admin/project-form";
import { handleEditProject, type FormState } from "../../actions"; 
import { getProjects } from "@/lib/projects"; 
import type { Project } from "@/types/project";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Helper to find project by ID since slugs can change
function getProjectById(id: string): Project | undefined {
  const projects = getProjects();
  return projects.find(p => p.id === id);
}

// Define the type for params, acknowledging it might be a Promise as per Next.js warning
type PageParams = { id: string };
type EditProjectPageProps = {
  params: Promise<PageParams>; // Next.js warning implies params will be a Promise
};

export default function EditProjectPage({ params }: EditProjectPageProps) {
  // Use React.use() to unwrap the params Promise
  const resolvedParams = use(params);
  const project = getProjectById(resolvedParams.id);
  
  const initialState: FormState = { message: "", success: false };
  const [state, formAction] = useActionState(handleEditProject, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
        action: state.success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />,
      });
      if (state.success) {
         router.push('/admin'); // Redirect to admin dashboard after successful edit
      }
    }
  }, [state, toast, router]);

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto py-8 text-center">
        <h1 className="font-headline text-3xl text-destructive mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-6">The project you are trying to edit does not exist.</p>
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
