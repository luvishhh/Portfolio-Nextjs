// @/app/admin/edit-about/page.tsx
"use client";

import { useActionState } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import AboutContentForm from "@/components/admin/about-content-form"; 
import { handleUpdateAboutPageContent, type FormState } from "../actions";
import { getAboutPageContent } from "@/lib/page-content";
import type { AboutPageContent } from "@/types/page-content";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditAboutPageContentPage() {
  const [currentContent, setCurrentContent] = useState<AboutPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Initial state for useActionState needs to be set before async data fetching for the form.
  // We'll pass the fetched content to the form once available.
  const initialState: FormState = { message: "", success: false, fields: {} }; 
  const [state, formAction] = useActionState(handleUpdateAboutPageContent, initialState);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const fetchedContent = await getAboutPageContent();
        setCurrentContent(fetchedContent);
        // If formAction needs initial fields from fetchedContent and it's not already handled by form logic
        // we might update a ref or a separate state for it.
        // For now, AboutContentForm takes 'content' prop directly.
      } catch (error) {
        console.error("Failed to fetch about page content for admin:", error);
        toast({
          title: "Error",
          description: "Could not load current about page content.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch only on mount

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
        action: state.success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />,
      });
      if (state.success && state.fields) {
        // Update local state with the successful fields to re-render form with new defaults
         setCurrentContent(state.fields as AboutPageContent);
      }
    }
  }, [state, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading About Page Editor...</p>
      </div>
    );
  }

  if (!currentContent) {
    return (
      <div className="max-w-3xl mx-auto py-8 text-center">
         <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <p className="text-muted-foreground mb-6">Could not load About page content for editing.</p>
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
          <CardTitle className="font-headline text-3xl text-primary">Edit About Page Content</CardTitle>
          <CardDescription>Update the content for your "About Me" page.</CardDescription>
        </CardHeader>
        <CardContent>
          <AboutContentForm
            formAction={formAction}
            initialState={state} // This state is for the form submission result
            content={currentContent} // This is the asynchronously fetched content for form defaults
            buttonText="Save About Page Content"
          />
        </CardContent>
      </Card>
    </div>
  );
}
