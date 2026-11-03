import { useEffect, useRef } from 'react'
import { PLAYER_COLORS } from './sceneKit'


type DiscProps = {
    color: "red" | "yellow"
}

const PLAYERS = ['Player', 'Model']

const DISC_COLORS = { red: PLAYER_COLORS[0].getStyle(), yellow: PLAYER_COLORS[1].getStyle() }

const DISC_GIF = `${import.meta.env.BASE_URL}disc.gif`

function Disc({ color }: DiscProps) {
    const mask = { maskImage: `url(${DISC_GIF})`, WebkitMaskImage: `url(${DISC_GIF})`, maskSize: 'contain', WebkitMaskSize: 'contain' }
    return (
        <div className="-ml-3 h-6 w-6 shrink-0" style={{ backgroundColor: DISC_COLORS[color], ...mask }}>
            <img src={DISC_GIF} alt="" className="h-full w-full mix-blend-multiply [image-rendering:pixelated]" />
        </div>
    )
}

function Indicator() {
    return (
        <svg viewBox='0 0 1600 300' className="h-16 w-32 shrink-0">
            <path
                d="M 0 0
                   L 1600 0
                   A 100 100 0 0 0 1600 300
                   L 100 300
                   L 0 200
                   Z"
                fill='red'
            />
        </svg>
    )
}

export default function Terminal({ height, moves }: { height: number; moves: number[] }) {
    const endRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        endRef.current!.scrollIntoView({ block: 'end' })
    }, [moves])

    return (
        <div className="mr-4 flex w-80 shrink-0 flex-col" style={{ height }}>
            <div className="flex shrink-0 items-center">
                <Indicator />
                <Disc color={moves.length % 2 === 0 ? 'red' : 'yellow'} />
            </div>
            <aside
                className="min-h-0 w-full flex-1 overflow-y-auto rounded-lg bg-black p-4 font-mono text-sm text-green-400"
            >
                {moves.map((col, i) => (
                    <p key={i}>
                        Turn {i + 1}: {PLAYERS[i % 2]} played column {col + 1}
                    </p>
                ))}
                <div ref={endRef} />
            </aside>
        </div>
    )
}
