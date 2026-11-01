import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { useLayoutEffect } from 'react'
import Board, { BOARD_WIDTH, BOARD_HEIGHT } from '../components/Board'

function FitCamera() {
    const camera = useThree((state) => state.camera) as THREE.OrthographicCamera
    const width = useThree((state) => state.size.width)
    const height = useThree((state) => state.size.height)

    useLayoutEffect(() => {
        // Fit the board (with padding) into the viewport
        const BOARD_W = BOARD_WIDTH
        const BOARD_H = BOARD_HEIGHT
        const PADDING = 1.2
        camera.position.set(0, 0, 10)
        camera.lookAt(0, 0, 0)
        camera.zoom = Math.min(width / (BOARD_W * PADDING), height / (BOARD_H * PADDING))
        camera.updateProjectionMatrix()
    }, [camera, height, width])

    return null
}

export default function Play() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-ink">
      <Canvas orthographic dpr={[1, 2]}>
        <FitCamera />
        <Board />
      </Canvas>
    </main>
  )
}
