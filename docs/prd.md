# Fractalchat Product Requirements Document

## Intro

Fractalchat is a chat interface that represents an AI conversation as a tree rather than a single line. After each assistant reply, the user can highlight any part of the text to open a child thread focused on that fragment, while the original conversation continues unchanged.

## Problem Statement

Linear chat interfaces force users into a trade-off:

- Lose context when following tangential questions
- Clutter the main thread with side discussions
- Abandon interesting detours to stay on topic

This results in missed insights, scattered notes, and less effective knowledge-building for users.

## Target Users

- **Curious Learners**: People who naturally ask follow-up questions when learning about any topic—whether it's a hobby, current events, or random interests they want to explore deeply

- **Students**: Anyone actively learning (high school, college, online courses, self-study) who needs to understand complex topics with interconnected concepts

- **Researchers**: Professionals who explore complex topics with multiple angles and need to maintain context across different aspects of their research

## Features

### Phase 1 (MVP)

1. **Anchor-Based Branching** – Highlight text in an assistant message to create a child thread anchored to that span.
2. **Thread Persistence & Auth** – Store threads, anchors, and messages in Supabase with row-level security per user.
3. **Context-Aware AI Responses** – Pass ancestor messages and optional `<focus>` prompt to the LLM; stream responses.
4. **Navigation UI** – Breadcrumb path, sidebar tree view, and URL structure (`/t/[...ids]`) that reflect hierarchy.
5. **Basic Session Management** – Sign-up / sign-in, settings for OpenAI key, and simple error handling.

### Phase 2

1. **Search** – Full-text search across threads, plus related-thread recommendations.
2. **Summaries & Insights** – AI-generated overviews for long threads or selected branches.
3. **Collaboration** – Share conversation trees with a link or invite, including read-only and edit modes.
4. **Command / Voice Branching** – Parse phrases like "zoom in on ..." or `/branch ...` to create branches without highlighting; groundwork for future audio input.
5. **Export & Integrations** – Export threads as Markdown, OPML, or a knowledge-graph format; optional API for third-party tools.
