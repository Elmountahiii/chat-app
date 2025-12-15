# Agent Instructions

## Commands
- **Backend:** `cd backend`
  - Build: `npm run build` (tsc)
  - Lint: `npm run lint` (eslint)
  - Dev: `npm run dev` (tsx watch)
  - Test: No tests configured currently.
- **Frontend:** `cd frontend`
  - Build: `npm run build` (next build)
  - Lint: `npm run lint` (next lint)
  - Dev: `npm run dev`
  - Test: No tests configured currently.

## Code Style & Conventions
- **General:** TypeScript strict mode. Prefer absolute imports (e.g., `@/` in frontend).
- **Backend:** Use class-based controllers/services. Use `async/await` with `try/catch` blocks handling errors via `HandleError`. specific types for Request/Response. Zod for validation.
- **Frontend:** Next.js App Router. Functional components. Tailwind CSS for styling. Shadcn UI components in `@/components/ui`. React Hook Form + Zod for forms. Zustand for state.
- **Naming:** CamelCase for vars/funcs, PascalCase for classes/components/interfaces.
