# Fractalchat

AI chat app with recursive, branching conversations. Users can highlight text to create sub-threads that explore tangents while maintaining context.

## Tech Stack

- Next.js 15, React 19, TypeScript, Tailwind CSS 4
- Supabase (PostgreSQL + Auth)
- OpenAI API for LLM
- Zustand for state management
- pnpm monorepo

## Structure

```
apps/web/src/
  app/           # Next.js App Router
  components/    # React components
  lib/           # Utilities, db, llm
  store/         # Zustand stores
packages/types/  # Shared TypeScript types
supabase/        # Database migrations
```

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Run dev server
pnpm build            # Production build
pnpm lint             # ESLint
```
