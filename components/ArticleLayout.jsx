import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import React from "react";

// Custom image component for markdown rendering
const MarkdownImage = ({ src, alt }) => (
	<div className="my-8">
		<img src={src} alt={alt} className="mb-2 aspect-video w-full rounded-lg object-cover" />
		{alt && <figcaption className="text-muted-foreground text-center text-sm">{alt}</figcaption>}
	</div>
);

export default function ArticleLayout({
	title,
	description,
	createdAt,
	author = "Anonymous",
	authorImage = "https://shadcnblocks.com/images/block/avatar-1.webp",
	featuredImage,
	content,
	tags = [],
	website = undefined,
}) {
	return (
		<section className="bg-background min-h-screen pt-8 pb-16">
			<div className="container mx-auto max-w-5xl px-4">
				<div className="relative flex flex-col justify-between gap-10 lg:flex-row">
					{/* Sidebar with post metadata */}
					<aside className="top-10 mx-auto h-fit w-full max-w-[65ch] lg:sticky lg:max-w-96">
						<div className="mb-5 flex items-center justify-between">
							<BackButton />
							<ThemeToggle />
						</div>
						<div className="bg-card mb-6 rounded-xl border p-6">
							{tags && 0 < tags.length && (
								<div className="mb-4 flex flex-wrap items-center gap-2">
									<Badge variant="secondary">Blog</Badge>
									{tags.map((tag, i) => (
										<Badge key={i} variant="secondary">
											{tag}
										</Badge>
									))}
								</div>
							)}

							<h1
								className="text-card-foreground mb-5 text-3xl font-bold text-balance lg:text-4xl"
								style={{ fontFamily: "var(--font-serif)" }}
							>
								{title}
							</h1>

							<div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex gap-3">
									<Avatar className="size-10 rounded-full border">
										<AvatarImage src={authorImage} alt={author} />
									</Avatar>
									<div>
										<h2 className="text-card-foreground font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
											{author}
										</h2>
										<p className="text-muted-foreground text-xs" style={{ fontFamily: "var(--font-sans)" }}>
											{createdAt}
										</p>
									</div>
								</div>

								{website && (
									<a
										href={website.startsWith("http") ? website : `https://${website}`}
										className="bg-secondary hover:bg-border text-secondary-foreground inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs whitespace-nowrap transition-colors"
										target="_blank"
										rel="noopener noreferrer"
									>
										{website.includes("github.com") ? (
											<>
												<span>View Repo</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="12"
													height="12"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
													<path d="M9 18c-4.51 2-5-2-7-2" />
												</svg>
											</>
										) : (
											<>
												<span>View Website</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="12"
													height="12"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
													<polyline points="15 3 21 3 21 9" />
													<line x1="10" x2="21" y1="14" y2="3" />
												</svg>
											</>
										)}
									</a>
								)}
							</div>
						</div>
					</aside>

					{/* Article content */}
					<article className="prose bg-card mx-auto max-w-[65ch] rounded-xl border p-8 shadow-sm">
						{/* Featured image */}
						{featuredImage && (
							<div>
								<img
									src={featuredImage}
									alt={title}
									className="mt-0 mb-8 aspect-video w-full rounded-lg object-cover"
								/>
							</div>
						)}

						{/* Description if available */}
						{description && (
							<p className="lead text-foreground text-xl" style={{ fontFamily: "var(--font-serif)" }}>
								{description}
							</p>
						)}

						{/* Markdown content */}
						<ReactMarkdown
							remarkPlugins={[remarkGfm, remarkBreaks]}
							rehypePlugins={[rehypeRaw]}
							components={{
								a: ({ node: _node, ...props }) => (
									<a {...props} className="text-primary underline transition-colors hover:opacity-80" />
								),
								strong: ({ node: _node, ...props }) => <strong {...props} className="text-foreground font-bold" />,
								li: ({ node: _node, ...props }) => <li {...props} className="text-muted-foreground" />,
								ol: ({ node: _node, ...props }) => (
									<ol {...props} className="text-muted-foreground marker:text-foreground list-decimal" />
								),
								code: ({ node, inline, className, children, ...props }) => {
									const match = /language-(\w+)/.exec(className || "");
									// Always render inline if already marked as inline
									if (inline) {
										return (
											<code
												{...props}
												className="bg-secondary text-secondary-foreground inline rounded-md px-1.5 py-0.5 font-mono text-sm"
											>
												{children}
											</code>
										);
									}

									// Check if this is a simple code without language that should be inline
									const codeStr = String(children).trim();
									const isSingleLineSimpleCode =
										!match && 30 > codeStr.length && !codeStr.includes("\n") && !codeStr.includes("\r");

									// Check if inside a list item or is simple code
									const parentIsLi = "element" === node?.parentNode?.type && "li" === node.parentNode.tagName;

									if (parentIsLi || isSingleLineSimpleCode) {
										return (
											<code
												{...props}
												className="bg-secondary text-secondary-foreground inline rounded-md px-1.5 py-0.5 font-mono text-sm"
											>
												{children}
											</code>
										);
									}

									return (
										<code
											{...props}
											className={`${match ? `language-${match[1]}` : ""} bg-secondary text-secondary-foreground block rounded-md p-4 font-mono text-sm whitespace-pre-wrap`}
										>
											{children}
										</code>
									);
								},
								pre: ({ node: _node, children, ...props }) => (
									<pre {...props} className="bg-secondary text-secondary-foreground rounded-md p-4 whitespace-pre-wrap">
										{children}
									</pre>
								),
								img: MarkdownImage,
								div: ({ node: _node, ...props }) => <div {...props} className="max-w-full" />,
								table: ({ node: _node, ...props }) => (
									<div className="overflow-x-auto">
										<table {...props} className="w-full" />
									</div>
								),
								blockquote: ({ node: _node, children, ...props }) => (
									<blockquote {...props} className="border-border text-foreground border-l-4 pl-4 italic">
										{children}
									</blockquote>
								),
								h1: ({ node: _node, ...props }) => (
									<h1 {...props} className="text-foreground mb-4" style={{ fontFamily: "var(--font-serif)" }} />
								),
								h2: ({ node: _node, ...props }) => (
									<h2 {...props} className="text-foreground mt-8 mb-4" style={{ fontFamily: "var(--font-serif)" }} />
								),
								h3: ({ node: _node, ...props }) => (
									<h3 {...props} className="text-foreground mt-6 mb-3" style={{ fontFamily: "var(--font-serif)" }} />
								),
								h4: ({ node: _node, ...props }) => (
									<h4
										{...props}
										className="text-foreground mt-5 mb-2 font-semibold"
										style={{ fontFamily: "var(--font-serif)" }}
									/>
								),
								p: ({ node: _node, ...props }) => (
									<p {...props} className="text-muted-foreground mb-4" style={{ fontFamily: "var(--font-sans)" }} />
								),
							}}
						>
							{content}
						</ReactMarkdown>
					</article>
				</div>
			</div>
		</section>
	);
}
