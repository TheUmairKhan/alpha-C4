import type { ReactNode } from 'react'
import { chamfer, chamferOutline } from '../chamfer'

type ChamferPanelProps = {
  className?: string
  surfaceClassName: string
  outlineClassName: string
  borderClassName?: string
  children: ReactNode
}

export default function ChamferPanel({
    className = '',
    surfaceClassName,
    outlineClassName,
    borderClassName,
    children,
}: ChamferPanelProps) {
    return (
        <div className={`relative ${className}`}>
        <div className={`${chamferOutline} pointer-events-none absolute -inset-3 ${outlineClassName}`} />
        <section className={`${chamfer} h-full ${surfaceClassName}`}>{children}</section>
        {borderClassName && (
            <div className={`${chamferOutline} pointer-events-none absolute inset-0 ${borderClassName}`} />
        )}
        </div>    
    )
}