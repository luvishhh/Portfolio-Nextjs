// @/app/admin/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addProject as dbAddProject, updateProject as dbUpdateProject, deleteProject as dbDeleteProject } from "@/lib/projects";
import type { Project } from "@/types/project";

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
  projectId?: string;
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

