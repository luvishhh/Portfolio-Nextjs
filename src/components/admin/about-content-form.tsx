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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AboutContentFormProps {
  formAction: (payload: FormData) => void;
  initialState: FormState;
  content: AboutPageContent;
  buttonText?: string;
}

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground mt-6">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Saving..." : text}
    </Button>
  );
}

export default function AboutContentForm({ formAction, initialState, content, buttonText = "Save Changes" }: AboutContentFormProps) {

  // Corrected logic:
  // Use initialState.fields if a form action has occurred (indicated by initialState.message being set).
  // Otherwise (on initial load), use the fetched 'content'.
  const currentFieldValues = (initialState?.message && initialState.fields)
    ? initialState.fields as AboutPageContent & {[key: string]: any}
    : content;

  const sections = [
    {
      title: "Main Page Information",
      description: "Set the primary titles, introduction, and personal narrative for your About page.",
      fields: [
        { id: "mainTitle", label: "Main Title (e.g., 'Codename: Muse')", type: "text", defaultValue: currentFieldValues?.mainTitle, required: true },
        { id: "mainSubtitle", label: "Main Subtitle (e.g., 'Architect of Digital Realities...')", type: "text", defaultValue: currentFieldValues?.mainSubtitle, required: true },
        { id: "greeting", label: "Greeting Text", type: "text", defaultValue: currentFieldValues?.greeting, required: true },
        { id: "name", label: "Your Name/Alias", type: "text", defaultValue: currentFieldValues?.name, required: true },
        { id: "introduction", label: "Introduction Paragraph", type: "textarea", defaultValue: currentFieldValues?.introduction, required: true, rows: 4 },
        { id: "philosophy", label: "Philosophy Paragraph", type: "textarea", defaultValue: currentFieldValues?.philosophy, required: true, rows: 3 },
        { id: "futureFocus", label: "Future Focus Paragraph", type: "textarea", defaultValue: currentFieldValues?.futureFocus, required: true, rows: 3 },
      ]
    },
    {
      title: "Profile Card Details",
      description: "Customize the appearance and text of the interactive profile card.",
      fields: [
        { id: "profileImageFile", label: "Profile Image Upload", type: "file", required: false, description: `Current: ${currentFieldValues?.profileImage ? currentFieldValues.profileImage.substring(0,70)+'...' : 'None'}. Replaces current if new file selected.` },
        { id: "dataAiHint", label: "Profile Image AI Hint (Max 2 words)", type: "text", defaultValue: currentFieldValues?.dataAiHint, placeholder: "e.g. futuristic avatar" },
        { id: "profileCardTitle", label: "Profile Card - Title", type: "text", defaultValue: currentFieldValues?.profileCardTitle, required: true },
        { id: "profileCardHandle", label: "Profile Card - Handle", type: "text", defaultValue: currentFieldValues?.profileCardHandle, required: true },
        { id: "profileCardStatus", label: "Profile Card - Status", type: "text", defaultValue: currentFieldValues?.profileCardStatus, required: true },
        { id: "profileCardContactText", label: "Profile Card - Contact Button Text", type: "text", defaultValue: currentFieldValues?.profileCardContactText, required: true },
      ]
    },
    {
      title: "Skills Section (Core Competencies)",
      description: "Define the title, subtitle, and list of skills for this section.",
      fields: [
        { id: "coreCompetenciesTitle", label: "Section Title", type: "text", defaultValue: currentFieldValues?.coreCompetenciesTitle, required: true },
        { id: "coreCompetenciesSubtitle", label: "Section Subtitle", type: "text", defaultValue: currentFieldValues?.coreCompetenciesSubtitle, required: true },
        {
          id: "skillsJSON",
          label: "Skills (JSON format)",
          type: "textarea",
          defaultValue: typeof currentFieldValues?.skillsJSON === 'string' 
            ? currentFieldValues.skillsJSON 
            : JSON.stringify(currentFieldValues?.skills || [], null, 2),
          required: false,
          rows: 10,
          description: "Array of skill items. Each: {\"name\": string, \"iconName\": string (Lucide icon e.g. Cpu), \"level\": string}. Ensure valid JSON.",
          className: "font-mono text-sm"
        },
      ]
    },
    {
      title: "Experience Section (Chronicles)",
      description: "Set the title, subtitle, and timeline of your professional experience.",
      fields: [
        { id: "chroniclesTitle", label: "Section Title", type: "text", defaultValue: currentFieldValues?.chroniclesTitle, required: true },
        { id: "chroniclesSubtitle", label: "Section Subtitle", type: "text", defaultValue: currentFieldValues?.chroniclesSubtitle, required: true },
        {
          id: "experienceItemsJSON",
          label: "Experience Timeline Items (JSON format)",
          type: "textarea",
          defaultValue: typeof currentFieldValues?.experienceItemsJSON === 'string' 
            ? currentFieldValues.experienceItemsJSON 
            : JSON.stringify(currentFieldValues?.experienceItems || [], null, 2),
          required: false,
          rows: 12,
          description: "Array of experience items. Each: {\"id\": string, \"title\": string, \"company\": string, \"period\": string, \"description\": string, \"iconName\": string (Lucide e.g. Zap)}. Ensure valid JSON.",
          className: "font-mono text-sm"
        },
      ]
    }
  ];

  return (
    <form action={formAction} className="space-y-8">
      {sections.map(section => (
        <Card key={section.title} className="shadow-md bg-background/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">{section.title}</CardTitle>
            {section.description && <CardDescription>{section.description}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-6">
            {section.fields.map(field => (
              <div key={field.id}>
                <Label htmlFor={field.id} className="font-semibold">{field.label}{field.required && <span className="text-destructive">*</span>}</Label>
                {field.description && !field.type?.includes("file") && ( 
                  <p className="text-xs text-muted-foreground mt-0.5 mb-1.5 flex items-start">
                    <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    {field.description}
                  </p>
                )}
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.id}
                    name={field.id}
                    defaultValue={field.defaultValue as string ?? ""} 
                    required={field.required}
                    rows={(field.rows as number) || 3}
                    className={`mt-1 ${field.className || ''}`}
                    placeholder={field.placeholder}
                  />
                ) : field.type === "file" ? (
                  <div className="mt-1">
                     {field.description && ( 
                      <p className="text-xs text-muted-foreground mt-0.5 mb-1.5 flex items-start">
                        <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                        {field.description}
                      </p>
                    )}
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
                  </div>
                ) : (
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    defaultValue={field.defaultValue as string | number ?? ""}
                    required={field.required}
                    className={`mt-1 ${field.className || ''}`}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {initialState?.issues && initialState.issues.length > 0 && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mt-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Please correct the following errors:</p>
              <ul className="list-disc list-inside space-y-0.5">
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
