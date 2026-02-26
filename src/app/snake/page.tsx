'use client'

import { useEffect, useRef } from 'react'

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const config = {
            locateFile: (url: string, scriptDirectory: string) => {
                return "/snake.wasm"
            }
        }
        window.Module = config as EmscriptenModule

        // 动态加载脚本
        const script = document.createElement('script')
        script.src = '/snake.js'
        script.async = true
        document.body.appendChild(script)

        return () => {
            // 清理
            script.remove()
            window.Module = undefined
        }
    }, [])

    return (
        <>
            <canvas
                ref={canvasRef}
                id="canvas"
                width={640}
                height={480}
                style={{ display: 'block' }}
            />
        </>
    )
}