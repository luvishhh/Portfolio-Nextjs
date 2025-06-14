// @/components/admin/about-content-form.tsx
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { AboutPageContent } from "@/types/page-content";
import type { FormState } from "@/app/admin/actions";
import { AlertCircle, Loader2 } from "lucide-react";

interface AboutContentFormProps {
  formAction: (payload: FormData) => void;
  initialState: FormState;
  content: AboutPageContent;
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

export default function AboutContentForm({ formAction, initialState, content, buttonText = "Save Changes" }: AboutContentFormProps) {
  
  const fields = [
    { id: "mainTitle", label: "Main Title (e.g., 'Codename: Muse')", type: "text", defaultValue: content.mainTitle, required: true },
    { id: "mainSubtitle", label: "Main Subtitle (e.g., 'Architect of Digital Realities...')", type: "text", defaultValue: content.mainSubtitle, required: true },
    { id: "greeting", label: "Greeting Text", type: "text", defaultValue: content.greeting, required: true },
    { id: "name", label: "Your Name/Alias", type: "text", defaultValue: content.name, required: true },
    { id: "introduction", label: "Introduction Paragraph", type: "textarea", defaultValue: content.introduction, required: true, rows: 4 },
    { id: "philosophy", label: "Philosophy Paragraph", type: "textarea", defaultValue: content.philosophy, required: true, rows: 3 },
    { id: "futureFocus", label: "Future Focus Paragraph", type: "textarea", defaultValue: content.futureFocus, required: true, rows: 3 },
    { id: "profileImage", label: "Profile Image URL", type: "url", defaultValue: content.profileImage, required: true, placeholder: "https://placehold.co/400x400.png" },
    { id: "dataAiHint", label: "Profile Image AI Hint", type: "text", defaultValue: content.dataAiHint, placeholder: "e.g. futuristic avatar" },
    { id: "coreCompetenciesTitle", label: "Core Competencies Section Title", type: "text", defaultValue: content.coreCompetenciesTitle, required: true },
    { id: "coreCompetenciesSubtitle", label: "Core Competencies Section Subtitle", type: "text", defaultValue: content.coreCompetenciesSubtitle, required: true },
    { id: "chroniclesTitle", label: "Chronicles Section Title", type: "text", defaultValue: content.chroniclesTitle, required: true },
    { id: "chroniclesSubtitle", label: "Chronicles Section Subtitle", type: "text", defaultValue: content.chroniclesSubtitle, required: true },
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
              defaultValue={initialState.fields?.[field.id] ?? field.defaultValue}
              required={field.required}
              rows={field.rows || 3}
              className="mt-1"
              placeholder={field.placeholder}
            />
          ) : (
            <Input
              id={field.id}
              name={field.id}
              type={field.type}
              defaultValue={initialState.fields?.[field.id] ?? field.defaultValue}
              required={field.required}
              className="mt-1"
              placeholder={field.placeholder}
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
