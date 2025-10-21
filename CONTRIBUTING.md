# Contributing to PrivateDiningPros

First off, thank you for considering contributing to PrivateDiningPros! 🎉

It's people like you that make PrivateDiningPros such a great tool for discovering NYC's best private dining venues.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to javier@privatediningpros.com.

### Our Standards

**Examples of behavior that contributes to a positive environment:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**

- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js 20+ installed
- npm or yarn package manager
- Git for version control
- A code editor (VS Code recommended)
- Basic knowledge of TypeScript, React, and Next.js

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

```bash
git clone https://github.com/YOUR_USERNAME/privatediningpros.git
cd privatediningpros
```

3. **Add upstream remote:**

```bash
git remote add upstream https://github.com/jjaramillo34/privatediningpros.git
```

4. **Install dependencies:**

```bash
npm install
```

5. **Set up environment:**

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

6. **Run development server:**

```bash
npm run dev
```

---

## 🤝 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs. **actual behavior**
- **Screenshots** if applicable
- **Environment details** (browser, OS, Node version)
- **Error messages** from console

**Example bug report:**

```markdown
**Bug:** Restaurant images not loading on detail page

**To Reproduce:**
1. Go to /restaurant/[id]
2. Scroll to image gallery
3. See broken image icons

**Expected:** Images should display
**Actual:** Broken image placeholders

**Environment:**
- Browser: Chrome 120
- OS: macOS 14
- Node: 20.10.0

**Console Error:**
Failed to load resource: the server responded with a status of 404
```

### Suggesting Features 💡

Feature suggestions are welcome! Before suggesting:

- **Check if it's already suggested** in issues
- **Explain the use case** - why is it useful?
- **Describe the solution** you'd like
- **Consider alternatives** you've thought about

**Example feature request:**

```markdown
**Feature:** Export restaurant list to CSV

**Problem:** Users want to save restaurant data for offline analysis

**Solution:** Add "Export to CSV" button in super-admin dashboard that downloads filtered restaurant list

**Benefits:**
- Offline data analysis
- Easy sharing with team
- Integration with other tools

**Alternatives considered:**
- PDF export (less flexible)
- API endpoint (more complex for users)
```

### Improving Documentation 📝

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add examples or tutorials
- Improve API documentation
- Create guides for common tasks

### Contributing Code 💻

Ready to contribute code? Great! See [Development Workflow](#development-workflow) below.

---

## 🔧 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# For new features
git checkout -b feature/add-restaurant-search

# For bug fixes
git checkout -b fix/broken-image-links

# For documentation
git checkout -b docs/api-endpoints
```

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update tests if applicable
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run the dev server
npm run dev

# Build to check for errors
npm run build

# Run linter
npm run lint

# Test in browser
# Visit http://localhost:3000
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "✨ feat: add restaurant search functionality"
```

See [Commit Messages](#commit-messages) for format guidelines.

### 5. Keep Your Branch Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge main branch
git merge upstream/main

# Resolve conflicts if any
```

### 6. Push to Your Fork

```bash
git push origin feature/add-restaurant-search
```

### 7. Open a Pull Request

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your fork and branch
- Fill out the PR template
- Submit!

---

## 🎨 Style Guidelines

### TypeScript

```typescript
// ✅ Good: Use explicit types
interface Restaurant {
  name: string;
  rating: number;
}

// ❌ Bad: Avoid 'any'
const data: any = fetchData();

// ✅ Good: Use optional chaining
const rating = restaurant?.rating ?? 0;

// ✅ Good: Descriptive variable names
const approvedRestaurants = restaurants.filter(r => r.status === 'approved');
```

### React Components

```typescript
// ✅ Good: Functional components with TypeScript
interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (id: string) => void;
}

export function RestaurantCard({ restaurant, onSelect }: RestaurantCardProps) {
  return (
    <div onClick={() => onSelect(restaurant._id)}>
      {restaurant.name}
    </div>
  );
}

// ✅ Good: Use hooks appropriately
const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

useEffect(() => {
  fetchRestaurants().then(setRestaurants);
}, []);
```

### Naming Conventions

- **Components:** PascalCase (`RestaurantCard.tsx`)
- **Functions:** camelCase (`fetchRestaurants()`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces:** PascalCase with 'I' prefix optional (`Restaurant` or `IRestaurant`)
- **Files:** kebab-case for utilities (`date-utils.ts`)

### File Organization

```typescript
// ✅ Good: Organized imports
// 1. External libraries
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 2. Internal components
import { RestaurantCard } from '@/components/RestaurantCard';

// 3. Utilities and types
import { Restaurant } from '@/lib/restaurant.model';
import { formatDate } from '@/lib/utils';

// 4. Styles (if any)
import styles from './page.module.css';
```

### Tailwind CSS

```typescript
// ✅ Good: Logical grouping, responsive classes
<div className="
  flex items-center justify-between
  p-4 md:p-6
  bg-white border border-gray-200 rounded-lg
  hover:shadow-lg transition-shadow
">

// ❌ Bad: Random order, hard to read
<div className="hover:shadow-lg p-4 flex bg-white rounded-lg md:p-6 border-gray-200 items-center border justify-between transition-shadow">
```

---

## 📝 Commit Messages

Use conventional commits format:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `✨ feat:` New feature
- `🐛 fix:` Bug fix
- `📝 docs:` Documentation only
- `💄 style:` Formatting, missing semicolons, etc.
- `♻️ refactor:` Code change that neither fixes a bug nor adds a feature
- `⚡ perf:` Performance improvement
- `✅ test:` Adding tests
- `🔧 chore:` Maintain

### Examples

```bash
# Feature
✨ feat(map): add clustering for restaurant markers

# Bug fix
🐛 fix(admin): resolve image upload error on Safari

# Documentation
📝 docs: update API endpoint documentation

# Performance
⚡ perf(query): optimize restaurant list query with indexes

# Multiple changes
♻️ refactor(components): restructure restaurant detail page
- Extract RestaurantHero component
- Create RestaurantSidebar
- Add PrivateRoomsDisplay
```

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tested locally
- [ ] Branch is up-to-date with main

### PR Template

When opening a PR, please include:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
[Add screenshots here]

## Testing
Describe how you tested these changes

## Related Issues
Closes #123
Related to #456

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested locally
```

### Review Process

1. **Automated checks** run on your PR
2. **Maintainer reviews** your code
3. **Feedback addressed** if requested
4. **Approval** from at least one maintainer
5. **Merge** into main branch

### After Merge

- Your contribution will be included in the next release
- You'll be added to the contributors list
- Thank you! 🎉

---

## 👥 Community

### Getting Help

- 💬 **GitHub Discussions:** Ask questions
- 🐛 **GitHub Issues:** Report bugs
- 📧 **Email:** javier@privatediningpros.com

### Stay Updated

- ⭐ Star the repository
- 👀 Watch for updates
- 🐦 Follow [@jjaramillo34](https://github.com/jjaramillo34)

---

## 🙏 Recognition

Contributors are recognized in:

- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to PrivateDiningPros! 🍽️✨

---

<div align="center">

**Questions?** Reach out to [javier@privatediningpros.com](mailto:javier@privatediningpros.com)

**Found a security issue?** Please email privately instead of opening a public issue.

</div>

