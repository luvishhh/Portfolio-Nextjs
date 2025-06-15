// @/app/admin/login/page.tsx
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { handleLogin, type FormState as AuthFormState } from '../actions' // Reusing FormState or create a specific one
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LogIn, AlertCircle, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type='submit'
      disabled={pending}
      className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'
    >
      {pending ? (
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
      ) : (
        <LogIn className='mr-2 h-4 w-4' />
      )}
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  )
}

export default function AdminLoginPage() {
  const initialState: AuthFormState = {
    message: '',
    success: false,
    issues: [],
  }
  const [state, formAction] = useActionState(handleLogin, initialState)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        // Successful login is handled by redirect in server action,
        // but we can still show a toast if desired, though usually not needed.
        // For now, redirection handles it.
      } else {
        toast({
          title: 'Login Failed',
          description: state.message,
          variant: 'destructive',
          action: <AlertCircle className='h-5 w-5 text-red-500' />,
        })
      }
    }
    if (state.success) {
      // The server action should handle the redirect.
      // router.push('/admin'); // This might be redundant if action already redirects
    }
  }, [state, router, toast])

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-md shadow-xl bg-card'>
        <CardHeader className='text-center'>
          <LogIn className='h-10 w-10 mx-auto text-primary mb-2' />
          <CardTitle className='font-headline text-3xl text-primary'>
            Admin Login
          </CardTitle>
          <CardDescription>Access the Musefolio Admin Panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className='space-y-6'>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='admin@example.com'
                required
                className='mt-1'
                defaultValue={(initialState.fields?.email as string) || ''}
              />
            </div>
            <div>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='••••••••'
                required
                className='mt-1'
              />
            </div>
            {state.issues && state.issues.length > 0 && (
              <div className='text-sm text-destructive space-y-1'>
                {state.issues.map((issue) => (
                  <p key={issue} className='flex items-center'>
                    <AlertCircle className='h-4 w-4 mr-2 shrink-0' /> {issue}
                  </p>
                ))}
              </div>
            )}
            {state.message && !state.success && !state.issues?.length && (
              <p className='text-sm text-destructive flex items-center'>
                <AlertCircle className='h-4 w-4 mr-2 shrink-0' />{' '}
                {state.message}
              </p>
            )}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
