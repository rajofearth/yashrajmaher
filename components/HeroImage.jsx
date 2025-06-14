"use client";
import Image from "next/image";

export default function HeroImage() {
	return (
		<div
			className="hover-border relative"
			style={{
				borderRadius: "50%",
				padding: "3px",
				background: `linear-gradient(90deg, #5c5546, #84776a, #b5a89a, #84776a, #5c5546)`,
				backgroundSize: "300% 300%",
				animation: "flowingBorder 8s ease infinite",
			}}
		>
			<style jsx global>{`
				@keyframes flowingBorder {
					0% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
					100% {
						background-position: 0% 50%;
					}
				}

				.hover-border {
					transition: background 0.5s ease;
				}

				.hover-border:hover {
					background: linear-gradient(90deg, #faf6ec, #e6dcc1, #faf6ec, #e6dcc1, #faf6ec);
					background-size: 300% 300%;
					animation: flowingBorder 5s ease infinite;
				}
			`}</style>
			<div className="overflow-hidden rounded-full">
				<Image src="/my.png" alt="Yashraj Maher" width={160} height={160} priority />
			</div>
		</div>
	);
}
