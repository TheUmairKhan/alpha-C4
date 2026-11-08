// confidence is the model's visit share for its chosen column; null for the human's moves
export type LoggedMove = { col: number; confidence: number | null }

// What the hint labels show: the model's probability per column, 'loading' while it searches, or null for none
export type HintState = number[] | 'loading' | null
