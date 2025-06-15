// @/app/admin/actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import {
  addProject as dbAddProject,
  updateProject as dbUpdateProject,
  deleteProject as dbDeleteProject,
  getProjectById as dbGetProjectById,
  getProjects as dbGetProjects,
} from '@/lib/projects'
import type { Project } from '@/types/project'
import {
  updateHomePageContent as dbUpdateHomePageContent,
  updateAboutPageContent as dbUpdateAboutPageContent,
  updateContactPageContent as dbUpdateContactPageContent,
  getAboutPageContent as dbGetAboutPageContent,
  getHomePageContent as dbGetHomePageContent,
  getContactPageContent as dbGetContactPageContent,
} from '@/lib/page-content'
import type {
  HomePageContent,
  AboutPageContent,
  ContactPageContent,
} from '@/types/page-content'
import type { ExperienceItem } from '@/types/experience'
import type { SkillItem } from '@/types/skill'
import {
  getContactMessages as dbGetContactMessages,
  markMessageAsRead as dbMarkMessageAsRead,
  markMessageAsUnread as dbMarkMessageAsUnread,
  deleteContactMessage as dbDeleteContactMessage,
} from '@/lib/contact-messages'
import type { ContactMessage } from '@/types/contact'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

// Placeholder URL if no file is uploaded for profile image (About page)
const SIMULATED_PROFILE_IMAGE_URL = 'https://placehold.co/400x400.png'
const ADMIN_SESSION_COOKIE_NAME = 'musefolio-admin-session'

// Helper function to convert File to Data URI
async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return `data:${file.type};base64,${buffer.toString('base64')}`
}

const fileSchema = z
  .instanceof(File)
  .optional()
  .refine(
    (file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE,
    `Max file size is 5MB.`
  )
  .refine(
    (file) =>
      !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Only .jpg, .jpeg, .png, .webp and .gif formats are supported.'
  )

const projectSchemaBase = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  detailedDescription: z
    .string()
    .min(20, 'Detailed description must be at least 20 characters.'),
  mainImageFile: fileSchema,
  featured: z.preprocess(
    (val) => val === 'on' || val === true,
    z.boolean().default(false)
  ),
  liveLink: z.string().url().optional().or(z.literal('')),
  repoLink: z.string().url().optional().or(z.literal('')),
  technologies: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : []
    ),
  dataAiHint: z.string().optional().default('project showcase'),
})

const addProjectSchema = projectSchemaBase.refine(
  (data) => {
    return data.mainImageFile && data.mainImageFile.size > 0
  },
  {
    message: 'A main image upload is required for a new project.',
    path: ['mainImageFile'],
  }
)

const editProjectSchema = projectSchemaBase.extend({
  id: z.string(),
})

export type FormState = {
  message: string
  issues?: string[]
  fields?: Record<string, any>
  success: boolean
  projectId?: string
}

// Helper function to serialize form data for error state, removing File objects
function serializeFormDataForErrorState(
  formData: Record<string, any>
): FormState['fields'] {
  const serializedFields: FormState['fields'] = {}
  for (const key in formData) {
    if (!(formData[key] instanceof File)) {
      serializedFields[key] = formData[key]
    }
  }
  return serializedFields
}

export async function handleAddProject(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formDataObject = Object.fromEntries(data)
  const parsed = addProjectSchema.safeParse(formDataObject)

  if (!parsed.success) {
    return {
      message: 'Invalid project data.',
      issues: parsed.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      ),
      fields: serializeFormDataForErrorState(formDataObject),
      success: false,
    }
  }

  let projectImageUrl = '' // Default to empty string or a fallback placeholder
  if (parsed.data.mainImageFile && parsed.data.mainImageFile.size > 0) {
    try {
      projectImageUrl = await fileToDataUri(parsed.data.mainImageFile)
    } catch (error) {
      console.error('Error converting file to Data URI:', error)
      return {
        message: 'Error processing image file.',
        success: false,
        fields: serializeFormDataForErrorState(formDataObject),
      }
    }
  } else {
    // This case should ideally not be hit if addProjectSchema requires mainImageFile
    // but as a fallback:
    projectImageUrl = 'https://placehold.co/1200x800.png?text=Image+Required'
  }

  const { mainImageFile, ...restOfData } = parsed.data

  try {
    const projectDataForDb: Omit<Project, 'id' | 'slug'> = {
      title: restOfData.title,
      detailedDescription: restOfData.detailedDescription,
      featured: restOfData.featured,
      liveLink: restOfData.liveLink,
      repoLink: restOfData.repoLink,
      technologies: restOfData.technologies,
      dataAiHint: restOfData.dataAiHint,
      imageUrl: projectImageUrl,
      // Removed fields are no longer part of Project type or this data structure
    }

    const newProject = await dbAddProject(projectDataForDb)
    revalidatePath('/admin')
    revalidatePath('/projects')
    revalidatePath('/')
    return {
      message: `Project "${newProject.title}" added successfully!`,
      success: true,
      projectId: newProject.id,
    }
  } catch (error) {
    console.error('handleAddProject error:', error)
    return {
      message: 'Failed to add project. Check server logs.',
      success: false,
      fields: serializeFormDataForErrorState(formDataObject),
    }
  }
}

