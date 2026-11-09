import { useEffect, useRef, useState } from 'react'

const URL_PATH = `${import.meta.env.BASE_URL}Family-Guy.mp4`
const TAIL = 5
const FADE_MS = 200

function seekRandom(video: HTMLVideoElement, fileUrl: string | null): boolean {
    if (video.readyState < 1) return false
    if (fileUrl && video.src === fileUrl) {
        video.currentTime = Math.random() * Math.max(0, video.duration - TAIL)
        return true
    }
    const starts: number[] = []
    for (let i = 0; i < video.buffered.length; i++) {
        const start = video.buffered.start(i)
        const end = video.buffered.end(i)
        if (end - start >= TAIL) starts.push(start + Math.random() * (end - start - TAIL))
    }
    if (starts.length === 0) return false
    video.currentTime = starts[Math.floor(Math.random() * starts.length)]
    return true
}

export default function ThinkingVideo({ active }: { active: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [fileUrl, setFileUrl] = useState<string | null>(null)
    const cuedRef = useRef(false)

    useEffect(() => {
        const controller = new AbortController()
        fetch(URL_PATH, { signal: controller.signal })
            .then((res) => res.blob())
            .then((blob) => setFileUrl(URL.createObjectURL(blob)))
            .catch(() => {})
        return () => controller.abort()
    }, [])

    useEffect(() => {
        const video = videoRef.current!
        if (!video.src) video.src = URL_PATH
        if (active) return
        if (fileUrl && video.src !== fileUrl) {
            video.src = fileUrl
            cuedRef.current = false
        }
        const cue = () => {
            if (cuedRef.current) return
            cuedRef.current = seekRandom(video, fileUrl)
        }
        video.addEventListener('loadedmetadata', cue)
        video.addEventListener('progress', cue)
        const timer = setTimeout(cue, FADE_MS)
        return () => {
            clearTimeout(timer)
            video.removeEventListener('loadedmetadata', cue)
            video.removeEventListener('progress', cue)
        }
    }, [fileUrl, active])

    useEffect(() => {
        const video = videoRef.current!
        if (!active) {
            video.pause()
            return
        }
        if (!cuedRef.current) seekRandom(video, fileUrl)
        cuedRef.current = false
        video.muted = false
        video.volume = 1
        video.play().catch(() => {})
        return () => video.pause()
    }, [active])

    return (
        <div
            className={`pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity ${
                active ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <video ref={videoRef} preload="auto" playsInline className="max-h-[70vh] max-w-[70vw] border-2 border-cyan" />
        </div>
    )
}
