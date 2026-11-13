/* tslint:disable */
/* eslint-disable */

export class Engine {
    free(): void;
    [Symbol.dispose](): void;
    best_move(moves: Uint8Array, simulations: number): number;
    /**
     * Runs one search and returns both the chosen column and the visit distribution it came from,
     * so callers can report confidence without searching twice.
     */
    choose_move(moves: Uint8Array, simulations: number): MoveChoice;
    move_probs(moves: Uint8Array, simulations: number): Float32Array;
    constructor(weights: Uint8Array, hidden_size: number, num_res_blocks: number, c_puct: number);
}

/**
 * A searched move: `probs[column]` is the model's confidence in it.
 */
export class MoveChoice {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    column: number;
    probs: Float32Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_engine_free: (a: number, b: number) => void;
    readonly __wbg_get_movechoice_column: (a: number) => number;
    readonly __wbg_get_movechoice_probs: (a: number) => [number, number];
    readonly __wbg_movechoice_free: (a: number, b: number) => void;
    readonly __wbg_set_movechoice_column: (a: number, b: number) => void;
    readonly __wbg_set_movechoice_probs: (a: number, b: number, c: number) => void;
    readonly engine_best_move: (a: number, b: number, c: number, d: number) => number;
    readonly engine_choose_move: (a: number, b: number, c: number, d: number) => number;
    readonly engine_move_probs: (a: number, b: number, c: number, d: number) => [number, number];
    readonly engine_new: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
