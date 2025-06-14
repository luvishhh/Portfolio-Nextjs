// @/app/admin/edit-contact/page.tsx
"use client";

import { useActionState } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import ContactContentForm from "@/components/admin/contact-content-form";
import { handleUpdateContactPageContent, type FormState } from "../actions";
import { getContactPageContent } from "@/lib/page-content";
import type { ContactPageContent as ContactPageContentType } from "@/types/page-content";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditContactPageContentPage() {
  const [currentContent, setCurrentContent] = useState<ContactPageContentType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initial state for useActionState
  const initialState: FormState = { message: "", success: false, fields: {} };
  const [state, formAction] = useActionState(handleUpdateContactPageContent, initialState);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const fetchedContent = await getContactPageContent();
        setCurrentContent(fetchedContent);
      } catch (error) {
        console.error("Failed to fetch contact page content for admin:", error);
        toast({
          title: "Error",
          description: "Could not load current contact page content.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
        action: state.success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />,
      });
       if (state.success && state.fields) {
        setCurrentContent(state.fields as ContactPageContentType);
      }
    }
  }, [state, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading Contact Page Editor...</p>
      </div>
    );
  }

  if (!currentContent) {
    return (
      <div className="max-w-3xl mx-auto py-8 text-center">
         <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <p className="text-muted-foreground mb-6">Could not load Contact page content for editing.</p>
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
          <CardTitle className="font-headline text-3xl text-primary">Edit Contact Page Content</CardTitle>
          <CardDescription>Update the introductory content for your contact page.</CardDescription>
        </CardHeader>
        <CardContent>
          <ContactContentForm
            formAction={formAction}
            initialState={state}
            content={currentContent}
            buttonText="Save Contact Page Content"
          />
        </CardContent>
      </Card>
    </div>
  );
}
