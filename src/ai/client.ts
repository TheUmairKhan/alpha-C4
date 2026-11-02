import AiWorker from './aiWorker?worker'
import type { AiRequest, AiResponse } from './protocol'

export const AI_SIMULATIONS = 100

let worker: Worker | null = null
let resolveMove: ((column: number) => void) | null = null

function getWorker() {
  if (!worker) {
    worker = new AiWorker()
    worker.onmessage = ({ data }: MessageEvent<AiResponse>) => {
      resolveMove?.(data.column)
    }
  }
  return worker
}

export const warmUpAI = () => void getWorker()

export function chooseMove(moves: number[]): Promise<number> {
  return new Promise((resolve) => {
    resolveMove = resolve
    const request: AiRequest = { moves, simulations: AI_SIMULATIONS }
    getWorker().postMessage(request)
  })
}
