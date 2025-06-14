
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
  
  // Use `initialState.fields` if available (after a submission), otherwise use `content` (for initial load)
  const currentFieldValues = initialState?.fields ? initialState.fields as unknown as AboutPageContent : content;


  const fields = [
    // General Info
    { id: "mainTitle", label: "Main Title (e.g., 'Codename: Muse')", type: "text", defaultValue: currentFieldValues.mainTitle, required: true },
    { id: "mainSubtitle", label: "Main Subtitle (e.g., 'Architect of Digital Realities...')", type: "text", defaultValue: currentFieldValues.mainSubtitle, required: true },
    { id: "greeting", label: "Greeting Text", type: "text", defaultValue: currentFieldValues.greeting, required: true },
    { id: "name", label: "Your Name/Alias (Used in intro and Profile Card)", type: "text", defaultValue: currentFieldValues.name, required: true },
    { id: "introduction", label: "Introduction Paragraph", type: "textarea", defaultValue: currentFieldValues.introduction, required: true, rows: 4 },
    { id: "philosophy", label: "Philosophy Paragraph", type: "textarea", defaultValue: currentFieldValues.philosophy, required: true, rows: 3 },
    { id: "futureFocus", label: "Future Focus Paragraph", type: "textarea", defaultValue: currentFieldValues.futureFocus, required: true, rows: 3 },
    // Profile Image
    { id: "profileImageFile", label: "Profile Image Upload (Replaces current if new file selected)", type: "file", required: false }, // Not strictly required if an image already exists
    { id: "dataAiHint", label: "Profile Image AI Hint (Max 2 words)", type: "text", defaultValue: currentFieldValues.dataAiHint, placeholder: "e.g. futuristic avatar" },
    // Profile Card Specific Text
    { id: "profileCardTitle", label: "Profile Card - Title (e.g., 'Digital Artisan')", type: "text", defaultValue: currentFieldValues.profileCardTitle, required: true },
    { id: "profileCardHandle", label: "Profile Card - Handle (e.g., '@Muse_AI')", type: "text", defaultValue: currentFieldValues.profileCardHandle, required: true },
    { id: "profileCardStatus", label: "Profile Card - Status (e.g., 'Online')", type: "text", defaultValue: currentFieldValues.profileCardStatus, required: true },
    { id: "profileCardContactText", label: "Profile Card - Contact Button Text", type: "text", defaultValue: currentFieldValues.profileCardContactText, required: true },
    // Sections Titles
    { id: "coreCompetenciesTitle", label: "Core Competencies Section Title", type: "text", defaultValue: currentFieldValues.coreCompetenciesTitle, required: true },
    { id: "coreCompetenciesSubtitle", label: "Core Competencies Section Subtitle", type: "text", defaultValue: currentFieldValues.coreCompetenciesSubtitle, required: true },
    { id: "chroniclesTitle", label: "Chronicles (Experience) Section Title", type: "text", defaultValue: currentFieldValues.chroniclesTitle, required: true },
    { id: "chroniclesSubtitle", label: "Chronicles (Experience) Section Subtitle", type: "text", defaultValue: currentFieldValues.chroniclesSubtitle, required: true },
    // Experience Items (JSON)
    { 
      id: "experienceItemsJSON", 
      label: "Experience Timeline Items (JSON format)", 
      type: "textarea", 
      // Ensure experienceItems is stringified from currentFieldValues or default to empty array string
      defaultValue: JSON.stringify(currentFieldValues.experienceItems || [], null, 2), 
      required: false, 
      rows: 12, // Increased rows
      description: "Enter an array of experience items. Each item should be an object. Example: [{\"id\": \"1\", \"title\": \"Lead Designer\", \"company\": \"Tech Corp\", \"period\": \"2020 - Present\", \"description\": \"Led design team.\", \"iconName\": \"Zap\"}]. Ensure valid JSON. Icon names are from lucide-react (e.g., Zap, Briefcase, Code, Lightbulb, BrainCircuit, Building).",
      className: "font-mono text-sm"
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
              defaultValue={field.defaultValue as string} // Use resolved default value
              required={field.required}
              rows={(field.rows as number) || 3}
              className={`mt-1 ${field.className || ''}`}
              placeholder={field.placeholder}
            />
          ) : field.type === "file" ? (
            <div className="mt-1">
              <div className="flex items-center space-x-2">
                <FileImage className="h-5 w-5 text-muted-foreground" />
                <Input
                  id={field.id}
                  name={field.id}
                  type="file"
                  accept="image/*"
                  className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
              {field.id === "profileImageFile" && currentFieldValues.profileImage && (
                <p className="text-xs text-muted-foreground mt-1">Current profile image: <a href={currentFieldValues.profileImage} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{currentFieldValues.profileImage.substring(0,50)}...</a></p>
              )}
            </div>
          ) : (
            <Input
              id={field.id}
              name={field.id}
              type={field.type}
              defaultValue={field.defaultValue as string | number} // Use resolved default value
              required={field.required}
              className={`mt-1 ${field.className || ''}`}
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
