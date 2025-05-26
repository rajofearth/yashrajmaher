import Socials from "../components/Socials";
import { Mail } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { generateMetadata } from "../../lib/metadata";
import { design } from "@/lib/design-system";

export const metadata = generateMetadata({
  title: "Contact",
  description: "Get in touch with Yashraj Maher"
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
      <div className="max-w-3xl mx-auto space-y-8">
        <section className="bg-[#faf6ec] p-6 rounded-xl border border-[#dbd0b8]">
          <h2 className="text-2xl font-semibold mb-4 text-[#5c5546]" style={{ fontFamily: "var(--font-serif)" }}>Reach Out</h2>
          <p className="text-lg leading-relaxed text-[#73695d] mb-6" style={{ fontFamily: "var(--font-sans)" }}>
            I'm currently open to new opportunities and collaborations. Whether
            you have a project in mind, want to discuss tech, or just say hi,
            feel free to reach out!
          </p>
          <div className="flex items-center gap-3 mb-8">
            <Mail className="w-6 h-6 text-[#7c6e58]" />
            <span className="text-lg text-[#73695d]" style={{ fontFamily: "var(--font-sans)" }}>
              Drop me a message at{" "}
              <a
                href="mailto:maheryashraj@gmail.com"
                className="text-[#7c6e58] hover:text-[#493e35] underline decoration-dashed hover:decoration-solid transition-all"
              >
                maheryashraj@gmail.com
              </a>
            </span>
          </div>

          {/* Socials Component */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#5c5546]" style={{ fontFamily: "var(--font-serif)" }}>Find Me On</h2>
            <Socials />
          </div>
        </section>
      </div>
    </PageLayout>
  );
}