// @/app/contact/actions.ts
'use server'

import { z } from 'zod'
import { getContactPageContent as dbGetContactPageContent } from '@/lib/page-content'
import type { ContactPageContent } from '@/types/page-content'
import { addContactMessage as dbAddContactMessage } from '@/lib/contact-messages' // Import new DB function

// --- Action to fetch contact page content ---
export async function fetchContactPageData(): Promise<ContactPageContent | null> {
  try {
    const content = await dbGetContactPageContent()
    return content
  } catch (error) {
    console.error(
      'Error fetching contact page content in server action:',
      error
    )
    return null
  }
}
// --- End of new action ---

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().optional(),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' }),
})

export type ContactFormState = {
  message: string
  fields?: Record<string, string>
  issues?: string[]
  success: boolean
}

export async function submitContactForm(
  prevState: ContactFormState,
  data: FormData
): Promise<ContactFormState> {
  const formData = Object.fromEntries(data)
  const parsed = contactFormSchema.safeParse(formData)

  if (!parsed.success) {
    return {
      message: 'Invalid form data.',
      fields: formData as Record<string, string>,
      issues: parsed.error.issues.map((issue) => issue.message),
      success: false,
    }
  }

  try {
    await dbAddContactMessage({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    })

    return {
      message: "Thank you for your message! We'll get back to you soon.",
      success: true,
    }
  } catch (error) {
    console.error('Error saving contact message:', error)
    return {
      message:
        'Failed to send message due to a server error. Please try again later.',
      success: false,
      fields: formData as Record<string, string>,
    }
  }
}
