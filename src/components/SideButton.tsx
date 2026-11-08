import Chip, { type ChipColor } from './Chip'

type SideButtonProps = { label: string; chip: ChipColor; onPick: () => void }

// One of the player-order choices shown before a game starts
export default function SideButton({ label, chip, onPick }: SideButtonProps) {
    return (
        <button
            type="button"
            onClick={onPick}
            className="flex w-full cursor-pointer items-center gap-3 border border-green-400/50 px-3 py-2 text-left font-bold tracking-[0.2em] transition hover:bg-green-400 hover:text-black focus-visible:bg-green-400 focus-visible:text-black focus-visible:outline-none"
        >
            <Chip color={chip} className="size-3" />
            {label}
        </button>
    )
}
