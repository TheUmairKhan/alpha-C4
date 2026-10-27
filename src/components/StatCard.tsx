import ChamferPanel from "./ChamferPanel";
import type { ChipColor } from "./Chip";
import Chip from "./Chip";

const ACCENTS = {
  red: {
    title: 'text-c4-red',
    outline: 'bg-c4-red/30 group-hover:bg-c4-red',
    border: 'bg-c4-red/70',
    rule: 'border-c4-red/25',
  },
  yellow: {
    title: 'text-c4-yellow',
    outline: 'bg-c4-yellow/30 group-hover:bg-c4-yellow',
    border: 'bg-c4-yellow/70',
    rule: 'border-c4-yellow/25',
  },
}

type StatsCardProps = {
    title: string,
    accent: ChipColor,
    stats: { label: string, value: string | number }[]
}

export default function StatsCard({ title, accent, stats }: StatsCardProps) {
    const styles = ACCENTS[accent];

    return (
        <ChamferPanel
            className="group"
            outlineClassName={`${styles.outline} transition-colors [--chamfer:27px]`}
            borderClassName={`${styles.border} [--chamfer:20px]`}
            surfaceClassName="flex flex-col gap-3 bg-panel/85 px-6 py-5 backdrop-blur-md [--chamfer:20px]"
        >
            <h3 className={styles.title}>
                <Chip color={accent} className="size-3"/>
                {title}
            </h3>
            <dl className="flex flex-col gap-2">
                {stats.map(({ label, value }) => (
                    <div key={label} className={`flex items-baseline justify-between border-t pt-2 ${styles.rule}`}>
                        <dt className="font-mono text-xs tracking-[0.15em] whitespace-nowrap text-mist/60">{label}</dt>
                        <dd className="font-mono text-2xl font-medium text-mist tabular-nums">{value}</dd>
                    </div>
                ))}
            </dl>
        </ChamferPanel>
    )
}