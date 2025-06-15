// @/src/lib/projects.ts
import clientPromise from './mongodb'
import { ObjectId } from 'mongodb'
import type { Project } from '@/types/project'

const DB_NAME = 'musefolio_db' // Choose a database name
const PROJECTS_COLLECTION = 'projects'

async function getDb() {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// Helper to convert MongoDB _id to string id
function mapProjectFromDb(dbProject: any): Project {
  const { _id, ...rest } = dbProject
  // Ensure imageUrl exists, default to empty string if not (for old data compatibility)
  const imageUrl =
    rest.imageUrl ||
    (Array.isArray(rest.images) && rest.images.length > 0 ? rest.images[0] : '')

  // Remove the old 'images' array if it exists
  delete rest.images

  return { id: _id.toHexString(), ...rest, imageUrl } as Project
}

export async function getProjects(): Promise<Project[]> {
  const db = await getDb()
  const projectsFromDb = await db
    .collection(PROJECTS_COLLECTION)
    .find({})
    .sort({ _id: -1 })
    .toArray()
  return projectsFromDb.map(mapProjectFromDb)
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  if (!ObjectId.isValid(id)) {
    console.warn('Invalid ObjectId for getProjectById:', id)
    return undefined
  }
  const db = await getDb()
  const projectFromDb = await db
    .collection(PROJECTS_COLLECTION)
    .findOne({ _id: new ObjectId(id) })
  return projectFromDb ? mapProjectFromDb(projectFromDb) : undefined
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const db = await getDb()
  const projectFromDb = await db
    .collection(PROJECTS_COLLECTION)
    .findOne({ slug })
  return projectFromDb ? mapProjectFromDb(projectFromDb) : undefined
}

export async function addProject(
  projectData: Omit<Project, 'id' | 'slug'>
): Promise<Project> {
  const db = await getDb()
  const slug = projectData.title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')

  const fullProjectData = {
    ...projectData, // This will include imageUrl
    slug,
    createdAt: new Date(),
  }
  // Remove 'images' if it somehow sneaked in, ensuring only imageUrl is present
  delete (fullProjectData as any).images

  const result = await db
    .collection(PROJECTS_COLLECTION)
    .insertOne(fullProjectData)

  return {
    id: result.insertedId.toHexString(),
    slug,
    ...projectData, // projectData already has imageUrl
  }
}

export async function updateProject(
  id: string,
  projectUpdateData: Partial<Omit<Project, 'id' | 'slug'>>
): Promise<Project | undefined> {
  if (!ObjectId.isValid(id)) {
    console.warn('Invalid ObjectId for updateProject:', id)
    return undefined
  }
  const db = await getDb()

  let newSlug: string | undefined = undefined
  if (projectUpdateData.title) {
    newSlug = projectUpdateData.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
  }

  const updatePayload = { ...projectUpdateData }
  // If imageUrl is part of the update, ensure old 'images' field is unset for consistency
  if ('imageUrl' in updatePayload) {
    delete (updatePayload as any).images
  }

  const updateDoc: any = { $set: updatePayload }
  if (newSlug) {
    updateDoc.$set.slug = newSlug
  }

  // If imageUrl is being set, explicitly unset the old 'images' array field to avoid conflicts.
  if (projectUpdateData.imageUrl !== undefined) {
    updateDoc.$unset = { images: '' }
  }

  const result = await db
    .collection(PROJECTS_COLLECTION)
    .findOneAndUpdate({ _id: new ObjectId(id) }, updateDoc, {
      returnDocument: 'after',
    })

  return result ? mapProjectFromDb(result) : undefined
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    console.warn('Invalid ObjectId for deleteProject:', id)
    return false
  }
  const db = await getDb()
  const result = await db
    .collection(PROJECTS_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}
