// @/components/admin/home-content-form.tsx
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { HomePageContent } from "@/types/page-content";
import type { FormState } from "@/app/admin/actions"; // Assuming FormState is general enough
import { AlertCircle, Loader2 } from "lucide-react";

interface HomeContentFormProps {
  formAction: (payload: FormData) => void;
  initialState: FormState;
  content: HomePageContent;
  buttonText?: string;
}

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Saving..." : text}
    </Button>
  );
}

export default function HomeContentForm({ formAction, initialState, content, buttonText = "Save Changes" }: HomeContentFormProps) {
  
  const fields = [
    { id: "heroTitle", label: "Hero Section Title", type: "text", defaultValue: content.heroTitle, required: true },
    { id: "heroSubtitle", label: "Hero Section Subtitle", type: "textarea", defaultValue: content.heroSubtitle, required: true, rows: 3 },
    { id: "heroButtonExplore", label: "Hero 'Explore Projects' Button Text", type: "text", defaultValue: content.heroButtonExplore, required: true },
    { id: "heroButtonContact", label: "Hero 'Get In Touch' Button Text", type: "text", defaultValue: content.heroButtonContact, required: true },
    { id: "featuredWorkTitle", label: "Featured Work Section Title", type: "text", defaultValue: content.featuredWorkTitle, required: true },
    { id: "featuredWorkViewAll", label: "'View All Projects' Link Text", type: "text", defaultValue: content.featuredWorkViewAll, required: true },
    { id: "aiAssistantTitle", label: "AI Assistant CTA Title", type: "text", defaultValue: content.aiAssistantTitle, required: true },
    { id: "aiAssistantSubtitle", label: "AI Assistant CTA Subtitle", type: "textarea", defaultValue: content.aiAssistantSubtitle, required: true, rows: 2 },
    { id: "aiAssistantButton", label: "AI Assistant CTA Button Text", type: "text", defaultValue: content.aiAssistantButton, required: true },
  ];

  return (
    <form action={formAction} className="space-y-6">
      {fields.map(field => (
        <div key={field.id}>
          <Label htmlFor={field.id} className="font-semibold">{field.label}{field.required && <span className="text-destructive">*</span>}</Label>
          {field.type === "textarea" ? (
            <Textarea
              id={field.id}
              name={field.id}
              defaultValue={field.defaultValue}
              required={field.required}
              rows={field.rows || 3}
              className="mt-1"
            />
          ) : (
            <Input
              id={field.id}
              name={field.id}
              type={field.type}
              defaultValue={field.defaultValue}
              required={field.required}
              className="mt-1"
            />
          )}
        </div>
      ))}

      {initialState?.issues && initialState.issues.length > 0 && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Please correct the following errors:</p>
              <ul className="list-disc list-inside">
                {initialState.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      <SubmitButton text={buttonText} />
    </form>
  );
}
