import AiWorker from './aiWorker?worker'
import type { AiRequest, AiResponse } from './protocol'

export const AI_SIMULATIONS = 100

// Each client owns a worker (and a copy of the engine), so searches on one never wait behind the other
function createClient() {
  let worker: Worker | null = null
  // Replies arrive in request order, so each one settles the oldest outstanding request
  const waiting: ((response: AiResponse) => void)[] = []

  const getWorker = () => {
    if (!worker) {
      worker = new AiWorker()
      worker.onmessage = ({ data }: MessageEvent<AiResponse>) => {
        waiting.shift()?.(data)
      }
    }
    return worker
  }

  return {
    warmUp: () => void getWorker(),
    chooseMove: (moves: number[]) =>
      new Promise<AiResponse>((resolve) => {
        waiting.push(resolve)
        const request: AiRequest = { moves, simulations: AI_SIMULATIONS }
        getWorker().postMessage(request)
      }),
  }
}

const model = createClient()
const hints = createClient()

export const warmUpAI = model.warmUp
export const chooseMove = model.chooseMove
export const warmUpHints = hints.warmUp
export const chooseHint = hints.chooseMove
