const FACE = `${import.meta.env.BASE_URL}peter_wireframe.png`

type PeterButtonProps = { on: boolean; onToggle: () => void }

export default function PeterButton({ on, onToggle }: PeterButtonProps) {
    return (
        <button
            type="button"
            aria-pressed={on}
            aria-label="Peter"
            onClick={onToggle}
            className={`w-16 cursor-pointer border bg-black px-1 pt-1 transition focus-visible:outline-none ${
                on ? 'border-cyan' : 'border-cyan/15'
            }`}
        >
            <img src={FACE} alt="" className={`block w-full transition ${on ? '' : 'opacity-25'}`} />
        </button>
    )
}
