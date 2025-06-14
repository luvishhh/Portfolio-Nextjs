// @/components/admin/about-content-form.tsx
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { AboutPageContent } from "@/types/page-content";
import type { FormState } from "@/app/admin/actions";
import { AlertCircle, Loader2, FileImage, Info } from "lucide-react";
import type { ExperienceItem } from "@/types/experience";

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
    // General Info
    { id: "mainTitle", label: "Main Title (e.g., 'Codename: Muse')", type: "text", defaultValue: content.mainTitle, required: true },
    { id: "mainSubtitle", label: "Main Subtitle (e.g., 'Architect of Digital Realities...')", type: "text", defaultValue: content.mainSubtitle, required: true },
    { id: "greeting", label: "Greeting Text", type: "text", defaultValue: content.greeting, required: true },
    { id: "name", label: "Your Name/Alias (Used in intro and Profile Card)", type: "text", defaultValue: content.name, required: true },
    { id: "introduction", label: "Introduction Paragraph", type: "textarea", defaultValue: content.introduction, required: true, rows: 4 },
    { id: "philosophy", label: "Philosophy Paragraph", type: "textarea", defaultValue: content.philosophy, required: true, rows: 3 },
    { id: "futureFocus", label: "Future Focus Paragraph", type: "textarea", defaultValue: content.futureFocus, required: true, rows: 3 },
    // Profile Image
    { id: "profileImageFile", label: "Profile Image Upload", type: "file", required: !content.profileImage },
    { id: "dataAiHint", label: "Profile Image AI Hint", type: "text", defaultValue: content.dataAiHint, placeholder: "e.g. futuristic avatar" },
    // Profile Card Specific Text
    { id: "profileCardTitle", label: "Profile Card - Title (e.g., 'Digital Artisan')", type: "text", defaultValue: content.profileCardTitle, required: true },
    { id: "profileCardHandle", label: "Profile Card - Handle (e.g., '@Muse_AI')", type: "text", defaultValue: content.profileCardHandle, required: true },
    { id: "profileCardStatus", label: "Profile Card - Status (e.g., 'Online')", type: "text", defaultValue: content.profileCardStatus, required: true },
    { id: "profileCardContactText", label: "Profile Card - Contact Button Text", type: "text", defaultValue: content.profileCardContactText, required: true },
    // Sections Titles
    { id: "coreCompetenciesTitle", label: "Core Competencies Section Title", type: "text", defaultValue: content.coreCompetenciesTitle, required: true },
    { id: "coreCompetenciesSubtitle", label: "Core Competencies Section Subtitle", type: "text", defaultValue: content.coreCompetenciesSubtitle, required: true },
    { id: "chroniclesTitle", label: "Chronicles (Experience) Section Title", type: "text", defaultValue: content.chroniclesTitle, required: true },
    { id: "chroniclesSubtitle", label: "Chronicles (Experience) Section Subtitle", type: "text", defaultValue: content.chroniclesSubtitle, required: true },
    // Experience Items (JSON)
    { 
      id: "experienceItemsJSON", 
      label: "Experience Timeline Items (JSON format)", 
      type: "textarea", 
      defaultValue: JSON.stringify(content.experienceItems || [], null, 2), 
      required: false, 
      rows: 10,
      description: "Enter an array of experience items. Each item should be an object with: id (string), title (string), company (string), period (string), description (string), iconName (string, optional, e.g., 'Zap'). Ensure valid JSON."
    },
  ];

  return (
    <form action={formAction} className="space-y-6">
      {fields.map(field => (
        <div key={field.id}>
          <Label htmlFor={field.id} className="font-semibold">{field.label}{field.required && <span className="text-destructive">*</span>}</Label>
          {field.description && (
            <p className="text-xs text-muted-foreground mt-0.5 mb-1.5 flex items-start">
              <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" /> 
              {field.description}
            </p>
          )}
          {field.type === "textarea" ? (
            <Textarea
              id={field.id}
              name={field.id}
              defaultValue={initialState.fields?.[field.id] as string ?? field.defaultValue as string}
              required={field.required}
              rows={(field.rows as number) || 3}
              className="mt-1 font-mono text-sm"
              placeholder={field.placeholder}
            />
          ) : field.type === "file" ? (
            <div className="mt-1 flex items-center space-x-2">
               <FileImage className="h-5 w-5 text-muted-foreground" />
              <Input
                id={field.id}
                name={field.id}
                type="file"
                accept="image/*"
                className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
          ) : (
            <Input
              id={field.id}
              name={field.id}
              type={field.type}
              defaultValue={initialState.fields?.[field.id] as string ?? field.defaultValue as string}
              required={field.required}
              className="mt-1"
              placeholder={field.placeholder}
            />
          )}
          {field.id === "profileImageFile" && content.profileImage && (
            <p className="text-xs text-muted-foreground mt-1">Current profile image: <a href={content.profileImage} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{content.profileImage.substring(0,50)}...</a>. Uploading a new file will replace it.</p>
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
