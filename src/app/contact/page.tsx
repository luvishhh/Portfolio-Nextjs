// @/app/contact/page.tsx
"use client";

import { useActionState } from "react"; 
import { useFormStatus } from "react-dom"; 
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { submitContactForm, fetchContactPageData, type ContactFormState } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { MailCheck, AlertCircle, Loader2, User, Phone, Mail as MailIcon } from "lucide-react";
import type { ContactPageContent as ContactPageContentType } from "@/types/page-content";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? "Sending..." : "Send Message"}
    </Button>
  );
}

export default function ContactPage() {
  const initialState: ContactFormState = { message: "", success: false };
  const [state, formAction] = useActionState(submitContactForm, initialState); 
  const { toast } = useToast();
  const [content, setContent] = useState<ContactPageContentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() { 
      try {
        setLoading(true);
        const fetchedContent = await fetchContactPageData(); // Call the new server action
        setContent(fetchedContent);
      } catch (error) {
        console.error("Failed to fetch contact page content:", error);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Success!",
          description: state.message,
          variant: "default",
          action: <MailCheck className="h-5 w-5 text-green-500" />,
        });
      } else {
        toast({
          title: "Error",
          description: state.message || "An unexpected error occurred.",
          variant: "destructive",
          action: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
      }
    }
  }, [state, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
         <p className="ml-4 text-lg text-muted-foreground">Loading Contact Details...</p>
      </div>
    );
  }
  
  if (!content) {
     return <div className="text-center py-10">Failed to load content. Please try again later.</div>;
  }
  
  return (
    <div className="max-w-3xl mx-auto py-8 animate-in fade-in-0 duration-500">
      <Card className="shadow-xl bg-card mb-10">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl text-primary">{content.title}</CardTitle>
          <CardDescription className="text-lg">
            {content.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {(content.contactName || content.contactEmail || content.contactPhone) && (
        <Card className="shadow-lg bg-background/70 backdrop-blur-sm mb-10">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Contact Information</CardTitle>
            <CardDescription>You can also reach out to us directly:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.contactName && (
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3 text-accent" />
                <p className="text-foreground">{content.contactName}</p>
              </div>
            )}
            {content.contactEmail && (
              <div className="flex items-center">
                <MailIcon className="h-5 w-5 mr-3 text-accent" />
                <a href={`mailto:${content.contactEmail}`} className="text-foreground hover:text-primary underline">
                  {content.contactEmail}
                </a>
              </div>
            )}
            {content.contactPhone && (
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-accent" />
                <a href={`tel:${content.contactPhone}`} className="text-foreground hover:text-primary underline">
                  {content.contactPhone}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-xl bg-card">
        <CardHeader>
            <CardTitle className="font-headline text-2xl text-center text-primary">Send a Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="name" className="font-semibold">Full Name</Label>
              <Input id="name" name="name" type="text" placeholder="Your Name" required className="mt-1"/>
              {state.issues && state.fields?.name === "" && <p className="text-sm text-destructive mt-1">Name is required.</p>}
            </div>
            <div>
              <Label htmlFor="email" className="font-semibold">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="your.email@example.com" required className="mt-1"/>
              {state.issues && state.fields?.email === "" && <p className="text-sm text-destructive mt-1">Email is required.</p>}
            </div>
            <div>
              <Label htmlFor="subject" className="font-semibold">Subject (Optional)</Label>
              <Input id="subject" name="subject" type="text" placeholder="Project Inquiry" className="mt-1"/>
            </div>
            <div>
              <Label htmlFor="message" className="font-semibold">Message</Label>
              <Textarea id="message" name="message" placeholder="Tell us about your project or query..." required rows={5} className="mt-1"/>
              {state.issues && state.fields?.message === "" && <p className="text-sm text-destructive mt-1">Message is required.</p>}
            </div>
            {state.issues && !state.fields?.name && !state.fields?.email && !state.fields?.message && (
              <div className="text-sm text-destructive">
                {state.issues.map((issue) => (
                  <p key={issue}>{issue}</p>
                ))}
              </div>
            )}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
