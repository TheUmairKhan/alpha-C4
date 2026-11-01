import * as THREE from 'three'

export const BACKGROUND = '#060a10'
export const FRAME = '#00f0ff'
export const PLAYER_COLORS = [new THREE.Color('#ff2e4d'), new THREE.Color('#ffd23b')]
export const CAMERA_POSITION = new THREE.Vector3(0, 1.5, 7.5)
export const BASE_FOV = 55
export const WIDE_LAYOUT = 1024
export const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const PX = 128

export function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  draw(canvas.getContext('2d')!)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export const discTexture = canvasTexture(PX, PX, (ctx) => {
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(64, 64, 62, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(64, 64, 40, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(64, 64, 59, 0, Math.PI * 2)
  ctx.stroke()
})

export const glowTexture = canvasTexture(PX, PX, (ctx) => {
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.35)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, PX, PX)
})

export const dummy = new THREE.Object3D()
export const tint = new THREE.Color()
