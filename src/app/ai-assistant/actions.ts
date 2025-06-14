// @/app/ai-assistant/actions.ts
"use server";

import { z } from "zod";
import { generateDesignRecommendations, type GenerateDesignRecommendationsInput } from "@/ai/flows/generate-design-recommendations";

const aiAssistantFormSchema = z.object({
  projectStyleDescription: z.string().min(20, { message: "Description must be at least 20 characters." }),
  desiredNumberOfRecommendations: z.coerce.number().min(1, {message: "Please request at least 1 recommendation."}).max(10, {message: "Cannot request more than 10 recommendations."}),
});

export type AIAssistantFormState = {
  message: string;
  recommendations?: string[];
  issues?: string[];
  success: boolean;
};

export async function getDesignRecommendationsAction(
  prevState: AIAssistantFormState,
  data: FormData
): Promise<AIAssistantFormState> {
  const formData = Object.fromEntries(data);
  const parsed = aiAssistantFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data.",
      issues: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  try {
    const aiInput: GenerateDesignRecommendationsInput = {
      projectStyleDescription: parsed.data.projectStyleDescription,
      desiredNumberOfRecommendations: parsed.data.desiredNumberOfRecommendations,
    };
    
    const result = await generateDesignRecommendations(aiInput);

    if (result && result.recommendations) {
      return {
        message: "Design recommendations generated successfully!",
        recommendations: result.recommendations,
        success: true,
      };
    } else {
      return {
        message: "AI could not generate recommendations at this time.",
        success: false,
      };
    }
  } catch (error) {
    console.error("Error calling AI flow:", error);
    return {
      message: "An error occurred while generating recommendations. Please try again.",
      success: false,
    };
  }
}
