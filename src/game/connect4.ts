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

export const GameResult = {
    Ongoing: "Ongoing",
    Win: "Win",
    Draw: "Draw",
    Invalid: "Invalid",
} as const
export type GameResult = (typeof GameResult)[keyof typeof GameResult]

// board: flattened 7x6 board (-1: empty, 0, 1), heights: track pieces in each column [7], turn: which player's turn
export type BoardState = { cells: number[]; heights: number[]; turn: number; status: GameResult}

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


export function newGame(): BoardState {
    return {
        cells: Array(COLS * ROWS).fill(-1),
        heights: Array(COLS).fill(0),
        turn: 0,
        status: GameResult.Ongoing
    }
}

export function playMove(board: BoardState, col: number): BoardState {
    const { cells, heights, turn } = board

    if (heights[col] >= ROWS) {
        board.status = GameResult.Invalid
        return board
    }

    const row = heights[col]
    cells[cellIndex(col, row)] = turn
    heights[col]++

    if (findLine(cells, col, row)) {
        board.status = GameResult.Win
        return board
    }
    if (heights.every(height => height === ROWS)) {
        board.status = GameResult.Draw
        return board
    }

    board.turn = 1 - turn
    board.status = GameResult.Ongoing

    return board
}
