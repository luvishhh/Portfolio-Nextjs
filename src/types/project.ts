export interface Project {
  id: string // Will be ObjectId string from MongoDB
  title: string
  slug: string
  description?: string // Made optional
  detailedDescription: string
  imageUrl: string // Changed from images: string[] to imageUrl: string
  featured?: boolean
  tags?: string[]
  liveLink?: string
  repoLink?: string
  year?: number
  client?: string
  role?: string
  technologies?: string[]
  dataAiHint?: string // For placeholder main image
  createdAt?: Date // Optional: for sorting or tracking
}
