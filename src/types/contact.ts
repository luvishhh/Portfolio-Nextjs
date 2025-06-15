// @/src/types/contact.ts

export interface ContactMessage {
  id: string // MongoDB ObjectId string
  name: string
  email: string
  subject?: string
  message: string
  submittedAt: Date
  isRead: boolean
}
