import init, { Engine } from './pkg/connect4_wasm'
import type { AiRequest, AiResponse } from './protocol'

const HIDDEN_SIZE = 64
const NUM_RES_BLOCKS = 7
const C_PUCT = 1.0

let engine: Promise<Engine> | null = null

function loadEngine() {
  engine ??= (async () => {
    await init()
    const response = await fetch(`${import.meta.env.BASE_URL}model.mpk`)
    if (!response.ok) throw new Error(`failed to fetch model.mpk (${response.status})`)
    const weights = new Uint8Array(await response.arrayBuffer())
    return new Engine(weights, HIDDEN_SIZE, NUM_RES_BLOCKS, C_PUCT)
  })()
  return engine
}

self.onmessage = async ({ data }: MessageEvent<AiRequest>) => {
  const column = (await loadEngine()).best_move(new Uint8Array(data.moves), data.simulations)
  const reply: AiResponse = { column }
  self.postMessage(reply)
}

// Load the weights as soon as the worker starts so the first move isn't delayed.
void loadEngine()
