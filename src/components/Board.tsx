import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { COLS, ROWS, GameResult, cellIndex, findLine, newGame, playMove, type BoardState } from '../game/connect4'
import type { HintState } from '../types'
import { chooseHint, chooseMove, warmUpAI, warmUpHints } from '../ai/client'
import { BACKGROUND, CELL, FRAME, PLAYER_COLORS, PX, REDUCED_MOTION, canvasTexture, discTexture, dummy, tint } from './sceneKit'

const DISC_RADIUS = 0.27
const HOLE_RADIUS = 0.235
const PADDING_X = 0.3
const PADDING_Y = 0.12
const DISC_Z = -0.06
const GRAVITY = 22
const WIN_HOLD = 2.8
const CLEAR_TIME = 1.6
const CHEVRON_SPEED = 0.4
const SCANLINE_GAP = 0.025

export const BOARD_WIDTH = COLS * CELL + PADDING_X * 2
export const BOARD_HEIGHT = ROWS * CELL + PADDING_Y * 2

const boardTexture = canvasTexture(
  Math.round((BOARD_WIDTH / CELL) * PX),
  Math.round((BOARD_HEIGHT / CELL) * PX),
  (ctx) => {
    const { width, height } = ctx.canvas
    const padX = (PADDING_X / CELL) * PX
    const padY = (PADDING_Y / CELL) * PX
    const holeRadius = (HOLE_RADIUS / CELL) * PX
    const holes = (path: () => void) => {
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS; r++) {
          ctx.beginPath()
          ctx.arc(padX + (c + 0.5) * PX, padY + (r + 0.5) * PX, holeRadius, 0, Math.PI * 2)
          path()
        }
      }
    }

    ctx.fillStyle = 'rgba(8, 12, 36, 0.88)'
    ctx.beginPath()
    ctx.roundRect(6, 6, width - 12, height - 12, 28)
    ctx.fill()

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)'
    ctx.lineWidth = 2
    for (let c = 1; c < COLS; c++) {
      ctx.beginPath()
      ctx.moveTo(padX + c * PX, padY)
      ctx.lineTo(padX + c * PX, height - padY)
      ctx.stroke()
    }

    ctx.globalCompositeOperation = 'destination-out'
    holes(() => ctx.fill())
    ctx.globalCompositeOperation = 'source-over'

    ctx.strokeStyle = FRAME
    ctx.shadowColor = FRAME
    ctx.shadowBlur = 16
    ctx.lineWidth = 3
    holes(() => ctx.stroke())

    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.roundRect(6, 6, width - 12, height - 12, 28)
    ctx.stroke()
  },
)

const chevronTexture = canvasTexture(PX, PX, (ctx) => {
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 10
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(0, 38)
  ctx.lineTo(64, 84)
  ctx.lineTo(PX, 38)
  ctx.stroke()
})
chevronTexture.wrapT = THREE.RepeatWrapping
chevronTexture.repeat.set(1, ROWS)

const columnShape = (ctx: CanvasRenderingContext2D) => {
  const { width, height } = ctx.canvas
  ctx.beginPath()
  ctx.roundRect(4, 4, width - 8, height - 8, 14)
}

const outlineTexture = canvasTexture(PX, PX * ROWS, (ctx) => {
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 6
  columnShape(ctx)
  ctx.stroke()
})

const columnFillTexture = canvasTexture(PX, PX * ROWS, (ctx) => {
  ctx.fillStyle = '#fff'
  columnShape(ctx)
  ctx.fill()
})

const scanlineTexture = canvasTexture(1, 4, (ctx) => {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
  ctx.fillRect(0, 0, 1, 2)
})
scanlineTexture.wrapT = THREE.RepeatWrapping
scanlineTexture.repeat.set(1, BOARD_HEIGHT / SCANLINE_GAP)

type Disc = { col: number; row: number; player: number; y: number; vy: number; settled: boolean }



const colX = (col: number) => (col - (COLS - 1) / 2) * CELL
const rowY = (row: number) => (row - (ROWS - 1) / 2) * CELL

