
// @/app/admin/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { 
  addProject as dbAddProject, 
  updateProject as dbUpdateProject, 
  deleteProject as dbDeleteProject,
  getProjectById as dbGetProjectById,
  getProjects as dbGetProjects
} from "@/lib/projects";
import type { Project } from "@/types/project";
import { 
  updateHomePageContent as dbUpdateHomePageContent, 
  updateAboutPageContent as dbUpdateAboutPageContent, 
  updateContactPageContent as dbUpdateContactPageContent,
  getAboutPageContent as dbGetAboutPageContent,
  getHomePageContent as dbGetHomePageContent,
  getContactPageContent as dbGetContactPageContent,
} from "@/lib/page-content";
import type { HomePageContent, AboutPageContent, ContactPageContent } from "@/types/page-content";
import type { ExperienceItem } from "@/types/experience";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

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
  fields?: Record<string, string | string[] | File | undefined | boolean | number | ExperienceItem[]>; 
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

  const { mainImageFile, imageUrls, ...restOfData } = parsed.data;

  try {
    const newProject = await dbAddProject({ ...restOfData, images: projectImages } as Omit<Project, 'id' | 'slug'>);
    revalidatePath("/admin");
    revalidatePath("/projects");
    revalidatePath("/");
    return { message: `Project "${newProject.title}" added successfully!`, success: true, projectId: newProject.id };
  } catch (error) {
    console.error("handleAddProject error:", error);
    return { message: "Failed to add project. Check server logs.", success: false, fields: formData as any };
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

  const existingProject = await dbGetProjectById(parsed.data.id); 
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
  } else { 
    if (imageUrls && imageUrls.length > 0) { 
      updatedImageArray = [...imageUrls];
    } else if (imageUrls && imageUrls.length === 0 && existingProject.images.length > 0 && (!mainImageFile || mainImageFile.size === 0) ) { 
       if(existingProject.images.length > 0 && (!mainImageFile || mainImageFile.size === 0)) {
         updatedImageArray.push(existingProject.images[0]); 
       }
    } else { 
      updatedImageArray = [...existingProject.images];
    }
  }


  try {
    const projectToUpdate: Partial<Omit<Project, 'id' | 'slug'>> = {
        ...restOfData,
        images: updatedImageArray,
    };

    const updatedProject = await dbUpdateProject(id, projectToUpdate);
    if (!updatedProject) {
      return { message: "Project not found for editing (post-update check).", success: false };
    }
    revalidatePath("/admin");
    revalidatePath(`/projects/${updatedProject.slug}`);
    revalidatePath("/projects");
    revalidatePath("/");
    return { message: `Project "${updatedProject.title}" updated successfully!`, success: true, projectId: updatedProject.id };
  } catch (error) {
    console.error("handleEditProject error:", error);
    return { message: "Failed to update project. Check server logs.", success: false, fields: formData as any };
  }
}

export async function handleDeleteProject(id: string): Promise<{success: boolean, message: string}> {
  try {
    const success = await dbDeleteProject(id);
    if (!success) {
      return { success: false, message: "Project not found or already deleted." };
    }
    revalidatePath("/admin");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true, message: "Project deleted successfully." };
  } catch (error) {
    console.error("handleDeleteProject error:", error);
    return { success: false, message: "Failed to delete project. Check server logs." };
  }
}

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
    const updatedContent = await dbUpdateHomePageContent(parsed.data as HomePageContent);
    revalidatePath('/'); 
    revalidatePath('/admin/edit-home');
    revalidatePath('/admin');
    return { message: "Home page content updated successfully!", success: true, fields: updatedContent as any };
  } catch (error) {
    console.error("handleUpdateHomePageContent error:", error);
    let message = "Failed to update home page content. Check server logs.";
    if (error instanceof Error) {
        message = error.message;
    }
    return { message, success: false, fields: formData as any };
  }
}

const experienceItemSchema = z.object({
  id: z.string().min(1, "Experience item ID is required."),
  title: z.string().min(3, "Experience title is too short."),
  company: z.string().min(2, "Company name is too short."),
  period: z.string().min(5, "Period format is too short."),
  description: z.string().min(10, "Experience description is too short."),
  iconName: z.string().optional().describe("Lucide icon name (e.g., Zap, Briefcase)"),
});

