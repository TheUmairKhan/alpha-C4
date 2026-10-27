import { Link } from 'react-router'
import ChamferPanel from './ChamferPanel'
import { chamfer } from '../chamfer'

export default function PlayCard() {
    return (
        <ChamferPanel
            className="w-full drop-shadow-[0_0_28px_rgba(255,46,77,0.35)]"
            outlineClassName="bg-c4-red/50 [--chamfer:35px]"
            borderClassName="bg-c4-red/80 [--chamfer:28px]"
            surfaceClassName="flex flex-col gap-6 bg-panel/85 px-8 pt-6 pb-8 backdrop-blur-md [--chamfer:28px] sm:px-10"
        >
            <div className="flex items-end justify-between gap-4">
                <h2 className="animate-flicker text-7xl leading-none font-bold tracking-[0.08em] text-mist [text-shadow:0_0_18px_rgba(255,46,77,0.7),3px_0_0_rgba(0,240,255,0.5)]">
                PLAY
                </h2>
            </div>
            <Link
                to="/play"
                className={`${chamfer} group flex w-full cursor-pointer items-center justify-center gap-3 bg-c4-red py-3.5 text-base font-bold tracking-[0.3em] text-ink transition [--chamfer:12px] hover:bg-c4-yellow focus-visible:bg-c4-yellow focus-visible:outline-none active:scale-[0.98]`}
            >
                DROP IN
                <span aria-hidden="true" className="transition-transform group-hover:translate-y-1">
                    ▾
                </span>
            </Link>
        </ChamferPanel>
    )
}
