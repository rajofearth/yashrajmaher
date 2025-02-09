import Socials from "../components/Socials";
import { Mail } from "lucide-react";
import BackButton from "../components/BackButton";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Back Button (Client Component) */}
      <BackButton />

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center">
          Get in Touch
        </h1>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 space-y-16">
        {/* Contact Information */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold">Reach Out</h2>
          <p className="text-lg leading-relaxed">
            I'm currently open to new opportunities and collaborations. Whether
            you have a project in mind, want to discuss tech, or just say hi,
            feel free to reach out!
          </p>
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-blue-600" />
            <span className="text-lg text-gray-700">
              Drop me a message at
              <a
                href="mailto:maheryashraj@gmail.com"
                className="text-blue-600 hover:underline"
              >
                maheryashraj@gmail.com
              </a>
            </span>
          </div>

          {/* Socials Component */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Find Me On</h2>
            <Socials />
          </div>
        </section>
      </main>
    </div>
  );
}