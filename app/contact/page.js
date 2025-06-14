import { generateMetadata } from "@/lib/metadata";
import PageLayout from "@/components/PageLayout";
import Socials from "@/components/Socials";
import { Mail } from "lucide-react";

export const metadata = generateMetadata({
	title: "Contact",
	description: "Get in touch with Yashraj Maher",
});

export default function Contact() {
	return (
		<PageLayout
			pageTitle="Get in Touch"
			pageDescription="I'm open to opportunities, collaborations, and conversations."
			backLink="/"
			backText="Back Home"
		>
			{/* Contact Information */}
			<div className="mx-auto max-w-3xl space-y-8">
				<section className="bg-card border-border rounded-xl border p-6">
					<h2 className="text-foreground mb-4 text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
						Reach Out
					</h2>
					<p className="text-muted-foreground mb-6 text-lg leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
						I&apos;m currently open to new opportunities and collaborations. Whether you have a project in mind, want to
						discuss tech, or just say hi, feel free to reach out!
					</p>
					<div className="mb-8 flex items-center gap-3">
						<Mail className="text-primary h-6 w-6" />
						<span className="text-muted-foreground text-lg" style={{ fontFamily: "var(--font-sans)" }}>
							Drop me a message at{" "}
							<a
								href="mailto:maheryashraj@gmail.com"
								className="text-primary hover:text-primary/70 underline decoration-dashed transition-all hover:decoration-solid"
							>
								maheryashraj@gmail.com
							</a>
						</span>
					</div>

					{/* Socials Component */}
					<div>
						<h2 className="text-foreground mb-4 text-xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
							Find Me On
						</h2>
						<Socials />
					</div>
				</section>
			</div>
		</PageLayout>
	);
}
