export type AdPosition = 'left' | 'right' | 'mobile'

export type AdTone = 'sand' | 'sage' | 'ink' | 'clay' | 'sky'

/** A reusable size preset. All ad dimensions live in config, not components. */
export interface AdFormat {
  label: string
  width: number | string
  height: number | string
}

/** A single configured placement, before its format is resolved. */
export interface AdPlacement<Format extends string = string> {
  id: string
  format: Format
  eyebrow: string
  title: string
  description?: string
  ctaLabel?: string
  tone?: AdTone
  image?: string
  /** Optional per-placement overrides of the format dimensions. */
  width?: number | string
  height?: number | string
}

/** A placement with its format merged in — ready for rendering. */
export interface ResolvedAdPlacement extends Omit<AdPlacement, 'format'> {
  format: string
  formatLabel: string
  width: number | string
  height: number | string
}
