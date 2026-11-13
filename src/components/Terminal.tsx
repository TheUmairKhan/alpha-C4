import { useEffect, useRef } from 'react'
import { GameResult, newGame, playMove } from '../game/connect4'
import type { LoggedMove } from '../types'
import ForwardButton from './ForwardButton'
import ResetButton from './ResetButton'
import RewindButton from './RewindButton'
import SideButton from './SideButton'

type TerminalProps = {
    height: number
    log: LoggedMove[]
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

type Outcome = 'win' | 'lose' | 'draw'

const MESSAGES: Record<Outcome, string> = { win: 'YOU WIN', lose: 'YOU LOSE', draw: 'DRAW' }

// null while the game is undecided; a win leaves the turn with the winner
function outcomeOf(log: LoggedMove[], playerSide: number | null): Outcome | null {
    const board = newGame()
    for (const { col } of log) playMove(board, col)
    if (board.status === GameResult.Draw) return 'draw'
    if (board.status !== GameResult.Win || playerSide === null) return null
    return board.turn === playerSide ? 'win' : 'lose'
}

export default function Terminal({ height, log, playerSide, viewIndex, onPick, onRewind, onForward, onReset }: TerminalProps) {
    const endRef = useRef<HTMLDivElement>(null)
    const shown = viewIndex ?? log.length
    useEffect(() => {
        endRef.current!.scrollIntoView({ block: 'end' })
    }, [log])

    const outcome = viewIndex === null ? outcomeOf(log, playerSide) : null

    const who = (i: number) => (playerSide === null ? `P${(i % 2) + 1}` : i % 2 === playerSide ? 'Player' : 'Model')

    return (
        <div className="mr-4 flex w-80 shrink-0 flex-col border-2 border-cyan bg-black" style={{ height }}>
            <aside
                dir="rtl"
                className="neon-scroll min-h-0 w-full flex-1 overflow-y-auto bg-black p-4 pl-0.5 font-mono text-[13px] text-green-400"
            >
                <div dir="ltr">
                {playerSide === null && (
                    <div className="flex flex-col gap-3">
                        <p>&gt; SELECT PLAYER ORDER<span className="animate-blink">_</span></p>
                        {SIDES.map(({ side, label, chip }) => (
                            <SideButton key={side} label={label} chip={chip} onPick={() => onPick(side)} />
                        ))}
                    </div>
                )}
                {log.map(({ col, confidence }, i) => (
                    <p key={i} className={`text-white ${i >= shown ? 'opacity-30' : viewIndex !== null && i === shown - 1 ? 'bg-white/15' : ''}`}>
                        {i + 1}. <span className={`font-bold ${PLAYER_TEXT[i % 2]}`}>{who(i)}</span> played column {col + 1}
                        {confidence !== null && <span className="text-white/60"> ({Math.round(confidence * 100)}%)</span>}
                    </p>
                ))}
                {outcome !== null && <p className="mt-3 font-bold">&gt; {MESSAGES[outcome]}</p>}
                <div ref={endRef} />
                </div>
            </aside>
            <div className="flex shrink-0 gap-px bg-black p-2 pt-0">
                <RewindButton onClick={onRewind} disabled={shown === 0} />
                <ForwardButton onClick={onForward} disabled={viewIndex === null} />
                <ResetButton onClick={onReset} disabled={playerSide === null} />
            </div>
        </div>
    )
}
