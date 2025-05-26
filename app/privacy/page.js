import Link from "next/link";
import PageLayout from "../components/PageLayout";
import { design } from "@/lib/design-system";

export default function PrivacyPolicy() {
  return (
    <PageLayout
      pageTitle="Privacy Policy"
      backLink="/"
      backText="Back to Home"
    >
      <div className="bg-[#faf6ec] p-8 rounded-xl border border-[#dbd0b8]">
        <p className="mb-6 text-[#73695d] text-lg" style={{ fontFamily: "var(--font-sans)" }}>
          Welcome to <strong className="text-[#5c5546]">Yashraj Maher</strong>. Your privacy is very important to me. This Privacy Policy explains what information I collect, how it is used, and the measures in place to protect your data when you visit my website.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-[#5c5546] mb-2" style={{ fontFamily: "var(--font-serif)" }}>Information Collection</h2>
            <p className="text-[#73695d]" style={{ fontFamily: "var(--font-sans)" }}>
              I use <strong className="text-[#5c5546]">Vercel Analytics</strong> to collect basic, non-personally identifiable data such as page views and traffic patterns. No personal data (like names, emails, or addresses) is collected through my website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#5c5546] mb-2" style={{ fontFamily: "var(--font-serif)" }}>Use of Information</h2>
            <p className="text-[#73695d]" style={{ fontFamily: "var(--font-sans)" }}>
              The collected data is used solely to analyze website traffic, optimize content, and improve the user experience. It is not used for any other purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#5c5546] mb-2" style={{ fontFamily: "var(--font-serif)" }}>Cookies and Tracking Technologies</h2>
            <p className="text-[#73695d]" style={{ fontFamily: "var(--font-sans)" }}>
              My website may use cookies and similar tracking technologies to enhance your experience and gather analytical data. These help me understand how visitors interact with the site so that I can make improvements. You can manage or disable cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#5c5546] mb-2" style={{ fontFamily: "var(--font-serif)" }}>Third-Party Services</h2>
            <p className="text-[#73695d]" style={{ fontFamily: "var(--font-sans)" }}>
              To support this website, I use third-party services such as <strong className="text-[#5c5546]">Vercel Analytics</strong> for analytics. Vercel Analytics collects data which helps me understand how visitors interact with the site so that I can make improvements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#5c5546] mb-2" style={{ fontFamily: "var(--font-serif)" }}>Data Security</h2>
            <p className="text-[#73695d]" style={{ fontFamily: "var(--font-sans)" }}>
              Even though no personal data is collected, I still take reasonable measures to secure any data gathered against unauthorized access or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#5c5546] mb-2" style={{ fontFamily: "var(--font-serif)" }}>Children's Privacy</h2>
            <p className="text-[#73695d]" style={{ fontFamily: "var(--font-sans)" }}>
              This website is not intended for children under the age of 10. I do not knowingly collect data from children under 10. If you believe that I have inadvertently collected such information, please contact me immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#5c5546] mb-2" style={{ fontFamily: "var(--font-serif)" }}>Changes to This Policy</h2>
            <p className="text-[#73695d]" style={{ fontFamily: "var(--font-sans)" }}>
              I may update this Privacy Policy periodically to reflect changes in data practices or regulatory requirements. Any updates will be posted on this page, and if significant changes are made, I will provide a prominent notice on the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#5c5546] mb-2" style={{ fontFamily: "var(--font-serif)" }}>Contact Me</h2>
            <p className="text-[#73695d]" style={{ fontFamily: "var(--font-sans)" }}>
              If you have any questions or concerns regarding this Privacy Policy, please feel free to{" "}
              <Link href="/contact" className="text-[#7c6e58] hover:text-[#493e35] underline underline-offset-4 decoration-dashed transition-all duration-300 hover:underline-offset-6 hover:decoration-solid">
                contact me
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
