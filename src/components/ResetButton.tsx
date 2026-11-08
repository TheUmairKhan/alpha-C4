import ControlButton, { type ControlButtonProps } from './ControlButton'

export default function ResetButton(props: ControlButtonProps) {
    return (
        <ControlButton label="Reset game" {...props}>
            RESET
        </ControlButton>
    )
}
