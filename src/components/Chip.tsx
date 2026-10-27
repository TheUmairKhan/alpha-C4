import type { CSSProperties } from 'react'

const FILLS = {
  red: 'bg-[radial-gradient(circle,var(--color-c4-red)_44%,rgba(0,0,0,0.35)_46%_54%,var(--color-c4-red)_56%)] shadow-[0_0_10px_var(--color-c4-red)]',
  yellow:
    'bg-[radial-gradient(circle,var(--color-c4-yellow)_44%,rgba(0,0,0,0.35)_46%_54%,var(--color-c4-yellow)_56%)] shadow-[0_0_10px_var(--color-c4-yellow)]',
}

export type ChipColor = keyof typeof FILLS

type ChipProps = {
  color: ChipColor
  className?: string
  style?: CSSProperties
}

export default function Chip({ color, className = '', style }: ChipProps) {
  return <span aria-hidden="true" style={style} className={`inline-block shrink-0 rounded-full ${FILLS[color]} ${className}`} />
}
