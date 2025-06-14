// @/app/admin/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addProject as dbAddProject, updateProject as dbUpdateProject, deleteProject as dbDeleteProject } from "@/lib/projects";
import type { Project } from "@/types/project";
import { updateHomePageContent, updateAboutPageContent, updateContactPageContent, getAboutPageContent, getProjects } from "@/lib/page-content"; // Assuming getAboutPageContent might be needed for existing data
import type { HomePageContent, AboutPageContent, ContactPageContent } from "@/types/page-content";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

// Simulated URL for "uploaded" files
const SIMULATED_PROJECT_MAIN_IMAGE_URL = "https://placehold.co/1200x800.png";
const SIMULATED_PROFILE_IMAGE_URL = "https://placehold.co/400x400.png";


const fileSchema = z.instanceof(File).optional()
  .refine(file => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(file => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type), "Only .jpg, .jpeg, .png, .webp and .gif formats are supported.");

const projectSchemaBase = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  detailedDescription: z.string().min(20, "Detailed description must be at least 20 characters."),
  mainImageFile: fileSchema,
  imageUrls: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()).filter(s => s.length > 0) : []),
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

const addProjectSchema = projectSchemaBase.refine(data => {
  return (data.mainImageFile && data.mainImageFile.size > 0) || (data.imageUrls && data.imageUrls.length > 0);
}, {
  message: "Either a main image upload or at least one additional image URL is required for a new project.",
  path: ["mainImageFile"], 
});

const editProjectSchema = projectSchemaBase.extend({
  id: z.string(),
});


export type FormState = {
  message: string;
  issues?: string[];
  fields?: Record<string, string | string[] | File | undefined | boolean | number>; // Adjusted for file and other types
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
      fields: formData as any,
      success: false,
    };
  }

  let projectImages: string[] = [];
  if (parsed.data.mainImageFile && parsed.data.mainImageFile.size > 0) {
    projectImages.push(SIMULATED_PROJECT_MAIN_IMAGE_URL);
  }
  if (parsed.data.imageUrls) {
    projectImages.push(...parsed.data.imageUrls);
  }

  // This check is now part of the Zod schema for addProjectSchema
  // if (projectImages.length === 0) {
  //   return { message: "At least one image (main upload or additional URL) is required.", success: false, fields: formData as any };
  // }

  const { mainImageFile, imageUrls, ...restOfData } = parsed.data;

  try {
    const newProject = dbAddProject({ ...restOfData, images: projectImages } as Omit<Project, 'id' | 'slug'>);
    revalidatePath("/admin");
    revalidatePath("/projects");
    revalidatePath("/");
    return { message: `Project "${newProject.title}" added successfully!`, success: true, projectId: newProject.id };
  } catch (error) {
    return { message: "Failed to add project.", success: false, fields: formData as any };
  }
}

export async function handleEditProject(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = editProjectSchema.safeParse(formData);
  
  if (!parsed.success) {
    return {
      message: "Invalid project data for editing.",
      issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      fields: formData as any,
      success: false,
    };
  }

  const existingProject = getProjects().find(p => p.id === parsed.data.id); // In a real app, fetch from DB
  if (!existingProject) {
    return { message: "Project not found for editing.", success: false };
  }

  let updatedImageArray: string[] = [];
  const { mainImageFile, imageUrls, id, ...restOfData } = parsed.data;

  if (mainImageFile && mainImageFile.size > 0) {
    updatedImageArray.push(SIMULATED_PROJECT_MAIN_IMAGE_URL);
    if (imageUrls) {
      updatedImageArray.push(...imageUrls);
    }
  } else { // No new main image file uploaded
    if (imageUrls && imageUrls.length > 0) { // Manual URLs provided, these become the full list
      updatedImageArray = [...imageUrls];
    } else if (imageUrls && imageUrls.length === 0 && existingProject.images.length > 0 && (!mainImageFile || mainImageFile.size === 0) ) { // Manual URLs are explicitly empty string, meaning clear them
       // If mainImageFile was not touched and imageUrls is empty string, this implies clearing additional images,
       // but keeping the main one if it exists and wasn't replaced.
       // If there was an existing main image and no new main image file, keep it.
       if(existingProject.images.length > 0 && (!mainImageFile || mainImageFile.size === 0)) {
         updatedImageArray.push(existingProject.images[0]);
       }
       // Then imageUrls (which is empty array here) are effectively applied.
    }
     else { // No new main file, no new manual URLs, keep existing images entirely.
      updatedImageArray = [...existingProject.images];
    }
  }


  try {
    const projectToUpdate: Partial<Omit<Project, 'id' | 'slug'>> = {
        ...restOfData,
        images: updatedImageArray,
    };

    const updatedProject = dbUpdateProject(id, projectToUpdate);
    if (!updatedProject) {
      return { message: "Project not found for editing (post-update check).", success: false };
    }
    revalidatePath("/admin");
    revalidatePath(`/projects/${updatedProject.slug}`);
    revalidatePath("/projects");
    revalidatePath("/");
    return { message: `Project "${updatedProject.title}" updated successfully!`, success: true, projectId: updatedProject.id };
  } catch (error) {
    return { message: "Failed to update project.", success: false, fields: formData as any };
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
      fields: formData as any,
      success: false,
    };
  }

  try {
    updateHomePageContent(parsed.data as HomePageContent);
    revalidatePath('/'); 
    revalidatePath('/admin/edit-home');
    revalidatePath('/admin');
    return { message: "Home page content updated successfully!", success: true };
  } catch (error) {
    let message = "Failed to update home page content.";
    if (error instanceof Error) {
        message = error.message;
    }
    return { message, success: false };
  }
}

