import init, { Engine } from './pkg/connect4_wasm'
import { AI_CONFIG } from './config'
import type { AiRequest, AiResponse } from './protocol'

let engine: Promise<Engine> | null = null

function loadEngine() {
  engine ??= (async () => {
    await init()
    const response = await fetch(`${import.meta.env.BASE_URL}${AI_CONFIG.modelFile}`)
    if (!response.ok) throw new Error(`failed to fetch ${AI_CONFIG.modelFile} (${response.status})`)
    const weights = new Uint8Array(await response.arrayBuffer())
    return new Engine(weights, AI_CONFIG.hiddenSize, AI_CONFIG.numResBlocks, AI_CONFIG.cPuct)
  })()
  return engine
}

self.onmessage = async ({ data }: MessageEvent<AiRequest>) => {
  const choice = (await loadEngine()).choose_move(new Uint8Array(data.moves), data.simulations)
  const reply: AiResponse = { column: choice.column, probs: Array.from(choice.probs) }
  choice.free()
  self.postMessage(reply)
}

// Load the weights as soon as the worker starts so the first move isn't delayed.
void loadEngine()
