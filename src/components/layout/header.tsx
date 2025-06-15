// @/components/layout/header.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  LayoutGrid,
  Wand2,
  Mail,
  UserCog,
  Menu,
  X,
  UserCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import React from 'react'

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: LayoutGrid },
  { href: '/about', label: 'About', icon: UserCircle },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Wand2 },
  { href: '/contact', label: 'Contact', icon: Mail },
]

export default function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const NavLinkItem = ({
    href,
    label,
    icon: Icon,
    onClick,
  }: {
    href: string
    label: string
    icon: React.ElementType
    onClick?: () => void
  }) => (
    <Link href={href} passHref>
      <Button
        variant='ghost'
        className={cn(
          'text-sm font-medium transition-colors hover:text-primary',
          pathname === href
            ? 'text-primary font-semibold'
            : 'text-muted-foreground',
          'flex items-center gap-2 justify-start w-full md:w-auto md:px-3 py-2'
        )}
        onClick={onClick}
        aria-current={pathname === href ? 'page' : undefined}
      >
        <Icon className='h-5 w-5' />
        <span>{label}</span>
      </Button>
    </Link>
  )

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <Link href='/' passHref>
          <div
            className='flex items-center space-x-2 cursor-pointer'
            aria-label='Musefolio Homepage'
          >
            <span className='font-headline text-2xl font-bold text-primary'>
              Portfolio
            </span>
          </div>
        </Link>

        <nav className='hidden md:flex items-center space-x-1 lg:space-x-2'>
          {navLinks.map((link) => (
            <NavLinkItem key={link.href} {...link} />
          ))}
        </nav>

        <div className='md:hidden'>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                aria-label='Open navigation menu'
              >
                <Menu className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent
              side='right'
              className='w-full max-w-xs p-6 bg-background'
            >
              <SheetHeader>
                <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className='flex flex-col space-y-4 mt-6'>
                {' '}
                {/* Adjusted margin for content after hidden title */}
                <div className='flex justify-between items-center mb-2'>
                  {' '}
                  {/* Reduced bottom margin */}
                  <Link href='/' passHref>
                    <div
                      className='flex items-center space-x-2 cursor-pointer'
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-label='Musefolio Homepage'
                    >
                      <span className='font-headline text-2xl font-bold text-primary'>
                        Musefolio
                      </span>
                    </div>
                  </Link>
                  <SheetClose asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      aria-label='Close navigation menu'
                    >
                      <X className='h-6 w-6' />
                    </Button>
                  </SheetClose>
                </div>
                {navLinks.map((link) => (
                  <NavLinkItem
                    key={link.href}
                    {...link}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
