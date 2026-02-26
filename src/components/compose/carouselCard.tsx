import Image from "next/image";
import Link from "next/link";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export interface CarouselCardProps {
	names?: string[];
}

const CarouselCard = ({ names, ...props }: CarouselCardProps) => {
	return (
		<Carousel>
			<CarouselContent>
				{names?.map((name, index) => (
					<CarouselItem key={index}>
						<div className="p-1">
							<Link href={`/games/${name}`} className="block">
								<Card>
									<CardContent className="flex flex-col aspect-square items-center justify-center p-6">
										<Image
											unoptimized={true}
											src={(name || "empty") + ".svg"}
											alt="Snake"
											width={100}
											height={100}
											priority
										/>
										<span className="text font-semibold">{`Game ${name || ""}`}</span>
									</CardContent>
								</Card>
							</Link>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
};

export { CarouselCard };
