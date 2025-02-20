import { Linkedin, Github, Twitter, Instagram } from "lucide-react";

const Socials = () => {
  return (
    <div className="flex gap-4 mt-6">
    <a href="https://github.com/rajofearth" target="_blank" rel="noopener noreferrer"
       className="hover:scale-110 transition-transform">
      <Github className="w-6 h-6" />
    </a>
    <a href="https://your-universe.vercel.app/profile/yashraj.maher" target="_blank" rel="noopener noreferrer"
      className="hover:scale-110 transition-transform">
     <img src="/icons/yu.svg" alt="Your Universe" className="w-6 h-6" />
   </a>
    <a href="https://x.com/yashrajmaher" target="_blank" rel="noopener noreferrer"
       className="hover:scale-110 transition-transform">
      <Twitter className="w-6 h-6" />
    </a>
    <a href="https://linkedin.com/in/yashrajmaher" target="_blank" rel="noopener noreferrer"
       className="hover:scale-110 transition-transform">
      <Linkedin className="w-6 h-6" />
    </a>
    <a href="https://instagram.com/yashraj.maher" target="_blank" rel="noopener noreferrer"
       className="hover:scale-110 transition-transform">
      <Instagram className="w-6 h-6" />
    </a>
  </div>
  );
}

export default Socials;