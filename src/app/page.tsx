import Image from "next/image";
import { CarouselCard } from "@/components/compose/carouselCard";

export default function Home() {
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center">
				<Image
					unoptimized={true}
					className="dark:invert"
					src="logo.svg"
					alt="Namu logo"
					width={100}
					height={100}
					priority
				/>
				<ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
					<li className="mb-2">You can call me coyote</li>
					<li>This site is named NAMU which means trees in Korean</li>
				</ol>
				<CarouselCard names={["snake", ""]} />
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				Still on developing
			</footer>
		</div>
	);
}
