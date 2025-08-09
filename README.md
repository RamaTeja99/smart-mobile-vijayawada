# Welcome to your smart mobile project

## Project info

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

Core Technologies
React 18.3.1
Purpose: Frontend JavaScript library for building user interfaces
Role: Creates interactive components like product cards, forms, navigation
Key Features: Component-based architecture, virtual DOM, hooks for state management
In this project: All pages (Home, Products, Contact, About) are React components
TypeScript
Purpose: Adds static type checking to JavaScript
Benefits: Catches errors at compile time, better IDE support, improved code documentation
In this project: All .tsx and .ts files use TypeScript for type safety
Vite
Purpose: Modern build tool and development server
Advantages: Lightning-fast hot module replacement, optimized builds, ES module support
Configuration: Uses React SWC plugin for faster compilation
Styling & UI Framework
Tailwind CSS
Purpose: Utility-first CSS framework
Implementation: Custom design system with semantic tokens in index.css
Features: Responsive design, dark/light mode support, consistent spacing
Custom Configuration: Extended color palette and animations in tailwind.config.ts
shadcn/ui Components
Purpose: High-quality, accessible UI components built on Radix UI
Components Used: Button, Card, Input, Dialog, Toast, Navigation, etc.
Benefits: Consistent design, accessibility features, customizable variants
Integration: Components are styled with Tailwind and follow the design system
Routing & Navigation
React Router DOM 6.30.1
Purpose: Client-side routing for single-page application
Implementation: Handles navigation between Home, Products, About, Contact pages
Features: Dynamic routes, nested routing, programmatic navigation
Icons & Visual Elements
Lucide React
Purpose: Beautiful, customizable SVG icons
Usage: Menu icons, social media icons (Instagram, YouTube), UI indicators
Benefits: Tree-shakable, consistent design, extensive icon library
State Management & Forms
React Hook Form 7.61.1
Purpose: Performant forms with easy validation
Benefits: Minimal re-renders, built-in validation, TypeScript support
Used in: Contact form for user inquiries
React Query (@tanstack/react-query)
Purpose: Data fetching and caching library
Benefits: Automatic caching, background updates, error handling
Potential Use: API calls for product data, user management
UI Enhancement Libraries
Class Variance Authority (CVA)
Purpose: Creates consistent component variants
Usage: Button variants, card styles, responsive design patterns
Tailwind Merge & CLSX
Purpose: Conditional styling and class merging
Benefits: Prevents Tailwind class conflicts, dynamic styling
Sonner (Toast Notifications)
Purpose: Beautiful toast notifications
Usage: User feedback for form submissions, error messages
Date & Time
Date-fns
Purpose: Modern JavaScript date utility library
Benefits: Modular, immutable, TypeScript support
Usage: Date formatting, calculations for orders/reviews
Development Tools
ESLint
Purpose: Code linting and style enforcement
Benefits: Consistent code quality, catches common errors
PostCSS
Purpose: CSS processing tool
Integration: Works with Tailwind CSS for optimized stylesheets
Project Architecture
src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   └── layout/        # Layout components (Header, Footer)
├── pages/             # Route components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
└── assets/            # Static files (images, etc.)
Key Features Enabled by This Stack
Type Safety: TypeScript prevents runtime errors
Performance: Vite's fast development server and optimized builds
Responsive Design: Tailwind's mobile-first approach
Accessibility: shadcn/ui components follow WCAG guidelines
Developer Experience: Hot reload, TypeScript IntelliSense, ESLint
Modern React Patterns: Hooks, functional components, context
Scalable Architecture: Component-based structure for easy maintenance
This technology stack provides a robust foundation for building modern, responsive, and maintainable web applications with excellent developer experience and user performance.