'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MobileContainerProps {
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export function MobileContainer({ children, className, noPadding = false }: MobileContainerProps) {
  return (
    <div 
      className={cn(
        'w-full mx-auto',
        !noPadding && 'px-4 sm:px-6 lg:px-8',
        'max-w-7xl',
        className
      )}
    >
      {children}
    </div>
  )
}

interface MobileSectionProps {
  children: ReactNode
  className?: string
  spacing?: 'tight' | 'normal' | 'loose'
}

export function MobileSection({ children, className, spacing = 'normal' }: MobileSectionProps) {
  const spacingClasses = {
    tight: 'py-6 sm:py-8 md:py-12',
    normal: 'py-8 sm:py-12 md:py-16',
    loose: 'py-12 sm:py-16 md:py-20'
  }

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  )
}

interface MobileGridProps {
  children: ReactNode
  className?: string
  cols?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: 'tight' | 'normal' | 'loose'
}

export function MobileGrid({ 
  children, 
  className, 
  cols = { xs: 1, sm: 2, lg: 3 },
  gap = 'normal'
}: MobileGridProps) {
  const gapClasses = {
    tight: 'gap-3 sm:gap-4',
    normal: 'gap-4 sm:gap-6 lg:gap-8',
    loose: 'gap-6 sm:gap-8 lg:gap-12'
  }

  const gridCols: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }

  const getColsClass = () => {
    let classes = 'grid '
    if (cols.xs && gridCols[cols.xs]) classes += `${gridCols[cols.xs]} `
    if (cols.sm && gridCols[cols.sm]) classes += `sm:${gridCols[cols.sm]} `
    if (cols.md && gridCols[cols.md]) classes += `md:${gridCols[cols.md]} `
    if (cols.lg && gridCols[cols.lg]) classes += `lg:${gridCols[cols.lg]} `
    if (cols.xl && gridCols[cols.xl]) classes += `xl:${gridCols[cols.xl]} `
    return classes.trim()
  }

  return (
    <div className={cn(getColsClass(), gapClasses[gap], className)}>
      {children}
    </div>
  )
}

interface MobileCardProps {
  children: ReactNode
  className?: string
  padding?: 'tight' | 'normal' | 'loose'
  hover?: boolean
}

export function MobileCard({ 
  children, 
  className, 
  padding = 'normal',
  hover = true 
}: MobileCardProps) {
  const paddingClasses = {
    tight: 'p-3 sm:p-4',
    normal: 'p-4 sm:p-6 md:p-8',
    loose: 'p-6 sm:p-8 md:p-10'
  }

  return (
    <div 
      className={cn(
        'bg-bg/50 border border-dimmed/20 backdrop-blur-sm rounded-xl',
        paddingClasses[padding],
        hover && 'transition-all duration-300 hover:border-accent/40 hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  )
}

interface MobileButtonProps {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function MobileButton({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false
}: MobileButtonProps) {
  const variantClasses = {
    primary: 'bg-accent hover:bg-accent/80 text-bg',
    secondary: 'bg-secondary hover:bg-secondary/80 text-bg',
    outline: 'border border-accent text-accent hover:bg-accent/10'
  }

  const sizeClasses = {
    sm: 'px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]',
    md: 'px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base min-h-[40px] sm:min-h-[44px]',
    lg: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-[44px] sm:min-h-[48px]'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2',
        'focus:outline-none focus:ring-2 focus:ring-accent/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.98]',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {children}
    </button>
  )
}

interface MobileTypographyProps {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  variant?: 'display' | 'heading' | 'subheading' | 'body' | 'caption'
  className?: string
  center?: boolean
}

export function MobileTypography({ 
  children, 
  as: Component = 'p', 
  variant = 'body',
  className,
  center = false
}: MobileTypographyProps) {
  const variantClasses = {
    display: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight',
    heading: 'text-xl sm:text-2xl md:text-3xl font-semibold leading-tight',
    subheading: 'text-lg sm:text-xl md:text-2xl font-medium leading-relaxed',
    body: 'text-sm sm:text-base leading-relaxed',
    caption: 'text-xs sm:text-sm leading-relaxed text-dimmed'
  }

  return (
    <Component 
      className={cn(
        variantClasses[variant],
        center && 'text-center',
        className
      )}
    >
      {children}
    </Component>
  )
}

interface MobileSpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export function MobileSpacer({ size = 'md' }: MobileSpacerProps) {
  const sizeClasses = {
    xs: 'h-2 sm:h-3',
    sm: 'h-4 sm:h-6',
    md: 'h-6 sm:h-8 md:h-12',
    lg: 'h-8 sm:h-12 md:h-16',
    xl: 'h-12 sm:h-16 md:h-20'
  }

  return <div className={sizeClasses[size]} />
} 