type Anim = {
  discs: Disc[]
  phase: 'play' | 'won' | 'clear'
  timer: number
  pending: number[] | null
  winners: Set<number>
}

const newAnim = (): Anim => ({ discs: [], phase: 'play', timer: 0, pending: null, winners: new Set() })

const canPlace = (board: BoardState, anim: Anim, col: number) =>
  anim.phase === 'play' && board.heights[col] < ROWS && anim.discs.every((d) => d.settled)

function dropDisc(board: BoardState, anim: Anim, col: number) {
  const player = board.turn
  const row = board.heights[col]
  playMove(board, col)

  // pending holds the winning cells once the disc lands ([] = draw, null = game continues)
  if (board.status === GameResult.Win) anim.pending = findLine(board.cells, col, row)
  else if (board.status === GameResult.Draw) anim.pending = []
  else anim.pending = null

  anim.discs.push({
    col,
    row,
    player,
    y: REDUCED_MOTION ? rowY(row) : rowY(ROWS) + CELL,
    vy: 0,
    settled: false,
  })
  anim.timer = 0
}

// Returns true once the clear animation has finished and a new game should start
function stepAnim(anim: Anim, dt: number): boolean {
  anim.timer += dt
  if (anim.phase === 'won' && anim.timer >= WIN_HOLD) {
    anim.phase = 'clear'
    anim.timer = 0
    for (const disc of anim.discs) disc.settled = false
  } else if (anim.phase === 'clear' && anim.timer >= CLEAR_TIME) {
    return true
  }

  for (const disc of anim.discs) {
    if (disc.settled) continue
    if (REDUCED_MOTION) {
      // No gravity or bounce: the disc sits in its cell immediately (and stays put while clearing)
      disc.y = rowY(disc.row)
    } else {
      disc.vy -= GRAVITY * dt
      disc.y += disc.vy * dt
      const floor = rowY(disc.row)
      if (anim.phase === 'clear' || disc.y > floor) continue
      disc.y = floor
      if (Math.abs(disc.vy) > 1.5) {
        disc.vy *= -0.28
        continue
      }
    }
    disc.vy = 0
    disc.settled = true
    if (anim.pending) {
      anim.phase = 'won'
      anim.timer = 0
      anim.winners = new Set(anim.pending)
      anim.pending = null
    }
  }
  return false
}

type BoardProps = {
  // Which player the human controls (0 = first, 1 = second); null until they choose, which leaves the board inert
  playerSide: number | null
  // Number of moves to show while reviewing history; null follows the live game
  viewIndex: number | null
  // Show the model's suggestion for the human's next move
  hints: boolean
  // Reports what the hint labels should show
  onHint: (hint: HintState) => void
  // confidence is the model's visit share for its own moves, null for the human's
  onMove: (col: number, confidence: number | null) => void
  // True while the model is working out its move
  onThinking: (thinking: boolean) => void
  onReset: () => void
}

// Static discs for the position after the first `count` moves
function replayDiscs(moves: number[], count: number): Disc[] {
  const heights = Array<number>(COLS).fill(0)
  return moves.slice(0, count).map((col, i) => {
    const row = heights[col]++
    return { col, row, player: i % 2, y: rowY(row), vy: 0, settled: true }
  })
}

