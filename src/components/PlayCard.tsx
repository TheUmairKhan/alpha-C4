export default function PlayCard() {
    return (
        <div className="flex items-end justify-between gap-4">
            <h2 className="animate-flicker text-7xl leading-none font-bold tracking-[0.08em] text-mist [text-shadow:0_0_18px_rgba(255,46,77,0.7),3px_0_0_rgba(0,240,255,0.5)]">
            PLAY
            </h2>
            <div className="mb-1 flex gap-1.5 rounded-full border border-cyan/40 bg-ink/80 p-1.5 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
            </div>
      </div>
    )
}