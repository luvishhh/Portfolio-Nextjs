// @/app/admin/inbox/page.tsx
'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  fetchContactMessagesForAdmin,
  toggleMessageReadStatusAction,
  deleteContactMessageAction,
} from '../actions'

import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  Inbox as InboxIcon,
} from 'lucide-react'
import { format } from 'date-fns'
import { ContactMessage } from '@/types/contact'

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const loadMessages = async () => {
    setLoading(true)
    try {
      const fetchedMessages = await fetchContactMessagesForAdmin()
      setMessages(fetchedMessages)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      toast({
        title: 'Error',
        description: 'Failed to load messages. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleToggleReadStatus = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await toggleMessageReadStatusAction(id, currentStatus)
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      })
      if (result.success) {
        loadMessages() // Reload messages to reflect changes
      }
    })
  }

  const handleDeleteMessage = (id: string) => {
    startTransition(async () => {
      const result = await deleteContactMessageAction(id)
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      })
      if (result.success) {
        loadMessages() // Reload messages
      }
    })
  }

  return (
    <div className='max-w-5xl mx-auto py-8 animate-in fade-in-0 duration-500'>
      <Link href='/admin' passHref className='mb-6 inline-block'>
        <Button variant='outline' className='group'>
          <ArrowLeft className='mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1' />
          Back to Admin Panel
        </Button>
      </Link>

      <Card className='shadow-xl bg-card'>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <InboxIcon className='h-8 w-8 text-primary' />
            <CardTitle className='font-headline text-3xl text-primary'>
              Contact Message Inbox
            </CardTitle>
          </div>
          <CardDescription>
            View and manage messages submitted through your contact form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex justify-center items-center py-10'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <p className='ml-3 text-muted-foreground'>Loading messages...</p>
            </div>
          ) : messages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow
                    key={msg.id}
                    className={msg.isRead ? '' : 'font-semibold bg-accent/10'}
                  >
                    <TableCell>
                      {format(new Date(msg.submittedAt), 'PPp')}
                    </TableCell>
                    <TableCell>{msg.name}</TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${msg.email}`}
                        className='text-primary hover:underline'
                      >
                        {msg.email}
                      </a>
                    </TableCell>
                    <TableCell>{msg.subject || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={msg.isRead ? 'secondary' : 'default'}>
                        {msg.isRead ? 'Read' : 'Unread'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right space-x-2'>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant='outline' size='sm' className='group'>
                            <Eye className='mr-1 h-4 w-4' /> View
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='max-w-2xl'>
                          <AlertDialogHeader>
                            <AlertDialogTitle className='font-headline text-2xl text-primary'>
                              Message from: {msg.name}
                            </AlertDialogTitle>
                            <AlertDialogDescription className='text-sm text-muted-foreground'>
                              <p>
                                <strong>Email:</strong>{' '}
                                <a
                                  href={`mailto:${msg.email}`}
                                  className='text-primary hover:underline'
                                >
                                  {msg.email}
                                </a>
                              </p>
                              <p>
                                <strong>Subject:</strong> {msg.subject || 'N/A'}
                              </p>
                              <p>
                                <strong>Received:</strong>{' '}
                                {format(new Date(msg.submittedAt), 'PPPp')}
                              </p>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className='my-4 p-4 border rounded-md bg-background max-h-60 overflow-y-auto'>
                            <p className='text-foreground whitespace-pre-wrap'>
                              {msg.message}
                            </p>
                          </div>
                          <AlertDialogFooter>
                            <Button
                              variant='outline'
                              onClick={() =>
                                handleToggleReadStatus(msg.id, msg.isRead)
                              }
                              disabled={isPending}
                            >
                              {msg.isRead ? (
                                <EyeOff className='mr-2 h-4 w-4' />
                              ) : (
                                <Eye className='mr-2 h-4 w-4' />
                              )}
                              {msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                            </Button>
                            <AlertDialogCancel>Close</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          handleToggleReadStatus(msg.id, msg.isRead)
                        }
                        disabled={isPending}
                        title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                      >
                        {msg.isRead ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant='destructive'
                            size='sm'
                            title='Delete Message'
                            disabled={isPending}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the message from "
                              {msg.name}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMessage(msg.id)}
                              className='bg-destructive hover:bg-destructive/90'
                              disabled={isPending}
                            >
                              {isPending && (
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              )}
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className='text-muted-foreground text-center py-10 text-lg'>
              <InboxIcon className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
              Your inbox is empty.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
