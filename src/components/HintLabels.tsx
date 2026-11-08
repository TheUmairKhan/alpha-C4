import { COLS } from '../game/connect4'
import { fitZoom, HINT_BAND } from '../layout'
import type { HintState } from '../types'
import { BOARD_HEIGHT } from './Board'
import { CELL } from './sceneKit'

type HintLabelsProps = { hint: HintState; width: number; height: number }

// Per-column percentages above the board; the top pick is highlighted
export default function HintLabels({ hint, width, height }: HintLabelsProps) {
    if (hint === null || width === 0) return null
    const zoom = fitZoom(width, height)
    const best = hint === 'loading' ? -1 : hint.indexOf(Math.max(...hint))
    return (
        <div className="pointer-events-none absolute inset-0 font-mono font-bold" style={{ fontSize: Math.max(11, zoom * 0.2) }}>
            {Array.from({ length: COLS }, (_, col) => (
                <span
                    key={col}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 tabular-nums ${col === best ? 'text-cyan' : 'text-white/60'}`}
                    style={{
                        left: width / 2 + (col - (COLS - 1) / 2) * CELL * zoom,
                        top: height / 2 - (BOARD_HEIGHT / 2 + HINT_BAND / 2) * zoom,
                    }}
                >
                    {hint === 'loading' ? '···' : `${Math.round(hint[col] * 100)}%`}
                </span>
            ))}
        </div>
    )
}
