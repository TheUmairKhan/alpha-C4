import AiWorker from './aiWorker?worker'
import type { AiRequest, AiResponse } from './protocol'

export const AI_SIMULATIONS = 100

let worker: Worker | null = null
let nextId = 0
const pending = new Map<number, (column: number) => void>()

function getWorker() {
  if (!worker) {
    worker = new AiWorker()
    worker.onmessage = ({ data }: MessageEvent<AiResponse>) => {
      pending.get(data.id)?.(data.column)
      pending.delete(data.id)
    }
  }
  return worker
}

/** Start loading the model in the background. */
export const warmUpAI = () => void getWorker()

/** Column (0-6) the model plays next, given every column played so far (Red first). */
export function chooseMove(moves: number[]): Promise<number> {
  return new Promise((resolve) => {
    const id = nextId++
    pending.set(id, resolve)
    const request: AiRequest = { id, moves, simulations: AI_SIMULATIONS }
    getWorker().postMessage(request)
  })
}