// About Page Content Schema
const aboutPageContentSchema = z.object({
  mainTitle: z.string().min(3, "Main title is too short."),
  mainSubtitle: z.string().min(10, "Main subtitle is too short."),
  greeting: z.string().min(5, "Greeting is too short."),
  name: z.string().min(3, "Name is too short."),
  introduction: z.string().min(20, "Introduction is too short."),
  philosophy: z.string().min(20, "Philosophy is too short."),
  futureFocus: z.string().min(20, "Future focus is too short."),
  profileImageFile: fileSchema,
  dataAiHint: z.string().optional(),
  coreCompetenciesTitle: z.string().min(5, "Core competencies title is too short."),
  coreCompetenciesSubtitle: z.string().min(10, "Core competencies subtitle is too short."),
  chroniclesTitle: z.string().min(5, "Chronicles title is too short."),
  chroniclesSubtitle: z.string().min(10, "Chronicles subtitle is too short."),
});

export async function handleUpdateAboutPageContent(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = aboutPageContentSchema.safeParse(formData);

  if (!parsed.success) {
    return { 
      message: "Invalid about page data.", 
      issues: parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`), 
      fields: formData as any,
      success: false 
    };
  }
  try {
    const currentContent = getAboutPageContent(); // Fetch current content
    let newProfileImageUrl = currentContent.profileImage; // Keep existing by default

    if (parsed.data.profileImageFile && parsed.data.profileImageFile.size > 0) {
      newProfileImageUrl = SIMULATED_PROFILE_IMAGE_URL;
    }
    
    const { profileImageFile, ...restOfData } = parsed.data;
    const contentToUpdate: AboutPageContent = {
      ...currentContent, // Spread current content to ensure all fields are present
      ...restOfData,     // Spread parsed data (excluding the file)
      profileImage: newProfileImageUrl, // Set the potentially updated image URL
    };

    updateAboutPageContent(contentToUpdate);
    revalidatePath('/about');
    revalidatePath('/admin/edit-about');
    revalidatePath('/admin');
    return { message: "About page content updated successfully!", success: true };
  } catch (error) {
    let message = "Failed to update about page content.";
    if (error instanceof Error) {
        message = error.message;
    }
    return { message, success: false, fields: formData as any };
  }
}

// Contact Page Content Schema
const contactPageContentSchema = z.object({
  title: z.string().min(5, "Title is too short."),
  description: z.string().min(10, "Description is too short."),
});

export async function handleUpdateContactPageContent(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = contactPageContentSchema.safeParse(formData);
  if (!parsed.success) {
    return { 
      message: "Invalid contact page data.", 
      issues: parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`),
      fields: formData as any,
      success: false 
    };
  }
  try {
    updateContactPageContent(parsed.data as ContactPageContent);
    revalidatePath('/contact');
    revalidatePath('/admin/edit-contact');
    revalidatePath('/admin');
    return { message: "Contact page content updated successfully!", success: true };
  } catch (error) {
    let message = "Failed to update contact page content.";
    if (error instanceof Error) {
        message = error.message;
    }
    return { message, success: false };
  }
}
