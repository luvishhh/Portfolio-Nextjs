// @/components/admin/project-form.tsx
'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { Project } from '@/types/project'
import type { FormState } from '@/app/admin/actions'
import { AlertCircle, Loader2, FileImage } from 'lucide-react'

interface ProjectFormProps {
  formAction: (payload: FormData) => void
  initialState: FormState
  project?: Project
  buttonText: string
}

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus()
  return (
    <Button
      type='submit'
      disabled={pending}
      className='w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground'
    >
      {pending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
      {pending ? 'Saving...' : text}
    </Button>
  )
}

export default function ProjectForm({
  formAction,
  initialState,
  project,
  buttonText,
}: ProjectFormProps) {
  const fields = [
    {
      id: 'title',
      label: 'Title',
      type: 'text',
      defaultValue: project?.title,
      required: true,
    },
    {
      id: 'detailedDescription',
      label: 'Detailed Description',
      type: 'textarea',
      defaultValue: project?.detailedDescription,
      required: true,
      rows: 6,
    },
    {
      id: 'mainImageFile',
      label: 'Main Image (Upload)',
      type: 'file',
      required: !project?.imageUrl,
    }, // Required if no existing imageUrl (new project)
    {
      id: 'dataAiHint',
      label: 'AI Hint for Main Image (Max 2 words)',
      type: 'text',
      defaultValue: project?.dataAiHint,
      placeholder: 'e.g. abstract background',
    },
    {
      id: 'liveLink',
      label: 'Live Link URL',
      type: 'url',
      defaultValue: project?.liveLink,
      placeholder: 'https://example.com',
    },
    {
      id: 'repoLink',
      label: 'Repository Link URL',
      type: 'url',
      defaultValue: project?.repoLink,
      placeholder: 'https://github.com/user/repo',
    },
    {
      id: 'technologies',
      label: 'Technologies (comma-separated)',
      type: 'text',
      defaultValue: project?.technologies?.join(', '),
      placeholder: 'React, Next.js, Tailwind',
    },
  ]

  return (
    <form action={formAction} className='space-y-6'>
      {project?.id && <input type='hidden' name='id' value={project.id} />}
      {fields.map((field) => (
        <div key={field.id}>
          <Label htmlFor={field.id} className='font-semibold'>
            {field.label}
            {field.required && <span className='text-destructive'>*</span>}
          </Label>
          {field.type === 'textarea' ? (
            <Textarea
              id={field.id}
              name={field.id}
              defaultValue={
                (initialState.fields?.[field.id] as string) ??
                (field.defaultValue as string | undefined)
              }
              required={field.required}
              rows={(field.rows as number) || 3}
              placeholder={field.placeholder}
              className='mt-1'
            />
          ) : field.type === 'file' ? (
            <div className='mt-1 flex items-center space-x-2'>
              <FileImage className='h-5 w-5 text-muted-foreground' />
              <Input
                id={field.id}
                name={field.id}
                type='file'
                accept='image/*'
                className='mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20'
              />
            </div>
          ) : (
            <Input
              id={field.id}
              name={field.id}
              type={field.type}
              defaultValue={
                (initialState.fields?.[field.id] as string) ??
                (field.defaultValue as string | number | undefined)
              }
              required={field.required}
              placeholder={field.placeholder}
              className='mt-1'
            />
          )}
          {field.id === 'mainImageFile' && project?.imageUrl && (
            <p className='text-xs text-muted-foreground mt-1'>
              Current image is set. Uploading a new file will replace it.
              {project.imageUrl.startsWith('data:') ? (
                ' (Custom image uploaded)'
              ) : (
                <a
                  href={project.imageUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline hover:text-primary ml-1'
                >
                  Preview
                </a>
              )}
            </p>
          )}
        </div>
      ))}
      <div className='flex items-center space-x-2'>
        <Checkbox
          id='featured'
          name='featured'
          defaultChecked={
            project?.featured ?? (initialState.fields?.featured as boolean)
          }
        />
        <Label htmlFor='featured' className='font-semibold text-sm'>
          Featured Project
        </Label>
      </div>

      {initialState?.issues && initialState.issues.length > 0 && (
        <div className='rounded-md bg-destructive/10 p-3 text-sm text-destructive'>
          <div className='flex items-start'>
            <AlertCircle className='h-5 w-5 mr-2 flex-shrink-0' />
            <div>
              <p className='font-semibold mb-1'>
                Please correct the following errors:
              </p>
              <ul className='list-disc list-inside'>
                {initialState.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      <SubmitButton text={buttonText} />
    </form>
  )
}