export async function handleEditProject(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formDataObject = Object.fromEntries(data)
  const parsed = editProjectSchema.safeParse(formDataObject)

  if (!parsed.success) {
    return {
      message: 'Invalid project data for editing.',
      issues: parsed.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      ),
      fields: serializeFormDataForErrorState(formDataObject),
      success: false,
    }
  }

  const existingProject = await dbGetProjectById(parsed.data.id)
  if (!existingProject) {
    return { message: 'Project not found for editing.', success: false }
  }

  const { mainImageFile, id, ...restOfData } = parsed.data

  let finalImageUrl = existingProject.imageUrl

  if (mainImageFile && mainImageFile.size > 0) {
    try {
      finalImageUrl = await fileToDataUri(mainImageFile)
    } catch (error) {
      console.error('Error converting file to Data URI for edit:', error)
      return {
        message: 'Error processing new image file.',
        success: false,
        fields: serializeFormDataForErrorState(formDataObject),
      }
    }
  }

  try {
    const projectToUpdate: Partial<Omit<Project, 'id' | 'slug'>> = {
      title: restOfData.title,
      detailedDescription: restOfData.detailedDescription,
      featured: restOfData.featured,
      liveLink: restOfData.liveLink,
      repoLink: restOfData.repoLink,
      technologies: restOfData.technologies,
      dataAiHint: restOfData.dataAiHint,
      imageUrl: finalImageUrl,
      // Removed fields are no longer part of Project type or this data structure
    }

    const updatedProject = await dbUpdateProject(id, projectToUpdate)
    if (!updatedProject) {
      return {
        message: 'Project not found for editing (post-update check).',
        success: false,
      }
    }
    revalidatePath('/admin')
    revalidatePath(`/projects/${updatedProject.slug}`)
    revalidatePath('/projects')
    revalidatePath('/')
    return {
      message: `Project "${updatedProject.title}" updated successfully!`,
      success: true,
      projectId: updatedProject.id,
    }
  } catch (error) {
    console.error('handleEditProject error:', error)
    return {
      message: 'Failed to update project. Check server logs.',
      success: false,
      fields: serializeFormDataForErrorState(formDataObject),
    }
  }
}

export async function handleDeleteProject(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const success = await dbDeleteProject(id)
    if (!success) {
      return {
        success: false,
        message: 'Project not found or already deleted.',
      }
    }
    revalidatePath('/admin')
    revalidatePath('/projects')
    revalidatePath('/')
    return { success: true, message: 'Project deleted successfully.' }
  } catch (error) {
    console.error('handleDeleteProject error:', error)
    return {
      success: false,
      message: 'Failed to delete project. Check server logs.',
    }
  }
}

const homePageContentSchema = z.object({
  heroTitle: z.string().min(5, 'Hero title must be at least 5 characters.'),
  heroSubtitle: z
    .string()
    .min(10, 'Hero subtitle must be at least 10 characters.'),
  heroButtonExplore: z.string().min(3, 'Explore button text is too short.'),
  heroButtonContact: z.string().min(3, 'Contact button text is too short.'),
  featuredWorkTitle: z.string().min(5, 'Featured work title is too short.'),
  featuredWorkViewAll: z.string().min(5, 'View all button text is too short.'),
  aiAssistantTitle: z.string().min(5, 'AI assistant title is too short.'),
  aiAssistantSubtitle: z
    .string()
    .min(10, 'AI assistant subtitle is too short.'),
  aiAssistantButton: z
    .string()
    .min(3, 'AI assistant button text is too short.'),
})

