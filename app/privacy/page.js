import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
        </div>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <p className="mb-6 text-gray-700 text-lg">
            Welcome to <strong>Yashraj Maher</strong>. Your privacy is very important to me. This Privacy Policy explains what information I collect, how it is used, and the measures in place to protect your data when you visit my website.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Information Collection</h2>
              <p className="text-gray-700">
                I use <strong>Vercel Analytics</strong> to collect basic, non-personally identifiable data such as page views and traffic patterns. No personal data (like names, emails, or addresses) is collected through my website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Use of Information</h2>
              <p className="text-gray-700">
                The collected data is used solely to analyze website traffic, optimize content, and improve the user experience. It is not used for any other purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Cookies and Tracking Technologies</h2>
              <p className="text-gray-700">
                My website may use cookies and similar tracking technologies to enhance your experience and gather analytical data. These help me understand how visitors interact with the site so that I can make improvements. You can manage or disable cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Third-Party Services</h2>
              <p className="text-gray-700">
                To support this website, I use third-party services such as <strong>Vercel Analytics</strong> for analytics. Vercel Analytics collects data which helps me understand how visitors interact with the site so that I can make improvements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Data Security</h2>
              <p className="text-gray-700">
                Even though no personal data is collected, I still take reasonable measures to secure any data gathered against unauthorized access or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Children's Privacy</h2>
              <p className="text-gray-700">
                This website is not intended for children under the age of 10. I do not knowingly collect data from children under 10. If you believe that I have inadvertently collected such information, please contact me immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Changes to This Policy</h2>
              <p className="text-gray-700">
                I may update this Privacy Policy periodically to reflect changes in data practices or regulatory requirements. Any updates will be posted on this page, and if significant changes are made, I will provide a prominent notice on the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Contact Me</h2>
              <p className="text-gray-700">
                If you have any questions or concerns regarding this Privacy Policy, please feel free to{" "}
                <Link href="/contact" className="text-gray-800 underline underline-offset-4 decoration-dashed transition-all duration-300 hover:text-blue-600 hover:underline-offset-6 hover:decoration-solid"
                >
                  contact me
                </Link>.
              </p>
            </section>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-all duration-150"
        > ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
