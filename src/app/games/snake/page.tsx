"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function Home() {
	useEffect(() => {
		const config = {
			locateFile: (url: string, scriptDirectory: string) => {
				return "/snake.wasm";
			},
		};
		window.Module = config as EmscriptenModule;
		return () => {
			window.Module = undefined;
		};
	});

	return (
		<>
			<canvas
				id="canvas"
				width={640}
				height={480}
				style={{ display: "block" }}
			/>
			<Script
				src="/snake.js"
				strategy="afterInteractive"
				onReady={() => {
					if (!window.Module) {
						window.location.reload();
					}
				}}
			/>
		</>
	);
}
