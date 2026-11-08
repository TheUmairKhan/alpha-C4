import type { ReactNode } from 'react'

export type ControlButtonProps = { onClick: () => void; disabled?: boolean }

type BaseProps = ControlButtonProps & { label: string; children: ReactNode }

// Shared look for the buttons along the bottom of the terminal
export default function ControlButton({ label, onClick, disabled, children }: BaseProps) {
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            onClick={onClick}
            disabled={disabled}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 border border-cyan/40 bg-black py-2 text-xs font-bold tracking-[0.2em] text-cyan transition hover:bg-cyan hover:text-ink focus-visible:bg-cyan focus-visible:text-ink focus-visible:outline-none active:scale-[0.97] disabled:cursor-not-allowed disabled:border-cyan/15 disabled:bg-black disabled:text-cyan/25"
        >
            {children}
        </button>
    )
}