export default function Board({ playerSide, viewIndex, hints, onHint, onMove, onThinking, onReset }: BoardProps) {
  const discsRef = useRef<THREE.InstancedMesh>(null)
  const highlightRef = useRef<THREE.Group>(null)
  const fillMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const chevronMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const outlineMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const boardRef = useRef<BoardState>(newGame())
  const animRef = useRef<Anim>(newAnim())
  const hoverRef = useRef<number | null>(null)
  const movesRef = useRef<number[]>([])
  const thinkingRef = useRef(false)
  const aliveRef = useRef(true)
  const hintRef = useRef<{ forLength: number; probs: number[] | null }>({ forLength: -1, probs: null })
  const reportedHintRef = useRef<HintState>(null)
  const viewCacheRef = useRef<{ moves: number[]; count: number; discs: Disc[] } | null>(null)
  const get = useThree((state) => state.get)

  useLayoutEffect(() => {
    const discs = discsRef.current!
    for (let i = 0; i < COLS * ROWS; i++) discs.setColorAt(i, tint.set(0xffffff))
    discs.count = 0
    warmUpAI()
    aliveRef.current = true
    return () => {
      aliveRef.current = false
      // A move still being computed is ignored once this board is gone, so nothing else would clear it
      onThinking(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    if (hints) warmUpHints()
  }, [hints])

  const play = (col: number, confidence: number | null = null) => {
    dropDisc(boardRef.current, animRef.current, col)
    movesRef.current.push(col)
    onMove(col, confidence)
  }

  // Runs beside the game: the human can move before it finishes, which makes the result stale and ignored
  const requestHint = () => {
    const forLength = movesRef.current.length
    hintRef.current = { forLength, probs: null }
    chooseHint(movesRef.current.slice()).then(({ probs }) => {
      if (aliveRef.current && hintRef.current.forLength === forLength) hintRef.current.probs = probs
    })
  }

  const requestModelMove = () => {
    thinkingRef.current = true
    onThinking(true)
    chooseMove(movesRef.current.slice())
      .then(({ column: col, probs }) => {
        // The game may have been reset while the model was thinking
        if (!aliveRef.current) return
        thinkingRef.current = false
        onThinking(false)
        play(col, probs[col])
      })
  }

  const columnAt = (point: THREE.Vector3) =>
    THREE.MathUtils.clamp(Math.floor(point.x / CELL + COLS / 2), 0, COLS - 1)

  const hover = ({ point }: { point: THREE.Vector3 }) => {
    hoverRef.current = columnAt(point)
    get().gl.domElement.style.cursor = 'pointer'
  }

  const leave = () => {
    hoverRef.current = null
    get().gl.domElement.style.cursor = ''
  }

  const place = ({ point }: { point: THREE.Vector3 }) => {
    const col = columnAt(point)
    const humanTurn = playerSide !== null && viewIndex === null && boardRef.current.turn === playerSide && !thinkingRef.current
    if (humanTurn && canPlace(boardRef.current, animRef.current, col)) play(col)
  }

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05)
    // The game is frozen while reviewing history, so it can't auto-clear underneath the viewer
    if (viewIndex === null && stepAnim(animRef.current, dt)) {
      boardRef.current = newGame()
      animRef.current = newAnim()
      movesRef.current = []
      thinkingRef.current = false
      onReset()
      return
    }
    const board = boardRef.current
    const anim = animRef.current

    // Model's turn: once the human's disc has landed, ask it for a move
    if (
      playerSide !== null &&
      board.turn === 1 - playerSide &&
      board.status === GameResult.Ongoing &&
      !thinkingRef.current &&
      anim.phase === 'play' &&
      anim.discs.every((d) => d.settled)
    ) {
      requestModelMove()
    }

    const humanTurn =
      playerSide !== null &&
      viewIndex === null &&
      board.turn === playerSide &&
      board.status === GameResult.Ongoing &&
      anim.phase === 'play' &&
      anim.discs.every((d) => d.settled)
    if (hints && humanTurn && hintRef.current.forLength !== movesRef.current.length) requestHint()

    const hint = hintRef.current
    const shownHint: HintState =
      hints && humanTurn ? (hint.forLength === movesRef.current.length && hint.probs ? hint.probs : 'loading') : null
    if (shownHint !== reportedHintRef.current) {
      reportedHintRef.current = shownHint
      onHint(shownHint)
    }

    const highlight = highlightRef.current!
    const col = hoverRef.current
    const viewing = viewIndex !== null
    const turn = viewing ? viewIndex % 2 : board.turn
    highlight.visible = !viewing && col !== null && playerSide !== null && board.turn === playerSide && !thinkingRef.current && anim.phase === 'play' && board.heights[col] < ROWS
    if (col !== null) highlight.position.x = colX(col)
    fillMaterialRef.current!.color.copy(PLAYER_COLORS[turn]).multiplyScalar(0.45)
    chevronMaterialRef.current!.color.copy(PLAYER_COLORS[turn])
    outlineMaterialRef.current!.color.copy(PLAYER_COLORS[turn])
    chevronTexture.offset.y += CHEVRON_SPEED * dt

    const discs = discsRef.current!
    const pulse = 1 + 0.08 * Math.sin(clock.elapsedTime * 10)
    const highlighting = !viewing && anim.phase === 'won' && anim.winners.size > 0
    const bottom = -BOARD_HEIGHT / 2

    let shown = anim.discs
    if (viewing) {
      const cache = viewCacheRef.current
      if (!cache || cache.moves !== movesRef.current || cache.count !== viewIndex) {
        viewCacheRef.current = { moves: movesRef.current, count: viewIndex, discs: replayDiscs(movesRef.current, viewIndex) }
      }
      shown = viewCacheRef.current!.discs
    }

    shown.forEach((disc, i) => {
      const winning = highlighting && anim.winners.has(cellIndex(disc.col, disc.row))
      const dimmed = highlighting && !winning
      const fade = THREE.MathUtils.clamp(disc.y - bottom + 0.6, 0, 1)

      dummy.position.set(colX(disc.col), disc.y, DISC_Z)
      dummy.scale.setScalar(fade * (winning ? pulse : 1))
      dummy.updateMatrix()
      discs.setMatrixAt(i, dummy.matrix)
      discs.setColorAt(i, tint.copy(PLAYER_COLORS[disc.player]).multiplyScalar(dimmed ? 0.3 : 1))
    })

    discs.count = shown.length
    discs.instanceMatrix.needsUpdate = true
    discs.instanceColor!.needsUpdate = true
  })

  return (
    <group>
      <mesh position={[0, 0, DISC_Z - 0.1]} renderOrder={3}>
        <planeGeometry args={[BOARD_WIDTH - 0.1, BOARD_HEIGHT - 0.1]} />
        <meshBasicMaterial color={BACKGROUND} transparent opacity={0.85} depthWrite={false} />
      </mesh>
      <instancedMesh ref={discsRef} args={[undefined, undefined, COLS * ROWS]} renderOrder={5} frustumCulled={false}>
        <planeGeometry args={[DISC_RADIUS * 2, DISC_RADIUS * 2]} />
        <meshBasicMaterial map={discTexture} alphaTest={0.5} toneMapped={false} />
      </instancedMesh>
      <mesh renderOrder={6} onPointerMove={hover} onPointerLeave={leave} onClick={place}>
        <planeGeometry args={[BOARD_WIDTH, BOARD_HEIGHT]} />
        <meshBasicMaterial map={boardTexture} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={highlightRef} visible={false}>
        <mesh position-z={0.005} renderOrder={7}>
          <planeGeometry args={[CELL - 0.04, ROWS * CELL]} />
          <meshBasicMaterial
            ref={fillMaterialRef}
            map={columnFillTexture}
            transparent
            opacity={0.25}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh position-z={0.01} renderOrder={8}>
          <planeGeometry args={[CELL - 0.04, ROWS * CELL]} />
          <meshBasicMaterial
            ref={chevronMaterialRef}
            map={chevronTexture}
            alphaMap={columnFillTexture}
            transparent
            opacity={0.35}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh position-z={0.02} renderOrder={9}>
          <planeGeometry args={[CELL - 0.04, ROWS * CELL]} />
          <meshBasicMaterial
            ref={outlineMaterialRef}
            map={outlineTexture}
            transparent
            opacity={0.8}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
      <mesh position-z={0.03} renderOrder={10}>
        <planeGeometry args={[BOARD_WIDTH, BOARD_HEIGHT]} />
        <meshBasicMaterial map={scanlineTexture} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}
