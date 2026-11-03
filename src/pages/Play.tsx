import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef, useState } from 'react'
import Board, { BOARD_WIDTH, BOARD_HEIGHT } from '../components/Board'
import Terminal from '../components/Terminal'

const PADDING = 1.05

// Pixels per world unit that fit the board (with padding) into a viewport
const fitZoom = (width: number, height: number) =>
    Math.min(width / (BOARD_WIDTH * PADDING), height / (BOARD_HEIGHT * PADDING))

function FitCamera() {
    const camera = useThree((state) => state.camera) as THREE.OrthographicCamera
    const width = useThree((state) => state.size.width)
    const height = useThree((state) => state.size.height)

    useLayoutEffect(() => {
        camera.position.set(0, 0, 10)
        camera.lookAt(0, 0, 0)
        camera.zoom = fitZoom(width, height)
        camera.updateProjectionMatrix()
    }, [camera, height, width])

    return null
}

export default function Play() {
  const stageRef = useRef<HTMLDivElement>(null)
  const [boardHeight, setBoardHeight] = useState(0)
  const [moves, setMoves] = useState<number[]>([])

  // Terminal height tracks the rendered board height
  useLayoutEffect(() => {
    const stage = stageRef.current!
    const measure = () => setBoardHeight(fitZoom(stage.clientWidth, stage.clientHeight) * BOARD_HEIGHT)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="flex h-screen w-screen items-center overflow-hidden bg-slate-700">
      <div ref={stageRef} className="h-full min-w-0 flex-1">
        <Canvas orthographic dpr={[1, 2]}>
          <FitCamera />
          <Board onMove={(col) => setMoves((m) => [...m, col])} onReset={() => setMoves([])} />
        </Canvas>
      </div>
      <Terminal height={boardHeight} moves={moves} />
    </main>
  )
}
