import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { COLS, ROWS, cellIndex, findLine } from '../game/connect4'
import { BACKGROUND, FRAME, PLAYER_COLORS, PX, REDUCED_MOTION, canvasTexture, discTexture, dummy, tint } from './sceneKit'

const CELL = 0.62
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

// Dummy board so Play renders something. Replace with the real Board.
export default function Board() {
  return (
    <mesh>
      <planeGeometry args={[BOARD_WIDTH, BOARD_HEIGHT]} />
      <meshBasicMaterial 
        map={boardTexture}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
