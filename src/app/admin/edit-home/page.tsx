// @/app/admin/edit-home/page.tsx
"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HomeContentForm from "@/components/admin/home-content-form";
import { handleUpdateHomePageContent, type FormState } from "../actions";
import { getHomePageContent } from "@/lib/page-content";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditHomePageContentPage() {
  const currentContent = getHomePageContent(); // Fetch current content for form defaults
  const initialState: FormState = { message: "", success: false, fields: currentContent as any }; // Cast current content to fields for initial load if needed
  const [state, formAction] = useFormState(handleUpdateHomePageContent, initialState);
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
      // No automatic redirect on success for content pages, user might want to see changes or make more.
      // if (state.success) {
      //    router.push('/admin'); 
      // }
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
          <CardTitle className="font-headline text-3xl text-primary">Edit Home Page Content</CardTitle>
          <CardDescription>Update the text and calls to action on your main landing page.</CardDescription>
        </CardHeader>
        <CardContent>
          <HomeContentForm
            formAction={formAction}
            initialState={state}
            content={currentContent} // Pass current content to prefill the form
            buttonText="Save Home Page Content"
          />
        </CardContent>
      </Card>
    </div>
  );
}
