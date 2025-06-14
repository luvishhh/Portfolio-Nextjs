// @/app/ai-assistant/page.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getDesignRecommendationsAction, type AIAssistantFormState } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Wand2, AlertCircle, CheckCircle, Loader2, Sparkles } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      {pending ? "Generating..." : "Get Recommendations"}
    </Button>
  );
}

export default function AiAssistantPage() {
  const initialState: AIAssistantFormState = { message: "", success: false, recommendations: [] };
  const [state, formAction] = useFormState(getDesignRecommendationsAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.success && !state.recommendations?.length) { // Only toast errors or specific messages
        toast({
          title: state.success ? "Success" : "Notice",
          description: state.message,
          variant: state.success ? "default" : "destructive",
          action: state.success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />,
        });
    }
  }, [state, toast]);

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in-0 duration-500">
      <Card className="shadow-xl bg-card">
        <CardHeader className="text-center">
          <Wand2 className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle className="font-headline text-4xl text-primary">AI Design Assistant</CardTitle>
          <CardDescription className="text-lg">
            Describe your project's current style, and our AI will provide design recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="projectStyleDescription" className="font-semibold">Project Style Description</Label>
              <Textarea
                id="projectStyleDescription"
                name="projectStyleDescription"
                placeholder="e.g., Minimalist, dark theme, with blue accents and geometric patterns. Focus on readability..."
                required
                rows={6}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="desiredNumberOfRecommendations" className="font-semibold">Number of Recommendations</Label>
              <Input
                id="desiredNumberOfRecommendations"
                name="desiredNumberOfRecommendations"
                type="number"
                defaultValue="3"
                min="1"
                max="10"
                required
                className="mt-1"
              />
            </div>
            {state.issues && (
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

      {state.success && state.recommendations && state.recommendations.length > 0 && (
        <Card className="mt-8 shadow-lg bg-background animate-in fade-in-0 duration-500">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center text-primary">
              <Sparkles className="mr-2 h-6 w-6"/> Generated Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-3 text-foreground/90">
              {state.recommendations.map((rec, index) => (
                <li key={index} className="text-md leading-relaxed">{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

