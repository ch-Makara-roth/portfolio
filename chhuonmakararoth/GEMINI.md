# GEMINI.md

## Project Overview

This is a personal portfolio website for Chhuon Makara Roth, built with Next.js 14 and TypeScript. The project is heavily focused on SEO and performance, utilizing server-side rendering, comprehensive metadata, and various optimization techniques. It features a modern design with a clean and responsive layout, showcasing projects, blog posts, and contact information.

**Key Technologies:**

*   **Framework:** Next.js 14 (with App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **Data Fetching:** React Query
*   **Form Handling:** React Hook Form with Zod validation

**Architecture:**

The project follows a standard Next.js project structure, with the `app` directory for pages and API routes, `components` for reusable UI elements, `lib` for utility functions and metadata, and `public` for static assets. The architecture is designed for scalability and maintainability, with a strong emphasis on SEO best practices.

## Building and Running

**1. Install Dependencies:**

```bash
npm install
```

**2. Run the Development Server:**

```bash
npm run dev
```

**3. Build for Production:**

```bash
npm run build
```

**4. Start the Production Server:**

```bash
npm start
```

**5. Linting:**

```bash
npm run lint
```

## Development Conventions

*   **Coding Style:** The project uses ESLint with the `next/core-web-vitals` configuration to enforce code quality and best practices. The configuration can be found in the `.eslintrc.json` file. Specific rules, such as `react/no-unescaped-entities` and `@next/next/no-page-custom-font`, have been customized to fit the project's needs.
*   **Testing:** The `README.md` file mentions that changes should be tested thoroughly, but there is no specific testing framework configured in the `package.json`. It is recommended to add a testing framework like Jest or Playwright to ensure code quality.
*   **Commits:** The `README.md` does not specify a commit message format, but it is recommended to use conventional commit standards to maintain a clear and consistent commit history.
*   **Branching:** The `README.md` file suggests a contribution workflow that includes forking the repository, creating a feature branch, and submitting a pull request. This indicates a collaborative development model where changes are reviewed before being merged into the main branch.