const aboutPageContentSchema = z.object({
  mainTitle: z.string().min(3, "Main title is too short."),
  mainSubtitle: z.string().min(10, "Main subtitle is too short."),
  greeting: z.string().min(5, "Greeting is too short."),
  name: z.string().min(2, "Name is too short."), 
  introduction: z.string().min(20, "Introduction is too short."),
  philosophy: z.string().min(20, "Philosophy is too short."),
  futureFocus: z.string().min(20, "Future focus is too short."),
  profileImageFile: fileSchema, 
  dataAiHint: z.string().optional().default("profile avatar"), 
  profileCardTitle: z.string().min(3, "Profile card title is too short."),
  profileCardHandle: z.string().min(3, "Profile card handle is too short."),
  profileCardStatus: z.string().min(3, "Profile card status is too short."),
  profileCardContactText: z.string().min(3, "Profile card contact text is too short."),
  coreCompetenciesTitle: z.string().min(5, "Core competencies title is too short."),
  coreCompetenciesSubtitle: z.string().min(10, "Core competencies subtitle is too short."),
  chroniclesTitle: z.string().min(5, "Chronicles title is too short."),
  chroniclesSubtitle: z.string().min(10, "Chronicles subtitle is too short."),
  experienceItemsJSON: z.string().transform((str, ctx) => {
    if (!str.trim()) { 
      return [];
    }
    try {
      const parsed = JSON.parse(str);
      const validated = z.array(experienceItemSchema).safeParse(parsed);
      if (!validated.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid Experience Items JSON: " + validated.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '),
        });
        return z.NEVER;
      }
      return validated.data;
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Experience Items field contains invalid JSON.",
      });
      return z.NEVER;
    }
  }).optional().default("[]"), 
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
    const currentContent = await dbGetAboutPageContent(); 
    
    const { profileImageFile, experienceItemsJSON, ...restOfDataFromForm } = parsed.data;

    let profileImageToSave = currentContent.profileImage; 
    if (profileImageFile && profileImageFile.size > 0) {
      profileImageToSave = SIMULATED_PROFILE_IMAGE_URL; 
    }
    
    const fullContentToUpdate: AboutPageContent = {
      ...currentContent, 
      ...restOfDataFromForm, 
      experienceItems: experienceItemsJSON, 
      profileImage: profileImageToSave, 
    };

    const finalUpdatedContent = await dbUpdateAboutPageContent(fullContentToUpdate);
    
    revalidatePath('/about');
    revalidatePath('/admin/edit-about');
    revalidatePath('/admin');
    return { message: "About page content updated successfully!", success: true, fields: finalUpdatedContent as any };
  } catch (error) {
    console.error("handleUpdateAboutPageContent error:", error);
    let message = "Failed to update about page content. Check server logs.";
    if (error instanceof Error) {
        message = error.message;
    }
    return { message, success: false, fields: formData as any };
  }
}

const contactPageContentSchema = z.object({
  title: z.string().min(5, "Title is too short."),
  description: z.string().min(10, "Description is too short."),
  contactName: z.string().min(2, "Contact name is too short.").optional(),
  contactEmail: z.string().email("Invalid email address.").optional(),
  contactPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format.").optional().or(z.literal('')),
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
    const updatedContent = await dbUpdateContactPageContent(parsed.data as ContactPageContent);
    revalidatePath('/contact');
    revalidatePath('/admin/edit-contact');
    revalidatePath('/admin');
    return { message: "Contact page content updated successfully!", success: true, fields: updatedContent as any };
  } catch (error) {
    console.error("handleUpdateContactPageContent error:", error);
    let message = "Failed to update contact page content. Check server logs.";
    if (error instanceof Error) {
        message = error.message;
    }
    return { message, success: false, fields: formData as any };
  }
}

// --- Server Actions for fetching initial data for admin client components ---
export async function fetchProjectsForAdminDashboard(): Promise<Project[]> {
  try {
    const projects = await dbGetProjects();
    return projects;
  } catch (error) {
    console.error("Error fetching projects for admin dashboard:", error);
    return []; // Return empty array on error to prevent breaking the client
  }
}

export async function fetchProjectForAdminEdit(id: string): Promise<Project | null | undefined> {
  try {
    const project = await dbGetProjectById(id);
    return project;
  } catch (error) {
    console.error(`Error fetching project with id ${id} for admin edit:`, error);
    return null; // Return null on error
  }
}

export async function fetchHomePageContentForAdminEdit(): Promise<HomePageContent | null> {
  try {
    const content = await dbGetHomePageContent();
    return content;
  } catch (error) {
    console.error("Error fetching home page content for admin edit:", error);
    return null;
  }
}

export async function fetchAboutPageContentForAdminEdit(): Promise<AboutPageContent | null> {
  try {
    const content = await dbGetAboutPageContent();
    return content;
  } catch (error) {
    console.error("Error fetching about page content for admin edit:", error);
    return null;
  }
}

export async function fetchContactPageContentForAdminEdit(): Promise<ContactPageContent | null> {
  try {
    const content = await dbGetContactPageContent();
    return content;
  } catch (error) {
    console.error("Error fetching contact page content for admin edit:", error);
    return null;
  }
}
    
