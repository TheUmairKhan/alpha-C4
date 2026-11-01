const COLUMNS = 7
const ROWS = 6
export const COLS = COLUMNS
export { ROWS }
const DIRECTIONS = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
]

export enum GameResult {
    Ongoing = "Ongoing",
    Win = "Win",
    Draw = "Draw",
    Invalid = "Invalid"
}

// board: flattened 7x6 board (-1: empty, 0, 1), heights: track pieces in each column [7], turn: which player's turn
export type Board = { cells: number[]; heights: number[]; turn: number}

export const cellIndex = (col: number, row: number) => col * ROWS + row;

export function findLine(cells: number[], col: number, row: number) {
    const playerColor = cells[cellIndex(col, row)]
    for (const [dc, dr] of DIRECTIONS) {
        let line = [cellIndex(col, row)]
        for (const sign of [1, -1]) {
            let c = col + dc * sign
            let r = row + dr * sign
            while ((c >= 0 && c < COLUMNS && r >= 0 && r < ROWS) && cells[cellIndex(c, r)] === playerColor) {
                line.push(cellIndex(c, r))
                c += dc * sign
                r += dr * sign
            }
        }
        if (line.length >= 4) return line
    }
    return null
}


export function playMove(board: Board, col: number) {
    const { cells, heights, turn } = board

    if (heights[col] >= ROWS) return { status: GameResult.Invalid, board }

    const row = heights[col]
    cells[cellIndex(col, row)] = turn
    heights[col]++

    const winningLine = findLine(cells, col, row)

    if (winningLine) return { status: GameResult.Win, board, winningLine }
    if (heights.every(height => height === ROWS)) return { status: GameResult.Draw, board }

    board.turn = 1 - turn

    return { status: GameResult.Ongoing, board }
}
