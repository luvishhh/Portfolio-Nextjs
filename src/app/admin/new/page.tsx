// @/app/admin/new/page.tsx
"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProjectForm from "@/components/admin/project-form";
import { handleAddProject, type FormState } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function NewProjectPage() {
  const initialState: FormState = { message: "", success: false };
  const [state, formAction] = useFormState(handleAddProject, initialState);
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
      if (state.success && state.projectId) {
        // Optionally redirect to admin page or the new project's edit page
        // router.push(`/admin/edit/${state.projectId}`);
         router.push('/admin'); // Redirect to admin dashboard
      }
    }
  }, [state, toast, router]);

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
          <CardTitle className="font-headline text-3xl text-primary">Add New Project</CardTitle>
          <CardDescription>Fill in the details below to add a new project to your portfolio.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm
            formAction={formAction}
            initialState={state}
            buttonText="Add Project"
          />
        </CardContent>
      </Card>
    </div>
  );
}

