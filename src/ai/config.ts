const env = import.meta.env

export const AI_CONFIG = {
  simulations: Number(env.VITE_AI_SIMULATIONS ?? 100),
  modelFile: String(env.VITE_AI_MODEL ?? 'model.mpk'),
  hiddenSize: Number(env.VITE_AI_HIDDEN_SIZE ?? 64),
  numResBlocks: Number(env.VITE_AI_RES_BLOCKS ?? 7),
  cPuct: Number(env.VITE_AI_C_PUCT ?? 1.0),
}
