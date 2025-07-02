# Fractalchat Tech Stack

This document outlines the core technologies, frameworks, and services used to build and run Fractalchat.

---

## 1. Frontend

- **Framework:** [Next.js 15](https://nextjs.org/) (React 19)
- **Language:** TypeScript
- **UI Library:** Tailwind CSS
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Markdown Rendering:** react-markdown, remark-gfm, rehype-raw
- **Component Structure:** Modular, with feature-based directories

---

## 2. Backend

- **API Layer:** Next.js API routes
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** Supabase Auth
- **Migrations:** Supabase CLI with SQL migration files

---

## 3. AI/LLM Integration

- **Provider:** OpenAI (GPT-4o)
- **Library:** openai (npm package)

---

## 4. Project Structure

- **Monorepo:** Single Next.js app with `/src` for all code
- **Docs:** Markdown files in `/docs`
- **Database:** SQL migrations in `/supabase/migrations`
- **Public Assets:** `/public`

---

## 5. Tooling & Dev Experience

- **Linting:** ESLint (with Next.js config)
- **Type Checking:** TypeScript
- **Formatting:** Prettier
- **Version Control:** Git
- **Package Management:** npm

---

## 6. Deployment

- **Hosting:** Vercel, Supabase
- **Environment Variables:** Managed via `.env.local` and Supabase dashboard
