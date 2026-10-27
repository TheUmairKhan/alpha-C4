import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { useLayoutEffect } from 'react'
import { OrthographicCamera } from 'three'

function FitCamera() {
    const camera = useThree((state) => state.camera) as THREE.OrthographicCamera
    const width = useThree((state) => state.size.width)
    const height = useThree((state) => state.size.height)
    
    useLayoutEffect(() => {
        // need to implement camera.zoom once board is made
        camera.position.set(0, 0, 10)
        camera.lookAt(0, 0, 0)
        camera.updateProjectionMatrix()
    }, [get, height, width])

    return null
}

export default function Play() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-ink">
      <Canvas orthographic dpr={[1, 2]}>
        <FitCamera />
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#ff2e4d" />
        </mesh>
      </Canvas>
    </main>
  )
}
