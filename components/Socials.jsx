import { Linkedin, Github, Twitter, Instagram } from "lucide-react";

const Socials = ({ className = "" }) => {
	// Common classes for social icons
	const iconClasses = "w-6 h-6 text-[#7c6e58] hover:text-[#493e35] transition-colors";
	const linkClasses = "p-2 rounded-full hover:bg-[#e6dcc1] transition-all duration-200";

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<a
				href="https://github.com/rajofearth"
				target="_blank"
				rel="noopener noreferrer"
				className={linkClasses}
				aria-label="GitHub Profile"
			>
				<Github className={iconClasses} />
			</a>
			<a
				href="https://your-universe.vercel.app/profile/yashraj.maher"
				target="_blank"
				rel="noopener noreferrer"
				className={linkClasses}
				aria-label="Your Universe Profile"
			>
				<img src="/icons/yu.svg" alt="" className="h-6 w-6 opacity-80 transition-opacity hover:opacity-100" />
			</a>
			<a
				href="https://x.com/yashrajmaher"
				target="_blank"
				rel="noopener noreferrer"
				className={linkClasses}
				aria-label="X/Twitter Profile"
			>
				<Twitter className={iconClasses} />
			</a>
			<a
				href="https://linkedin.com/in/yashrajmaher"
				target="_blank"
				rel="noopener noreferrer"
				className={linkClasses}
				aria-label="LinkedIn Profile"
			>
				<Linkedin className={iconClasses} />
			</a>
			<a
				href="https://instagram.com/yashraj.maher"
				target="_blank"
				rel="noopener noreferrer"
				className={linkClasses}
				aria-label="Instagram Profile"
			>
				<Instagram className={iconClasses} />
			</a>
		</div>
	);
};

export default Socials;
