type HintToggleProps = { on: boolean; onToggle: () => void }

export default function HintToggle({ on, onToggle }: HintToggleProps) {
    return (
        <button
            type="button"
            aria-pressed={on}
            onClick={onToggle}
            className={`fixed bottom-4 left-4 cursor-pointer border border-cyan/60 px-3 py-2 font-mono text-xs font-bold tracking-[0.2em] transition focus-visible:outline-none ${
                on ? 'bg-cyan text-ink' : 'bg-black text-cyan hover:bg-cyan/20'
            }`}
        >
            HINTS: {on ? 'ON' : 'OFF'}
        </button>
    )
}