export async function handleUpdateHomePageContent(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formDataObject = Object.fromEntries(data)
  const parsed = homePageContentSchema.safeParse(formDataObject)

  if (!parsed.success) {
    return {
      message: 'Invalid home page content data.',
      issues: parsed.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      ),
      fields: serializeFormDataForErrorState(formDataObject),
      success: false,
    }
  }

  try {
    const updatedContentFromDb = await dbUpdateHomePageContent(
      parsed.data as HomePageContent
    )
    revalidatePath('/')
    revalidatePath('/admin/edit-home')
    revalidatePath('/admin')

    const sanitizedContent: HomePageContent = {
      heroTitle: updatedContentFromDb.heroTitle,
      heroSubtitle: updatedContentFromDb.heroSubtitle,
      heroButtonExplore: updatedContentFromDb.heroButtonExplore,
      heroButtonContact: updatedContentFromDb.heroButtonContact,
      featuredWorkTitle: updatedContentFromDb.featuredWorkTitle,
      featuredWorkViewAll: updatedContentFromDb.featuredWorkViewAll,
      aiAssistantTitle: updatedContentFromDb.aiAssistantTitle,
      aiAssistantSubtitle: updatedContentFromDb.aiAssistantSubtitle,
      aiAssistantButton: updatedContentFromDb.aiAssistantButton,
    }
    return {
      message: 'Home page content updated successfully!',
      success: true,
      fields: sanitizedContent,
    }
  } catch (error) {
    console.error('handleUpdateHomePageContent error:', error)
    let message = 'Failed to update home page content. Check server logs.'
    if (error instanceof Error) {
      message = error.message
    }
    return {
      message,
      success: false,
      fields: serializeFormDataForErrorState(formDataObject),
    }
  }
}

const experienceItemSchema = z.object({
  id: z.string().min(1, 'Experience item ID is required.'),
  title: z.string().min(3, 'Experience title is too short.'),
  company: z.string().min(2, 'Company name is too short.'),
  period: z.string().min(5, 'Period format is too short.'),
  description: z.string().min(10, 'Experience description is too short.'),
  iconName: z
    .string()
    .optional()
    .describe('Lucide icon name (e.g., Zap, Briefcase)'),
})

const skillItemSchema = z.object({
  name: z.string().min(2, 'Skill name is too short.'),
  iconName: z
    .string()
    .min(1, 'Skill icon name is required.')
    .describe('Lucide icon name (e.g., Cpu, Sparkles)'),
  level: z.string().min(3, 'Skill level is too short.'),
})

const aboutPageContentSchema = z.object({
  mainTitle: z.string().min(3, 'Main title is too short.'),
  mainSubtitle: z.string().min(10, 'Main subtitle is too short.'),
  greeting: z.string().min(5, 'Greeting is too short.'),
  name: z.string().min(2, 'Name is too short.'),
  introduction: z.string().min(20, 'Introduction is too short.'),
  philosophy: z.string().min(20, 'Philosophy is too short.'),
  futureFocus: z.string().min(20, 'Future focus is too short.'),
  profileImageFile: fileSchema,
  dataAiHint: z.string().optional().default('profile avatar'),
  profileCardTitle: z.string().min(3, 'Profile card title is too short.'),
  profileCardHandle: z.string().min(3, 'Profile card handle is too short.'),
  profileCardStatus: z.string().min(3, 'Profile card status is too short.'),
  profileCardContactText: z
    .string()
    .min(3, 'Profile card contact text is too short.'),
  coreCompetenciesTitle: z
    .string()
    .min(5, 'Core competencies title is too short.'),
  coreCompetenciesSubtitle: z
    .string()
    .min(10, 'Core competencies subtitle is too short.'),
  skillsJSON: z
    .string()
    .transform((str, ctx) => {
      if (!str.trim()) {
        return []
      }
      try {
        const parsed = JSON.parse(str)
        const validated = z.array(skillItemSchema).safeParse(parsed)
        if (!validated.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'Invalid Skills JSON: ' +
              validated.error.issues
                .map((i) => `${i.path.join('.')}: ${i.message}`)
                .join(', '),
          })
          return z.NEVER
        }
        return validated.data
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Skills field contains invalid JSON.',
        })
        return z.NEVER
      }
    })
    .optional()
    .default('[]'),
  chroniclesTitle: z.string().min(5, 'Chronicles title is too short.'),
  chroniclesSubtitle: z.string().min(10, 'Chronicles subtitle is too short.'),
  experienceItemsJSON: z
    .string()
    .transform((str, ctx) => {
      if (!str.trim()) {
        return []
      }
      try {
        const parsed = JSON.parse(str)
        const validated = z.array(experienceItemSchema).safeParse(parsed)
        if (!validated.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'Invalid Experience Items JSON: ' +
              validated.error.issues
                .map((i) => `${i.path.join('.')}: ${i.message}`)
                .join(', '),
          })
          return z.NEVER
        }
        return validated.data
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Experience Items field contains invalid JSON.',
        })
        return z.NEVER
      }
    })
    .optional()
    .default('[]'),
})

