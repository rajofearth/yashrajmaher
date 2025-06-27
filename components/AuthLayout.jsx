export default function AuthLayout({
	children,
	quote = "Design is not just what it looks like and feels like. Design is how it works.",
	author = "Steve Jobs",
}) {
	return (
		<div className="bg-background min-h-screen">
			<div className="grid min-h-screen lg:grid-cols-2">
				{/* Left side - Form */}
				<div className="relative flex flex-col justify-center p-4 md:p-6 lg:p-8">
					{/* Gradient blend overlay */}
					<div className="to-primary/5 absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent lg:block"></div>

					<div className="relative z-10 flex flex-1 items-center justify-center py-4">{children}</div>

					<div className="text-muted-foreground relative z-10 mt-4 text-center text-xs">
						<p className="font-medium">© 2024 Yashraj Maher. Crafted with care.</p>
					</div>
				</div>

				{/* Right side - Mesh Gradient */}
				<div className="bg-muted relative hidden overflow-hidden lg:block">
					{/* Mesh gradient background */}
					<div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 via-blue-500/25 to-purple-600/30"></div>
					<div className="absolute inset-0 bg-gradient-to-tl from-pink-400/15 via-orange-300/20 to-yellow-400/25"></div>
					<div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-indigo-500/15 to-purple-500/25"></div>
					<div className="absolute inset-0 bg-gradient-to-bl from-emerald-400/15 via-teal-400/20 to-blue-500/20"></div>

					{/* Blend into left side */}
					<div className="via-background/5 to-background/20 absolute inset-0 bg-gradient-to-l from-transparent"></div>

					{/* Quote overlay */}
					<div className="from-background/60 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"></div>
					<div className="absolute right-6 bottom-6 left-6">
						<blockquote className="text-card-foreground">
							<p className="font-serif text-base leading-relaxed italic">"{quote}"</p>
							<footer className="text-muted-foreground mt-3 text-xs font-medium">— {author}</footer>
						</blockquote>
					</div>
				</div>
			</div>
		</div>
	);
}
