// @/app/admin/edit-about/page.tsx
"use client";

import { useActionState } from "react"; // Changed from react-dom
import { useEffect } from "react";
import Link from "next/link";
import AboutContentForm from "@/components/admin/about-content-form"; 
import { handleUpdateAboutPageContent, type FormState } from "../actions";
import { getAboutPageContent } from "@/lib/page-content";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditAboutPageContentPage() {
  const currentContent = getAboutPageContent();
  const initialState: FormState = { message: "", success: false, fields: currentContent as any };
  const [state, formAction] = useActionState(handleUpdateAboutPageContent, initialState); // Changed from useFormState
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
        action: state.success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />,
      });
    }
  }, [state, toast]);

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
          <CardTitle className="font-headline text-3xl text-primary">Edit About Page Content</CardTitle>
          <CardDescription>Update the content for your "About Me" page.</CardDescription>
        </CardHeader>
        <CardContent>
          <AboutContentForm
            formAction={formAction}
            initialState={state}
            content={currentContent}
            buttonText="Save About Page Content"
          />
        </CardContent>
      </Card>
    </div>
  );
}
