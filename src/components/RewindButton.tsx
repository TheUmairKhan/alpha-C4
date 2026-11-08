import ControlButton, { type ControlButtonProps } from './ControlButton'

export default function RewindButton(props: ControlButtonProps) {
    return (
        <ControlButton label="Rewind one move" {...props}>
            ◂◂
        </ControlButton>
    )
}
