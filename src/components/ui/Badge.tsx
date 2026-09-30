// src/components/ui/Badge.tsx
import { clsx } from 'clsx'
import styles from './Badge.module.css'

type BadgeVariant = 'featured' | 'reserved' | 'sold' | 'new' | 'offer' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={clsx(styles.badge, styles[`variant-${variant}`], className)}>
      {children}
    </span>
  )
}
