import type { CSSProperties, ReactNode } from 'react'
import './ads.css'

interface AdSlotProps {
  /** Accepts a number (px) or any valid CSS length. */
  width: number | string
  /** Accepts a number (px) or any valid CSS length. */
  height: number | string
  /** Human-readable size label, exposed for debugging and ad ops. */
  label: string
  className?: string
  children?: ReactNode
}

function toCssLength(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * The low-level ad box. It owns nothing but its configured dimensions and a
 * container-query context, so creatives can adapt to any size preset.
 */
export function AdSlot({
  width,
  height,
  label,
  className,
  children,
}: AdSlotProps) {
  const style = {
    '--ad-slot-width': toCssLength(width),
    '--ad-slot-height': toCssLength(height),
  } as CSSProperties

  return (
    <div
      className={['ad-slot', className].filter(Boolean).join(' ')}
      style={style}
      data-ad-format={label}
    >
      {children}
    </div>
  )
}
