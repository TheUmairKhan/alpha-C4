import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef, useState } from 'react'
import Board, { BOARD_HEIGHT } from '../components/Board'
import HintLabels from '../components/HintLabels'
import HintToggle from '../components/HintToggle'
import PeterButton from '../components/PeterButton'
import Terminal from '../components/Terminal'
import { fitZoom } from '../layout'
import type { HintState, LoggedMove } from '../types'

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
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })
  const [hint, setHint] = useState<HintState>(null)
  const [log, setLog] = useState<LoggedMove[]>([])
  const [hints, setHints] = useState(false)
  const [side, setSide] = useState<number | null>(null)
  // Moves shown while reviewing history; null follows the live game
  const [viewIndex, setViewIndex] = useState<number | null>(null)
  const [gameId, setGameId] = useState(0)

  const rewind = () => setViewIndex((v) => Math.max(0, (v ?? log.length) - 1))
  const forward = () => setViewIndex((v) => (v === null || v + 1 >= log.length ? null : v + 1))
  const clearGame = () => {
    setLog([])
    setHint(null)
    setViewIndex(null)
  }
  const reset = () => {
    clearGame()
    setSide(null)
    setGameId((id) => id + 1)
  }

  // Terminal height tracks the rendered board height
  useLayoutEffect(() => {
    const stage = stageRef.current!
    const measure = () => {
      setBoardHeight(fitZoom(stage.clientWidth, stage.clientHeight) * BOARD_HEIGHT)
      setStageSize({ width: stage.clientWidth, height: stage.clientHeight })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="flex h-screen w-screen items-center overflow-hidden cyber-bg">
      <div ref={stageRef} className="relative h-full min-w-0 flex-1">
        <Canvas orthographic dpr={[1, 2]}>
          <FitCamera />
          <Board key={gameId} playerSide={side} viewIndex={viewIndex} hints={hints} onHint={setHint} onMove={(col, confidence) => setLog((l) => [...l, { col, confidence }])} onReset={reset} />
        </Canvas>
        <HintLabels hint={hint} width={stageSize.width} height={stageSize.height} />
      </div>
      <div className="fixed bottom-4 left-4 flex flex-col items-start gap-2">
        <PeterButton />
        <HintToggle on={hints} onToggle={() => setHints((on) => !on)} />
      </div>
      <Terminal height={boardHeight} log={log} playerSide={side} viewIndex={viewIndex} onPick={setSide} onRewind={rewind} onForward={forward} onReset={reset} />
    </main>
  )
}
