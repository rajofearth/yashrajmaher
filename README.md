# 🚀 Yashraj Maher's Personal Website & Portfolio

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fyashrajmaher.vercel.app&style=for-the-badge&logo=vercel)](https://yashrajmaher.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> A modern, responsive personal website and portfolio showcasing projects, thoughts, and experiences through an elegant interface built with cutting-edge web technologies.

## 🌟 Live Demo

**[Visit the Website →](https://yashrajmaher.vercel.app)**

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🎨 Customization](#-customization)
- [📝 Content Management](#-content-management)
- [🔐 Authentication & Admin](#-authentication--admin)
- [🌐 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Contact](#-contact)

## ✨ Features

### 🎯 Core Features
- **📱 Fully Responsive Design** - Optimized for all devices and screen sizes
- **🌙 Dark/Light Theme Toggle** - Seamless theme switching with system preference detection
- **⚡ Lightning Fast** - Built with Next.js 15 for optimal performance
- **🔍 Search Functionality** - Advanced search across blog posts and projects
- **📊 Analytics Integration** - Privacy-focused analytics with Vercel Analytics
- **♿ Accessibility First** - WCAG compliant with semantic HTML and ARIA attributes

### 📝 Content Management
- **📰 Dynamic Blog System** - Markdown-powered blog with syntax highlighting
- **💼 Project Showcase** - Detailed project case studies and documentation
- **🎛️ Admin Dashboard** - GitHub-integrated CMS for content management
- **📄 Markdown Support** - Full GitHub Flavored Markdown with tables, code blocks, and more
- **🏷️ Tag System** - Organize and filter content by categories and tags

### 🔧 Technical Features
- **📱 Progressive Web App (PWA)** - Installable on mobile and desktop
- **🎨 Modern UI Components** - Built with Radix UI and Tailwind CSS
- **🚀 SEO Optimized** - Dynamic metadata generation and OpenGraph support
- **⚡ Performance Optimized** - Image optimization, code splitting, and caching
- **🔒 Secure Authentication** - Clerk-powered authentication for admin access

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4.1](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Rich Text Editor**: [Tiptap](https://tiptap.dev/)

### Backend & Content
- **Content Management**: GitHub as CMS with Markdown files
- **Authentication**: [Clerk](https://clerk.com/)
- **File Processing**: [Gray Matter](https://github.com/jonschlinkert/gray-matter)
- **Markdown Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown)
- **Syntax Highlighting**: [Prism.js](https://prismjs.com/)

### DevOps & Deployment
- **Hosting**: [Vercel](https://vercel.com/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Package Manager**: [Bun](https://bun.sh/)
- **Version Control**: Git & GitHub

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0 or later
- **Bun** (recommended) or npm/yarn/pnpm
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajofearth/yashrajmaher.git
   cd yashrajmaher
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in the required environment variables:
   ```env
   # Required for admin functionality
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ADMIN_USER_ID=your_clerk_user_id
   
   # Required for GitHub CMS
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=your_repository_name
   ```

4. **Run the development server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
yashrajmaher/
├── 📁 app/                     # Next.js app directory
│   ├── 📁 (blogs)/            # Blog-related routes
│   │   └── blog/              # Blog listing and detail pages
│   ├── 📁 (projects)/         # Project-related routes  
│   │   └── devposts/          # Project listing and detail pages
│   ├── 📁 about/              # About page
│   ├── 📁 admin/              # Admin dashboard
│   ├── 📁 api/                # API routes
│   ├── 📁 components/         # Reusable React components
│   ├── 📁 contact/            # Contact page
│   ├── 📁 utils/              # Utility functions
│   ├── 📄 globals.css         # Global styles
│   ├── 📄 layout.js           # Root layout
│   └── 📄 page.js             # Homepage
├── 📁 components/             # UI components (shadcn/ui)
│   └── ui/                    # Base UI components
├── 📁 lib/                    # Shared utilities and configurations
├── 📁 public/                 # Static assets
│   ├── 📁 Bposts/            # Blog posts (Markdown)
│   ├── 📁 devposts/          # Project posts (Markdown)
│   ├── 📁 images/            # Image assets
│   └── 📁 icons/             # Icon assets
├── 📄 package.json           # Project dependencies
├── 📄 tailwind.config.mjs    # Tailwind configuration
├── 📄 next.config.mjs        # Next.js configuration
└── 📄 README.md              # Project documentation
```

## 🎨 Customization

### Themes
The website supports both light and dark themes with automatic system preference detection. Customize theme colors in:
- `app/globals.css` - CSS custom properties
- `tailwind.config.mjs` - Tailwind color palette

### Content
- **Blog Posts**: Add Markdown files to `public/Bposts/`
- **Projects**: Add Markdown files to `public/devposts/`
- **Images**: Store in `public/images/`
- **Personal Info**: Update content in respective page components

### UI Components
Built with shadcn/ui for easy customization:
```bash
# Add new components
npx shadcn-ui@latest add [component-name]
```

## 📝 Content Management

### Adding Blog Posts
1. Create a new `.md` file in `public/Bposts/`
2. Add frontmatter:
   ```markdown
   ---
   title: "Your Blog Post Title"
   date: 2024-01-01
   description: "Brief description of your post"
   tags: ["technology", "web-development"]
   ---
   
   Your blog content here...
   ```

### Adding Projects
1. Create a new `.md` file in `public/devposts/`
2. Add frontmatter:
   ```markdown
   ---
   title: "Your Project Title"
   date: 2024-01-01
   description: "Project description"
   tags: ["react", "nextjs", "typescript"]
   ---
   
   Detailed project description...
   ```

### Admin Dashboard
Access the admin panel at `/admin` to:
- ✏️ Edit posts inline with rich text editor
- ➕ Create new blog posts and projects
- 🗑️ Delete existing content
- 🔍 Search and filter content
- 💾 Auto-commit changes to GitHub

## 🔐 Authentication & Admin

The website uses Clerk for authentication. Only users with the `ADMIN_USER_ID` can access the admin dashboard.

### Setup Clerk
1. Create a [Clerk](https://clerk.com/) account
2. Create a new application
3. Copy your keys to `.env.local`
4. Add your user ID as `ADMIN_USER_ID`

## 🌐 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com/)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
The project can be deployed to any platform supporting Next.js:
- **Netlify**: Use `next export` for static export
- **Railway**: Full-stack deployment
- **Cloudflare Pages**: Edge deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTORS.md) for details.

### Quick Contribution Steps
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project uses a dual-license approach:

- **Code**: MIT License - Feel free to use the codebase for your projects
- **Content**: All Rights Reserved - Blog posts, projects, and personal content belong to Yashraj Maher

See [LICENSE](LICENSE) for the full MIT license text.

## 📞 Contact

**Yashraj Maher**

- 🌐 **Website**: [yashrajmaher.vercel.app](https://yashrajmaher.vercel.app)
- 📧 **Email**: [maheryashraj@gmail.com](mailto:maheryashraj@gmail.com)
- 🐙 **GitHub**: [@rajofearth](https://github.com/rajofearth)
- 🐦 **Twitter**: [@yashrajmaher](https://x.com/yashrajmaher)
- 💼 **LinkedIn**: [@yashrajmaher](https://linkedin.com/in/yashrajmaher)
- 📷 **Instagram**: [@yashraj.maher](https://instagram.com/yashraj.maher)

---

<div align="center">
  <p>
    Made with ❤️ by <a href="https://github.com/rajofearth">Yashraj Maher</a>
  </p>
  <p>
    <a href="https://yashrajmaher.vercel.app">Visit Website</a> •
    <a href="https://github.com/rajofearth/yashrajmaher/issues">Report Bug</a> •
    <a href="https://github.com/rajofearth/yashrajmaher/issues">Request Feature</a>
  </p>
</div>