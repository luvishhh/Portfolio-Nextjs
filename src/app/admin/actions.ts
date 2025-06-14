// @/app/admin/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addProject as dbAddProject, updateProject as dbUpdateProject, deleteProject as dbDeleteProject } from "@/lib/projects";
import type { Project } from "@/types/project";
import { updateHomePageContent, updateAboutPageContent, updateContactPageContent } from "@/lib/page-content"; // Added page content updaters
import type { HomePageContent, AboutPageContent, ContactPageContent } from "@/types/page-content"; // Added page content types

const projectSchemaBase = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  detailedDescription: z.string().min(20, "Detailed description must be at least 20 characters."),
  images: z.string().min(1, "At least one image URL is required.").transform(val => val.split(',').map(s => s.trim()).filter(s => s.length > 0)),
  featured: z.preprocess((val) => val === 'on' || val === true, z.boolean().default(false)),
  tags: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()).filter(s => s.length > 0) : []),
  liveLink: z.string().url().optional().or(z.literal('')),
  repoLink: z.string().url().optional().or(z.literal('')),
  year: z.coerce.number().optional(),
  client: z.string().optional(),
  role: z.string().optional(),
  technologies: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()).filter(s => s.length > 0) : []),
  dataAiHint: z.string().optional(),
});

const addProjectSchema = projectSchemaBase;
const editProjectSchema = projectSchemaBase.extend({
  id: z.string(),
});


export type FormState = {
  message: string;
  issues?: string[];
  fields?: Record<string, string>;
  success: boolean;
  projectId?: string; // For project actions
};

export async function handleAddProject(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = addProjectSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid project data.",
      issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      fields: formData as Record<string, string>,
      success: false,
    };
  }

  try {
    const newProject = dbAddProject(parsed.data as Omit<Project, 'id' | 'slug'>);
    revalidatePath("/admin");
    revalidatePath("/projects");
    revalidatePath("/");
    return { message: `Project "${newProject.title}" added successfully!`, success: true, projectId: newProject.id };
  } catch (error) {
    return { message: "Failed to add project.", success: false };
  }
}

export async function handleEditProject(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = editProjectSchema.safeParse(formData);
  
  if (!parsed.success) {
    return {
      message: "Invalid project data for editing.",
      issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      fields: formData as Record<string, string>,
      success: false,
    };
  }

  try {
    const { id, ...updateData } = parsed.data;
    const updatedProject = dbUpdateProject(id, updateData as Partial<Omit<Project, 'id' | 'slug'>>);
    if (!updatedProject) {
      return { message: "Project not found for editing.", success: false };
    }
    revalidatePath("/admin");
    revalidatePath(`/projects/${updatedProject.slug}`);
    revalidatePath("/projects");
    revalidatePath("/");
    return { message: `Project "${updatedProject.title}" updated successfully!`, success: true, projectId: updatedProject.id };
  } catch (error) {
    return { message: "Failed to update project.", success: false };
  }
}

export async function handleDeleteProject(id: string): Promise<{success: boolean, message: string}> {
  try {
    const success = dbDeleteProject(id);
    if (!success) {
      return { success: false, message: "Project not found or already deleted." };
    }
    revalidatePath("/admin");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true, message: "Project deleted successfully." };
  } catch (error) {
    return { success: false, message: "Failed to delete project." };
  }
}

// Schema for Home Page Content
const homePageContentSchema = z.object({
  heroTitle: z.string().min(5, "Hero title must be at least 5 characters."),
  heroSubtitle: z.string().min(10, "Hero subtitle must be at least 10 characters."),
  heroButtonExplore: z.string().min(3, "Explore button text is too short."),
  heroButtonContact: z.string().min(3, "Contact button text is too short."),
  featuredWorkTitle: z.string().min(5, "Featured work title is too short."),
  featuredWorkViewAll: z.string().min(5, "View all button text is too short."),
  aiAssistantTitle: z.string().min(5, "AI assistant title is too short."),
  aiAssistantSubtitle: z.string().min(10, "AI assistant subtitle is too short."),
  aiAssistantButton: z.string().min(3, "AI assistant button text is too short."),
});

// Action to update Home Page Content
export async function handleUpdateHomePageContent(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = homePageContentSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid home page content data.",
      issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      fields: formData as Record<string, string>,
      success: false,
    };
  }

  try {
    updateHomePageContent(parsed.data as HomePageContent);
    // revalidatePath is called within updateHomePageContent
    return { message: "Home page content updated successfully!", success: true };
  } catch (error) {
    let message = "Failed to update home page content.";
    if (error instanceof Error) {
        message = error.message;
    }
    return { message, success: false };
  }
}

// Placeholder Schemas and Actions for About and Contact pages for future implementation
// About Page Content Schema
const aboutPageContentSchema = z.object({
  greeting: z.string().min(5),
  name: z.string().min(3),
  introduction: z.string().min(20),
  philosophy: z.string().min(20),
  futureFocus: z.string().min(20),
  profileImage: z.string().url().or(z.literal('')),
  dataAiHint: z.string().optional(),
  coreCompetenciesTitle: z.string().min(5),
  coreCompetenciesSubtitle: z.string().min(10),
  chroniclesTitle: z.string().min(5),
  chroniclesSubtitle: z.string().min(10),
});

export async function handleUpdateAboutPageContent(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = aboutPageContentSchema.safeParse(formData);
  if (!parsed.success) {
    return { message: "Invalid about page data.", issues: parsed.error.issues.map(i => i.message), success: false, fields: formData as Record<string,string> };
  }
  try {
    updateAboutPageContent(parsed.data as AboutPageContent);
    return { message: "About page content updated successfully!", success: true };
  } catch (error) {
    return { message: "Failed to update about page content.", success: false };
  }
}

// Contact Page Content Schema
const contactPageContentSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
});

export async function handleUpdateContactPageContent(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = contactPageContentSchema.safeParse(formData);
  if (!parsed.success) {
    return { message: "Invalid contact page data.", issues: parsed.error.issues.map(i => i.message), success: false, fields: formData as Record<string,string> };
  }
  try {
    updateContactPageContent(parsed.data as ContactPageContent);
    return { message: "Contact page content updated successfully!", success: true };
  } catch (error) {
    return { message: "Failed to update contact page content.", success: false };
  }
}
