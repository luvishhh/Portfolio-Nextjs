// @/components/admin/contact-content-form.tsx
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ContactPageContent } from "@/types/page-content";
import type { FormState } from "@/app/admin/actions";
import { AlertCircle, Loader2 } from "lucide-react";

interface ContactContentFormProps {
  formAction: (payload: FormData) => void;
  initialState: FormState;
  content: ContactPageContent;
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

export default function ContactContentForm({ formAction, initialState, content, buttonText = "Save Changes" }: ContactContentFormProps) {
  
  const fields = [
    { id: "title", label: "Page Title (e.g., 'Get In Touch')", type: "text", defaultValue: content.title, required: true },
    { id: "description", label: "Page Description (Text above the form)", type: "textarea", defaultValue: content.description, required: true, rows: 3 },
    { id: "contactName", label: "Contact Name", type: "text", defaultValue: content.contactName, placeholder: "Your Full Name" },
    { id: "contactEmail", label: "Contact Email Address", type: "email", defaultValue: content.contactEmail, placeholder: "email@example.com" },
    { id: "contactPhone", label: "Contact Phone Number (Optional)", type: "tel", defaultValue: content.contactPhone, placeholder: "+1 555-123-4567" },
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
