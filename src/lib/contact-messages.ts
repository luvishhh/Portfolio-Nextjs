// @/src/lib/contact-messages.ts
import { ContactMessage } from '@/types/contact'
import clientPromise from './mongodb'
import { ObjectId } from 'mongodb'

const DB_NAME = 'musefolio_db'
const MESSAGES_COLLECTION = 'contact_messages'

async function getDb() {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// Helper to map MongoDB document to ContactMessage type
function mapMessageFromDb(dbMessage: any): ContactMessage {
  const { _id, ...rest } = dbMessage
  return { id: _id.toHexString(), ...rest } as ContactMessage
}

export async function addContactMessage(
  messageData: Omit<ContactMessage, 'id' | 'submittedAt' | 'isRead'>
): Promise<ContactMessage> {
  const db = await getDb()
  const fullMessageData = {
    ...messageData,
    submittedAt: new Date(),
    isRead: false,
  }

  const result = await db
    .collection(MESSAGES_COLLECTION)
    .insertOne(fullMessageData)

  return {
    id: result.insertedId.toHexString(),
    ...fullMessageData,
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const db = await getDb()
  const messagesFromDb = await db
    .collection(MESSAGES_COLLECTION)
    .find({})
    .sort({ submittedAt: -1 }) // Sort by newest first
    .toArray()
  return messagesFromDb.map(mapMessageFromDb)
}

export async function markMessageAsRead(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    console.warn('Invalid ObjectId for markMessageAsRead:', id)
    return false
  }
  const db = await getDb()
  const result = await db
    .collection(MESSAGES_COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { isRead: true } })
  return result.modifiedCount === 1
}

export async function markMessageAsUnread(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    console.warn('Invalid ObjectId for markMessageAsUnread:', id)
    return false
  }
  const db = await getDb()
  const result = await db
    .collection(MESSAGES_COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { isRead: false } })
  return result.modifiedCount === 1
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    console.warn('Invalid ObjectId for deleteContactMessage:', id)
    return false
  }
  const db = await getDb()
  const result = await db
    .collection(MESSAGES_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}
