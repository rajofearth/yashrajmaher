import Image from "next/image";

export default function AuthLayout({ children, quote = "Design is not just what it looks like and feels like. Design is how it works.", author = "Steve Jobs" }) {
	return (
		<div className="min-h-screen bg-background">
			<div className="grid min-h-screen lg:grid-cols-2">
				{/* Left side - Form */}
				<div className="flex flex-col justify-center p-4 md:p-6 lg:p-8 relative">
					{/* Gradient blend overlay */}
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 lg:block hidden"></div>
					
					<div className="flex flex-1 items-center justify-center py-4 relative z-10">
						{children}
					</div>

					<div className="text-center text-xs text-muted-foreground mt-4 relative z-10">
						<p className="font-medium">© 2024 Yashraj Maher. Crafted with care.</p>
					</div>
				</div>

				{/* Right side - Mesh Gradient */}
				<div className="relative hidden bg-muted lg:block overflow-hidden">
					{/* Mesh gradient background */}
					<div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 via-blue-500/25 to-purple-600/30"></div>
					<div className="absolute inset-0 bg-gradient-to-tl from-pink-400/15 via-orange-300/20 to-yellow-400/25"></div>
					<div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-indigo-500/15 to-purple-500/25"></div>
					<div className="absolute inset-0 bg-gradient-to-bl from-emerald-400/15 via-teal-400/20 to-blue-500/20"></div>
					
					{/* Blend into left side */}
					<div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/5 to-background/20"></div>
					
					{/* Quote overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>
					<div className="absolute bottom-6 left-6 right-6">
						<blockquote className="text-card-foreground">
							<p className="text-base font-serif italic leading-relaxed">
								"{quote}"
							</p>
							<footer className="mt-3 text-xs font-medium text-muted-foreground">— {author}</footer>
						</blockquote>
					</div>
				</div>
			</div>
		</div>
	);
} 