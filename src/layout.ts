import { BOARD_HEIGHT, BOARD_WIDTH } from './components/Board'

const PADDING = 1.05

// World-unit strip above (and, to keep the board centred, below) the board, where the hint percentages sit
export const HINT_BAND = 0.4

// Pixels per world unit that fit the board (with padding and hint strips) into a viewport
export const fitZoom = (width: number, height: number) =>
    Math.min(width / (BOARD_WIDTH * PADDING), height / ((BOARD_HEIGHT + HINT_BAND * 2) * PADDING))