export async function handleUpdateAboutPageContent(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formDataObject = Object.fromEntries(data)
  const parsed = aboutPageContentSchema.safeParse(formDataObject)

  if (!parsed.success) {
    return {
      message: 'Invalid about page data.',
      issues: parsed.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      ),
      fields: serializeFormDataForErrorState(formDataObject),
      success: false,
    }
  }
  try {
    const currentContent = await dbGetAboutPageContent()

    const {
      profileImageFile,
      experienceItemsJSON,
      skillsJSON,
      ...restOfDataFromForm
    } = parsed.data

    let profileImageToSave = currentContent.profileImage // Keep existing if no new file
    if (profileImageFile && profileImageFile.size > 0) {
      // If actual file upload is implemented, this would involve storing the file
      // and getting its URL. For now, using a simulated URL or Data URI.
      // For simplicity with current setup, let's assume we're still using a placeholder for profile.
      // If true Data URI storage for profile images is needed, this part needs to be like project images.
      // However, profile images are often smaller, so a placeholder strategy is still okay.
      // For now, it will use SIMULATED_PROFILE_IMAGE_URL.
      // If you want profile image to be a data URI too, change to:
      // profileImageToSave = await fileToDataUri(profileImageFile);
      profileImageToSave = SIMULATED_PROFILE_IMAGE_URL // Keeping as placeholder for profile image.
    }

    const fullContentToUpdate: AboutPageContent = {
      ...currentContent,
      ...restOfDataFromForm,
      skills: skillsJSON as SkillItem[],
      experienceItems: experienceItemsJSON as ExperienceItem[],
      profileImage: profileImageToSave,
    }

    const updatedContentFromDb = await dbUpdateAboutPageContent(
      fullContentToUpdate
    )

    revalidatePath('/about')
    revalidatePath('/admin/edit-about')
    revalidatePath('/admin')

    const sanitizedContent: AboutPageContent = {
      mainTitle: updatedContentFromDb.mainTitle,
      mainSubtitle: updatedContentFromDb.mainSubtitle,
      greeting: updatedContentFromDb.greeting,
      name: updatedContentFromDb.name,
      introduction: updatedContentFromDb.introduction,
      philosophy: updatedContentFromDb.philosophy,
      futureFocus: updatedContentFromDb.futureFocus,
      profileImage: updatedContentFromDb.profileImage,
      dataAiHint: updatedContentFromDb.dataAiHint,
      profileCardTitle: updatedContentFromDb.profileCardTitle,
      profileCardHandle: updatedContentFromDb.profileCardHandle,
      profileCardStatus: updatedContentFromDb.profileCardStatus,
      profileCardContactText: updatedContentFromDb.profileCardContactText,
      coreCompetenciesTitle: updatedContentFromDb.coreCompetenciesTitle,
      coreCompetenciesSubtitle: updatedContentFromDb.coreCompetenciesSubtitle,
      skills: updatedContentFromDb.skills.map((skill) => ({
        name: skill.name,
        iconName: skill.iconName,
        level: skill.level,
      })),
      chroniclesTitle: updatedContentFromDb.chroniclesTitle,
      chroniclesSubtitle: updatedContentFromDb.chroniclesSubtitle,
      experienceItems: updatedContentFromDb.experienceItems.map((exp) => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        period: exp.period,
        description: exp.description,
        iconName: exp.iconName,
      })),
    }
    return {
      message: 'About page content updated successfully!',
      success: true,
      fields: sanitizedContent,
    }
  } catch (error) {
    console.error('handleUpdateAboutPageContent error:', error)
    let message = 'Failed to update about page content. Check server logs.'
    if (error instanceof Error) {
      message = error.message
    }
    return {
      message,
      success: false,
      fields: serializeFormDataForErrorState(formDataObject),
    }
  }
}

const contactPageContentSchema = z.object({
  title: z.string().min(5, 'Title is too short.'),
  description: z.string().min(10, 'Description is too short.'),
  contactName: z.string().min(2, 'Contact name is too short.').optional(),
  contactEmail: z.string().email('Invalid email address.').optional(),
  contactPhone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format.')
    .optional()
    .or(z.literal('')),
})

