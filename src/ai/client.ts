import AiWorker from './aiWorker?worker'
import type { AiRequest, AiResponse } from './protocol'

export const AI_SIMULATIONS = 100

let worker: Worker | null = null
// Replies arrive in request order, so each one settles the oldest outstanding request
const waiting: ((column: number) => void)[] = []

function getWorker() {
  if (!worker) {
    worker = new AiWorker()
    worker.onmessage = ({ data }: MessageEvent<AiResponse>) => {
      waiting.shift()?.(data.column)
    }
  }
  return worker
}

export const warmUpAI = () => void getWorker()

export function chooseMove(moves: number[]): Promise<number> {
  return new Promise((resolve) => {
    waiting.push(resolve)
    const request: AiRequest = { moves, simulations: AI_SIMULATIONS }
    getWorker().postMessage(request)
  })
}
