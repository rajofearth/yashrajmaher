# Yashraj Maher's Personal Website

[![Website Status](https://img.shields.io/website?url=https%3A%2F%2Frajofearth.github.io&label=Website&style=flat-square)](https://rajofearth.github.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

Welcome to the repository for my personal website! This site serves as a portfolio showcasing my projects, a blog where I share my thoughts and experiences, and a central point of contact. It's built with a retro-futuristic aesthetic and is designed to be a dynamic and evolving space.

➡️ Live Site: [**https://yashrajmaher.vercel.app**](https://yashrajmaher.vercel.app)

## Table of Contents

*   [About](#about)
*   [Features](#features)
*   [Technologies Used](#technologies-used)
*   [Project Structure](#project-structure)
*   [Getting Started (Local Development)](#getting-started-local-development)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Running Locally](#running-locally)
*   [Content Management via GitHub CMS (Blogs and Projects)](#content-management-via-github-cms-blogs-and-projects)
*   [Authentication](#authentication)
*   [Admin Dashboard](#admin-dashboard)
*   [Scripts](#scripts)
*   [License](#license)
*   [Contact](#contact)

## About

This website is my digital home, where I blend my passion for technology, creativity, and storytelling.  I'm a full-stack developer, a student, and a writer. Here, you'll find:

*   **Projects:** Case studies of my development work, ranging from experimental prototypes to production-ready applications.  I focus on an architectural approach to problem-solving with code.
*   **Blog:** A mix of technical insights, personal narratives, and musings on topics like technology, creativity, and even space exploration.
*   **About Me:** A deeper dive into who I am and what drives me.
*   **Contact:**  Ways to get in touch with me for collaborations, questions, or just to say hello.

## Features

*   **Responsive Design:**  The site is fully responsive and works well on all devices (desktop, tablet, mobile).
*   **Dynamic Content:**  Blog posts and projects are loaded from Markdown files, making it easy to add and update content.
*   **Search Functionality:**  Integrated search for both blog posts and projects.
*   **Syntax Highlighting:**  Code snippets within blog posts and project descriptions are properly highlighted.
*   **Markdown Support:**  Full Markdown support for rich text formatting in blog posts and project details, including images, links, tables, and more.
*   **SEO Optimized:**  Dynamic metadata generation for improved search engine visibility.
*   **Accessibility:**  Built with accessibility in mind, including semantic HTML and ARIA attributes where appropriate.
*   **Analytics:**  Integrated with Vercel Analytics for basic, privacy-respecting website usage tracking.
*   **PWA (Progressive Web App):**  The site is installable as a PWA on supported devices.

## Technologies Used

*   **Next.js 15:**  A React framework for building server-rendered and statically generated web applications.
*   **React:**  A JavaScript library for building user interfaces.
*   **Tailwind CSS:**  A utility-first CSS framework for rapidly building custom designs.
*   **Shadcn/ui:** A collection of re-usable components built on top of Radix UI and Tailwind CSS. (Although, custom components are heavily used instead of Shadcn/ui components.)
*   **Lucide React:**  A library of beautifully designed SVG icons.
*   **gray-matter:**  A library for parsing front matter in Markdown files.
*   **react-markdown:**  A React component for rendering Markdown.
*   **remark-gfm:**  A remark plugin to support GitHub Flavored Markdown (tables, strikethrough, etc.).
*   **remark-breaks:** A remark plugin to convert newlines into `<br>` tags.
*   **rehype-raw:**  A rehype plugin to allow raw HTML within Markdown.
*   **date-fns:**  A modern JavaScript date utility library.
*   **Vercel Analytics:**  For privacy-focused website analytics.
*   **Server-Only:** Used to safeguard server-only code from being exposed on client-side.

## Project Structure

The project follows a standard Next.js directory structure, with some key areas highlighted below:

```
app/
├── (blogs)/           # Blog-related routes and components
│   └── blog/
│       ├── [id]/      # Dynamic route for individual blog posts
│       │   └── page.js
│       └── page.js   # Blog listing page
├── (projects)/        # Project-related routes and components
│   └── projects/
│       ├── [id]/      # Dynamic route for individual project pages
│       │   └── page.js
│       └── page.js   # Project listing page
├── about/              # About page
├── components/         # Reusable React components
├── contact/            # Contact page
├── logo/             # Page dedicated to the logo
├── privacy/           # Privacy policy page
├── utils/              # Utility functions (fetching data, text truncation)
├── globals.css        # Global CSS styles
├── layout.js          # Main layout component
└── page.js            # Home page
lib/
├── metadata.js     # Functions for generating metadata
└── utils.js       # General utility functions
public/
├── Bposts/           # Markdown files for blog posts
├── projects/         # Markdown files for project descriptions
├── manifest.json    # PWA manifest file
└── ...              # Static assets (images, etc.)
.gitignore
eslint.config.mjs    # ESLint configuration
jsconfig.json        # JavaScript configuration (for path aliases)
README.md
LICENSE           # MIT License file
```

*   **`app/`:**  Contains all the routes, components, and logic for the application.  The structure uses Next.js's App Router.
*   **`app/(blogs)/` and `app/(projects)/`:** These directories organize the blog and project sections, using parentheses to group related routes without affecting the URL structure.
*   **`app/components/`:**  Houses reusable UI components like `BlogCard`, `ProjectCard`, `Socials`, `BackButton`, etc.
*   **`app/utils/`:**  Contains helper functions for fetching blog posts and projects, truncating text, and other utilities.
*   **`public/Bposts/` and `public/projects/`:** These directories store the Markdown files that contain the content for blog posts and projects, respectively.
*   **`lib/`:** Contains helper functions related to metadata and overall utility functions used throughout the app.

## Getting Started (Local Development)

### Prerequisites

*   **Node.js:**  Version 18 or later.
*   **npm:**  (or yarn, or pnpm) - Node.js package manager.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/rajofearth/yashrajmaher.git
    cd yashrajmaher
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # OR
    yarn install
    # OR
    pnpm install
    ```

### Running Locally

1.  **Start the development server:**

    ```bash
    npm run dev
    # OR
    yarn dev
    # OR
    pnpm dev
    ```

2.  **Open your browser:**  The application will be running at `http://localhost:3000`.

## Content Management via GitHub CMS (Blogs and Projects)

*   **Adding a Blog Post:**
    1.  Create a new Markdown file (`.md`) in the `public/Bposts/` directory.  The filename will become the slug for the blog post (e.g., `my-new-post.md` will be accessible at `/blog/my-new-post`).
    2.  Add front matter to the Markdown file:

        ```markdown
        ---
        title: "My Awesome Blog Post"
        date: 2024-02-09
        description: "A short description of the blog post."
        ---

        The content of your blog post goes here.  You can use Markdown syntax.
        ```

*   **Adding a Project:**
    1.  Create a new Markdown file (`.md`) in the `public/projects/` directory. The filename will be the project's slug.
    2.  Add front matter to the Markdown file:

        ```markdown
        ---
        title: "My Amazing Project"
        date: 2024-02-09
        description: "A brief description of the project."
        ---

        Detailed project description and content goes here.
        ```

*   **Important**: Ensure that your dates are in a format Javascript can parse.

## Authentication

We secure the `/admin` area using Clerk. Clerk handles sign-in, session management, and sign-out. Only the user matching the `ADMIN_USER_ID` environment variable can access the admin dashboard.

## Admin Dashboard

The admin interface is available at `/admin` and lets you manage your blog posts and projects directly through your GitHub repository:
* **List & Search:** View, filter, and search all existing blog and project entries.
* **Inline Editing:** Edit content in the browser using an inline markdown editor.
* **Create & Delete:** Add new posts/projects or remove existing ones.
* **GitHub as CMS:** Uses Octokit under the hood to read, create, update, and delete Markdown files in `public/Bposts` and `public/projects`, committing changes directly to your GitHub repo.

## License

This project uses a dual-licensing approach to clearly distinguish between the website's *code* and its *content*:

1.  **Code:** The source code of this website (specifically *excluding* the content as defined below) is licensed under the MIT License. A copy of the MIT License is provided in the [LICENSE](LICENSE) file. This generally includes all files *except* those located within:

    *   `public/Bposts/`
    *   `public/projects/`
    *   Most of the image files in `public/` (see exceptions below).
    *   Parts of `public/manifest.json`

2.  **Content:** All original content belongs to Yashraj Maher. All Rights Reserved. Unauthorized use, reproduction, modification, or distribution of this content is strictly prohibited. This *includes*, but is *not limited to*:

    *   **Blog posts:** All text and images within the `public/Bposts/` directory.
    *   **Project descriptions:** All text and images within the `public/projects/` directory.
    *   **Textual content on all pages:** This includes, but is not limited to, the text on the "About" page, "Contact" page, home page, and Privacy Policy page.
    *   **Images:** Most images within the `public/` directory. *Exceptions* to this are icons sourced from external libraries (such as Lucide React), which are governed by *their own* licenses. You are responsible for respecting the licenses of any third-party assets.
    *   **`public/manifest.json`:** The `name`, `short_name`, and `description` fields within `public/manifest.json` are considered part of the website's content. Standard PWA properties like `display`, `background_color`, `theme_color`, and the `icons` array (referencing image *paths*, not the images themselves if they are custom) can be reused under the MIT License.

**Summary:** You *are* permitted to fork this repository, modify the code, and deploy your own website *using the MIT-licensed code*, provided you:

*   **Replace all of the content** (as defined above) with your own original content. Do not reuse any of the blog posts, project descriptions, page text, or custom images.
*   **Include the MIT License** (LICENSE file) in your forked repository.
*   **Respect the licenses of third-party libraries.** This includes Lucide React and any other dependencies.
*   **Maintain the copyright notice** for the original content (if any small snippets are inadvertently kept). Ideally, include a link back to the original repository ([https://github.com/rajofearth/yashrajmaher](https://github.com/rajofearth/yashrajmaher)) in your README to acknowledge the origin of the code.

## Contact

I'm always open to connecting and collaborating! You can reach me through:

*   **GitHub:** [https://github.com/rajofearth](https://github.com/rajofearth)
*   **X (Twitter):** [https://x.com/yashrajmaher](https://x.com/yashrajmaher)
*  **Your Universe(YU):**[https://your-universe.vercel.app/profile/yashraj.maher](https://your-universe.vercel.app/profile/yashraj.maher)
*   **LinkedIn:** [https://linkedin.com/in/yashrajmaher](https://linkedin.com/in/yashrajmaher)
*   **Instagram:** [https://instagram.com/yashraj.maher](https://instagram.com/yashraj.maher)
*   **Email:** [maheryashraj@gmail.com](mailto:maheryashraj@gmail.com)
*  **Website Contact Page**: [https://yashrajmaher.vercel.app/contact](https://yashrajmaher.vercel.app/contact)