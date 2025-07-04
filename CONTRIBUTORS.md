# 🤝 Contributing to Yashraj Maher's Personal Website

Thank you for your interest in contributing to this project! This guide will help you get started with contributing to the codebase, whether you're fixing bugs, adding features, or improving documentation.

## 📋 Table of Contents

- [🎯 How to Contribute](#-how-to-contribute)
- [🛠️ Development Setup](#️-development-setup)
- [📝 Coding Standards](#-coding-standards)
- [🔄 Pull Request Process](#-pull-request-process)
- [🐛 Bug Reports](#-bug-reports)
- [💡 Feature Requests](#-feature-requests)
- [🚀 Project Roadmap](#-project-roadmap)
- [🔧 Known Issues & Improvements](#-known-issues--improvements)
- [❓ FAQ](#-faq)
- [📞 Getting Help](#-getting-help)

## 🎯 How to Contribute

There are many ways to contribute to this project:

- 🐛 **Bug Fixes**: Help identify and fix bugs
- ✨ **Feature Development**: Add new features or enhance existing ones
- 📚 **Documentation**: Improve README, comments, or add tutorials
- 🎨 **UI/UX Improvements**: Enhance design and user experience
- ⚡ **Performance Optimization**: Improve site speed and efficiency
- ♿ **Accessibility**: Make the site more accessible to all users
- 🧪 **Testing**: Add tests or improve test coverage

## 🛠️ Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (18.0 or later) - [Download here](https://nodejs.org/)
- **Bun** (recommended) - [Install here](https://bun.sh/docs/installation)
  ```bash
  # Install Bun
  curl -fsSL https://bun.sh/install | bash
  ```
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - [VS Code](https://code.visualstudio.com/) recommended

### Local Development Setup

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/yashrajmaher.git
   cd yashrajmaher
   ```

2. **Add Original Repository as Upstream**
   ```bash
   git remote add upstream https://github.com/rajofearth/yashrajmaher.git
   ```

3. **Install Dependencies**
   ```bash
   bun install
   # or if using npm
   npm install
   ```

4. **Environment Setup**
   ```bash
   # Copy environment example
   cp env.example .env.local
   ```
   
   **Required Environment Variables:**
   ```env
   # Clerk Authentication (for admin features)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   ADMIN_USER_ID=user_your_id_here
   
   # GitHub Integration (for CMS features)
   GITHUB_TOKEN=ghp_your_token_here
   GITHUB_OWNER=your_username
   GITHUB_REPO=yashrajmaher
   ```

5. **Start Development Server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

6. **Verify Setup**
   - Open [http://localhost:3000](http://localhost:3000)
   - Check that the site loads correctly
   - Test theme toggle functionality
   - Navigate through different pages

### Development Scripts

```bash
# Start development server
bun dev

# Build for production
bun run build

# Start production server
bun start

# Run linting
bun run lint

# Type checking (if using TypeScript)
bun run type-check
```

## 📝 Coding Standards

### Code Style

- **Prettier**: Automatic code formatting (configured in `.prettierrc`)
- **ESLint**: Code linting (configured in `eslint.config.mjs`)
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `BlogCard.jsx`)
  - Files: `camelCase` or `kebab-case`
  - Variables/Functions: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`

### File Organization

```
app/
├── components/          # Reusable UI components
│   ├── BlogCard.jsx    # Feature-specific components
│   ├── Socials.jsx     # Utility components
│   └── ui/             # Base UI components (shadcn/ui)
├── utils/              # Helper functions
├── (routes)/           # Route groups (Next.js 13+ app router)
└── api/                # API routes
```

### Component Guidelines

- **Functional Components**: Use function declarations
- **Props Validation**: Use TypeScript or PropTypes
- **Accessibility**: Include proper ARIA attributes
- **Responsive Design**: Mobile-first approach

Example component structure:
```jsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Button = forwardRef(({ className, variant = 'default', ...props }, ref) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';
export default Button;
```

### Git Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

**Commit Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(blog): add search functionality to blog posts
fix(admin): resolve authentication redirect issue
docs(readme): update installation instructions
style(components): fix button hover states
refactor(utils): optimize markdown parsing function
```

## 🔄 Pull Request Process

### Before Submitting

1. **Sync with Upstream**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Changes**
   - Write clean, documented code
   - Follow coding standards
   - Test your changes thoroughly

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): your descriptive commit message"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Pull Request Checklist

- [ ] **Code Quality**
  - [ ] Code follows project style guidelines
  - [ ] No console.log statements in production code
  - [ ] Functions are properly documented
  - [ ] Variable names are descriptive

- [ ] **Testing**
  - [ ] Existing tests pass
  - [ ] New features include appropriate tests
  - [ ] Manual testing completed

- [ ] **Documentation**
  - [ ] README updated if needed
  - [ ] Code comments added for complex logic
  - [ ] Breaking changes documented

- [ ] **Performance**
  - [ ] No unnecessary re-renders
  - [ ] Images optimized
  - [ ] Bundle size impact considered

### PR Description Template

```markdown
## 📝 Description
Brief description of what this PR does.

## 🔧 Changes Made
- List of specific changes
- Include any breaking changes
- Mention new dependencies

## 🧪 Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Tested on mobile devices
- [ ] Tested with screen reader

## 📷 Screenshots (if applicable)
Include before/after screenshots for UI changes.

## ⚠️ Breaking Changes
List any breaking changes and migration steps.
```

## 🐛 Bug Reports

When reporting bugs, please include:

### Bug Report Template

```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
Add screenshots to help explain the problem.

**Environment**
- OS: [e.g. iOS, Windows, Ubuntu]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
- Device: [e.g. iPhone6, Desktop]

**Additional Context**
Any other context about the problem.
```

### Priority Levels

- 🔴 **Critical**: Site is broken or unusable
- 🟠 **High**: Major feature broken
- 🟡 **Medium**: Minor feature issue
- 🟢 **Low**: Cosmetic or enhancement

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature you'd like to see.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How would you like this feature to work?

**Alternatives Considered**
Other solutions you've considered.

**Implementation Ideas**
Any technical implementation suggestions.

**Examples**
Links to similar implementations or mockups.
```

## 🚀 Project Roadmap

### 🎯 High Priority Features

1. **Enhanced Search & Filtering**
   - [ ] Advanced search with filters
   - [ ] Search suggestions/autocomplete
   - [ ] Full-text search in content
   - [ ] Tag-based filtering

2. **Performance Optimizations**
   - [ ] Image optimization and lazy loading
   - [ ] Code splitting improvements
   - [ ] SEO enhancements
   - [ ] Core Web Vitals optimization

3. **Content Management Improvements**
   - [ ] Rich text editor enhancements
   - [ ] Image upload functionality
   - [ ] Draft/publish workflow
   - [ ] Content scheduling

### 🔮 Medium Priority Features

4. **Analytics & Insights**
   - [ ] Reading time estimates
   - [ ] View counter for posts
   - [ ] Popular content widgets
   - [ ] Reader engagement metrics

5. **Social Features**
   - [ ] Comments system integration
   - [ ] Social sharing improvements
   - [ ] Newsletter subscription
   - [ ] RSS feed optimization

6. **Accessibility & UX**
   - [ ] Keyboard navigation improvements
   - [ ] Screen reader optimizations
   - [ ] Voice search capability
   - [ ] Print-friendly layouts

### 🌟 Nice-to-Have Features

7. **Advanced Functionality**
   - [ ] Multi-language support (i18n)
   - [ ] Related posts recommendations
   - [ ] Reading progress indicator
   - [ ] Bookmark/favorites system

8. **Developer Experience**
   - [ ] TypeScript migration
   - [ ] Automated testing suite
   - [ ] Storybook integration
   - [ ] Performance monitoring

9. **Content Enhancement**
   - [ ] Video embedding improvements
   - [ ] Interactive code blocks
   - [ ] Table of contents generation
   - [ ] Math equation support

## 🔧 Known Issues & Improvements

### 🐛 Current Known Issues

1. **Performance Issues**
   - [ ] Large images not optimized on mobile
   - [ ] Bundle size could be reduced
   - [ ] Initial page load could be faster

2. **UI/UX Issues**
   - [ ] Theme toggle animation could be smoother
   - [ ] Mobile navigation could be improved
   - [ ] Loading states need enhancement

3. **Accessibility Issues**
   - [ ] Some interactive elements lack focus indicators
   - [ ] Alt text missing on some images
   - [ ] Contrast ratios could be improved in dark mode

4. **SEO & Meta Issues**
   - [ ] Open Graph images not always generated
   - [ ] Structured data could be enhanced
   - [ ] Sitemap generation needs improvement

### 🔧 Technical Debt

1. **Code Organization**
   - [ ] Some components are too large and should be split
   - [ ] Utility functions need better organization
   - [ ] Type definitions need improvement

2. **Testing**
   - [ ] Unit tests coverage is low
   - [ ] Integration tests needed
   - [ ] E2E tests should be added

3. **Documentation**
   - [ ] Component documentation needs improvement
   - [ ] API documentation is missing
   - [ ] Setup guide could be more detailed

### 🎨 Design Improvements

1. **Visual Enhancements**
   - [ ] Better loading animations
   - [ ] More polished micro-interactions
   - [ ] Improved error state designs
   - [ ] Better empty state illustrations

2. **Layout Improvements**
   - [ ] Better spacing consistency
   - [ ] Improved typography hierarchy
   - [ ] Better responsive breakpoints
   - [ ] Grid system optimization

## ❓ FAQ

### General Questions

**Q: Can I use this codebase for my own website?**
A: Yes! The code is MIT licensed. However, please replace all personal content (blog posts, projects, images) with your own.

**Q: How do I add new blog posts?**
A: Create a new `.md` file in `public/Bposts/` with proper frontmatter, or use the admin dashboard at `/admin`.

**Q: How do I customize the theme colors?**
A: Edit the CSS custom properties in `app/globals.css` and update the Tailwind config.

### Technical Questions

**Q: Why is Bun used instead of npm?**
A: Bun is faster for installation and execution. However, the project works fine with npm/yarn/pnpm.

**Q: Can I deploy this to platforms other than Vercel?**
A: Yes! The project can be deployed to any platform supporting Next.js.

**Q: How do I set up the admin features?**
A: You need to configure Clerk authentication and GitHub API tokens. See the setup guide above.

### Development Questions

**Q: How do I run the project locally without Clerk?**
A: The site works without Clerk, but admin features won't be available. Just skip the Clerk environment variables.

**Q: Can I contribute without understanding the entire codebase?**
A: Absolutely! Start with small issues or documentation improvements to get familiar with the project.

## 📞 Getting Help

### Community Support

- **GitHub Issues**: [Create an issue](https://github.com/rajofearth/yashrajmaher/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rajofearth/yashrajmaher/discussions)
- **Email**: [maheryashraj@gmail.com](mailto:maheryashraj@gmail.com)

### Before Asking for Help

1. Check existing issues and discussions
2. Review this contributing guide
3. Look through the README
4. Try debugging with browser dev tools
5. Search for similar problems online

### When Asking for Help

Include:
- Clear description of the problem
- Steps you've already tried
- Your environment details
- Relevant code snippets or screenshots
- Error messages (full stack trace)

---

## 🙏 Thank You

Thank you for considering contributing to this project! Every contribution, no matter how small, makes a difference. Whether you're fixing a typo, adding a feature, or improving documentation, your help is greatly appreciated.

### Recognition

Contributors are recognized in:
- GitHub contributors list
- Project README (for significant contributions)
- Release notes
- Special mentions in blog posts

---

<div align="center">
  <p>
    Happy Contributing! 🚀
  </p>
  <p>
    <a href="https://github.com/rajofearth/yashrajmaher">⭐ Star the project</a> •
    <a href="https://github.com/rajofearth/yashrajmaher/issues">🐛 Report issues</a> •
    <a href="https://github.com/rajofearth/yashrajmaher/discussions">💬 Join discussions</a>
  </p>
</div>