export async function handleUpdateContactPageContent(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formDataObject = Object.fromEntries(data)
  const parsed = contactPageContentSchema.safeParse(formDataObject)
  if (!parsed.success) {
    return {
      message: 'Invalid contact page data.',
      issues: parsed.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      ),
      fields: serializeFormDataForErrorState(formDataObject),
      success: false,
    }
  }
  try {
    const updatedContentFromDb = await dbUpdateContactPageContent(
      parsed.data as ContactPageContent
    )
    revalidatePath('/contact')
    revalidatePath('/admin/edit-contact')
    revalidatePath('/admin')

    const sanitizedContent: ContactPageContent = {
      title: updatedContentFromDb.title,
      description: updatedContentFromDb.description,
      contactName: updatedContentFromDb.contactName,
      contactEmail: updatedContentFromDb.contactEmail,
      contactPhone: updatedContentFromDb.contactPhone,
    }
    return {
      message: 'Contact page content updated successfully!',
      success: true,
      fields: sanitizedContent,
    }
  } catch (error) {
    console.error('handleUpdateContactPageContent error:', error)
    let message = 'Failed to update contact page content. Check server logs.'
    if (error instanceof Error) {
      message = error.message
    }
    return {
      message,
      success: false,
      fields: serializeFormDataForErrorState(formDataObject),
    }
  }
}

// --- Server Actions for fetching initial data for admin client components ---
export async function fetchProjectsForAdminDashboard(): Promise<Project[]> {
  try {
    const projects = await dbGetProjects()
    return projects
  } catch (error) {
    console.error('Error fetching projects for admin dashboard:', error)
    return []
  }
}

export async function fetchProjectForAdminEdit(
  id: string
): Promise<Project | null | undefined> {
  try {
    const project = await dbGetProjectById(id)
    return project
  } catch (error) {
    console.error(`Error fetching project with id ${id} for admin edit:`, error)
    return null
  }
}

export async function fetchHomePageContentForAdminEdit(): Promise<HomePageContent | null> {
  try {
    const content = await dbGetHomePageContent()
    return content
  } catch (error) {
    console.error('Error fetching home page content for admin edit:', error)
    return null
  }
}

export async function fetchAboutPageContentForAdminEdit(): Promise<AboutPageContent | null> {
  try {
    const content = await dbGetAboutPageContent()
    return content
  } catch (error) {
    console.error('Error fetching about page content for admin edit:', error)
    return null
  }
}

export async function fetchContactPageContentForAdminEdit(): Promise<ContactPageContent | null> {
  try {
    const content = await dbGetContactPageContent()
    return content
  } catch (error) {
    console.error('Error fetching contact page content for admin edit:', error)
    return null
  }
}

// --- Authentication Actions ---
const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address.' }),
  password: z.string().trim().min(1, { message: 'Password is required.' }),
})

export async function handleLogin(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data)
  const parsed = loginSchema.safeParse(formData)

  if (!parsed.success) {
    return {
      message: 'Invalid login data.',
      issues: parsed.error.issues.map((issue) => issue.message),
      fields: parsed.data,
      success: false,
    }
  }

  const { email, password } = parsed.data

  if (email === 'lavishkhare@gmail.com' && password === 'admin@123') {
    const cookieStore = cookies()
    cookieStore.set(ADMIN_SESSION_COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
    })
    redirect('/admin')
  } else {
    return {
      message: 'Invalid email or password.',
      fields: { email },
      success: false,
    }
  }
}

export async function handleLogout(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete({
    name: ADMIN_SESSION_COOKIE_NAME,
    path: '/', // Ensure path matches the one used for setting
  })
  redirect('/admin/login')
}

// --- Contact Messages Actions ---
export async function fetchContactMessagesForAdmin(): Promise<
  ContactMessage[]
> {
  try {
    const messages = await dbGetContactMessages()
    return messages
  } catch (error) {
    console.error('Error fetching contact messages for admin:', error)
    return []
  }
}

export async function toggleMessageReadStatusAction(
  id: string,
  currentStatus: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    let success
    if (currentStatus) {
      success = await dbMarkMessageAsUnread(id)
    } else {
      success = await dbMarkMessageAsRead(id)
    }
    if (success) {
      revalidatePath('/admin/inbox')
      return { success: true, message: `Message status updated.` }
    }
    return { success: false, message: 'Failed to update message status.' }
  } catch (error) {
    console.error('Error toggling message read status:', error)
    return { success: false, message: 'Server error toggling message status.' }
  }
}

export async function deleteContactMessageAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const success = await dbDeleteContactMessage(id)
    if (success) {
      revalidatePath('/admin/inbox')
      return { success: true, message: 'Message deleted successfully.' }
    }
    return { success: false, message: 'Failed to delete message.' }
  } catch (error) {
    console.error('Error deleting contact message:', error)
    return { success: false, message: 'Server error deleting message.' }
  }
}
