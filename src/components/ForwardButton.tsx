import ControlButton, { type ControlButtonProps } from './ControlButton'

export default function ForwardButton(props: ControlButtonProps) {
    return (
        <ControlButton label="Fast forward one move" {...props}>
            ▸▸
        </ControlButton>
    )
}
