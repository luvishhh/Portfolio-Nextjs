// @/src/lib/projects.ts
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import type { Project } from '@/types/project';

const DB_NAME = 'musefolio_db'; // Choose a database name
const PROJECTS_COLLECTION = 'projects';

async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

// Helper to convert MongoDB _id to string id and vice-versa
function mapProjectFromDb(dbProject: any): Project {
  const { _id, ...rest } = dbProject;
  return { id: _id.toHexString(), ...rest } as Project;
}


export async function getProjects(): Promise<Project[]> {
  const db = await getDb();
  const projectsFromDb = await db.collection(PROJECTS_COLLECTION).find({}).sort({ _id: -1 }) .toArray();
  return projectsFromDb.map(mapProjectFromDb);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  if (!ObjectId.isValid(id)) {
    console.warn('Invalid ObjectId for getProjectById:', id);
    return undefined;
  }
  const db = await getDb();
  const projectFromDb = await db.collection(PROJECTS_COLLECTION).findOne({ _id: new ObjectId(id) });
  return projectFromDb ? mapProjectFromDb(projectFromDb) : undefined;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const db = await getDb();
  const projectFromDb = await db.collection(PROJECTS_COLLECTION).findOne({ slug });
  return projectFromDb ? mapProjectFromDb(projectFromDb) : undefined;
}

export async function addProject(projectData: Omit<Project, 'id' | 'slug'>): Promise<Project> {
  const db = await getDb();
  const slug = projectData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  
  const fullProjectData = {
    ...projectData,
    slug,
    createdAt: new Date(), // Optional: add a timestamp
  };

  const result = await db.collection(PROJECTS_COLLECTION).insertOne(fullProjectData);
  
  return {
    id: result.insertedId.toHexString(),
    slug,
    ...projectData,
  };
}

export async function updateProject(id: string, projectUpdateData: Partial<Omit<Project, 'id' | 'slug'>>): Promise<Project | undefined> {
  if (!ObjectId.isValid(id)) {
    console.warn('Invalid ObjectId for updateProject:', id);
    return undefined;
  }
  const db = await getDb();
  
  let newSlug: string | undefined = undefined;
  if (projectUpdateData.title) {
    newSlug = projectUpdateData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }

  const updateDoc: any = { $set: { ...projectUpdateData } };
  if (newSlug) {
    updateDoc.$set.slug = newSlug;
  }
  
  const result = await db.collection(PROJECTS_COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    updateDoc,
    { returnDocument: 'after' }
  );

  return result ? mapProjectFromDb(result) : undefined;
}

export async function deleteProject(id: string): Promise<boolean> {
   if (!ObjectId.isValid(id)) {
    console.warn('Invalid ObjectId for deleteProject:', id);
    return false;
  }
  const db = await getDb();
  const result = await db.collection(PROJECTS_COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
