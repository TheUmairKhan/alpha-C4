import { useEffect, useRef, type ReactNode } from 'react'
import Chip from './Chip'


type TerminalProps = {
    height: number
    moves: number[]
    // Which player the human controls; null before they choose
    playerSide: number | null
    // Moves shown while reviewing history; null follows the live game
    viewIndex: number | null
    onPick: (side: number) => void
    onRewind: () => void
    onForward: () => void
    onReset: () => void
}

// First player is red, second is yellow, matching the discs
const PLAYER_TEXT = ['text-c4-red', 'text-c4-yellow']

const SIDES = [
    { side: 0, label: 'GO FIRST', chip: 'red' },
    { side: 1, label: 'GO SECOND', chip: 'yellow' },
] as const

function ControlButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
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

export default function Terminal({ height, moves, playerSide, viewIndex, onPick, onRewind, onForward, onReset }: TerminalProps) {
    const endRef = useRef<HTMLDivElement>(null)
    const shown = viewIndex ?? moves.length
    useEffect(() => {
        endRef.current!.scrollIntoView({ block: 'end' })
    }, [moves])

    const who = (i: number) => (playerSide === null ? `P${(i % 2) + 1}` : i % 2 === playerSide ? 'Player' : 'Model')

    return (
        <div className="mr-4 flex w-80 shrink-0 flex-col border-2 border-cyan bg-black" style={{ height }}>
            <aside
                className="min-h-0 w-full flex-1 overflow-y-auto bg-black p-4 font-mono text-sm text-green-400"
            >
                {playerSide === null && (
                    <div className="flex flex-col gap-3">
                        <p>&gt; SELECT PLAYER ORDER<span className="animate-blink">_</span></p>
                        {SIDES.map(({ side, label, chip }) => (
                            <button
                                key={side}
                                type="button"
                                onClick={() => onPick(side)}
                                className="flex w-full cursor-pointer items-center gap-3 border border-green-400/50 px-3 py-2 text-left font-bold tracking-[0.2em] transition hover:bg-green-400 hover:text-black focus-visible:bg-green-400 focus-visible:text-black focus-visible:outline-none"
                            >
                                <Chip color={chip} className="size-3" />
                                {label}
                            </button>
                        ))}
                    </div>
                )}
                {moves.map((col, i) => (
                    <p key={i} className={`text-white ${i >= shown ? 'opacity-30' : viewIndex !== null && i === shown - 1 ? 'bg-white/15' : ''}`}>
                        {i + 1}. <span className={`font-bold ${PLAYER_TEXT[i % 2]}`}>{who(i)}</span> played column {col + 1}
                    </p>
                ))}
                <div ref={endRef} />
            </aside>
            <div className="flex shrink-0 gap-px bg-black p-2 pt-0">
                <ControlButton label="Rewind one move" onClick={onRewind} disabled={shown === 0}>
                    ◂◂
                </ControlButton>
                <ControlButton label="Fast forward one move" onClick={onForward} disabled={viewIndex === null}>
                    ▸▸
                </ControlButton>
                <ControlButton label="Reset game" onClick={onReset} disabled={playerSide === null}>
                    RESET
                </ControlButton>
            </div>
        </div>
    )
}
