# Fractalchat Entity Inventory

This document defines the main domain objects used in Fractalchat and how they relate to each other.

---

## 1. User

- **id** – `uuid` from Supabase Auth (primary key)
- **Fields of interest** – email, created
  date (managed by Supabase)
- **Notes** – Owns threads, messages, and anchors via row-level security.

## 2. Thread

- **id** – `uuid`
- **user_id** – owner (FK → User)
- **parent_id** – optional `uuid` of parent thread (self-referential)
- **title** – first user message or user-edited string
- **created_at** – timestamp
- **Meaning** – A conversation context (root or branch). A branch is simply a thread whose `parent_id` is not `null`.

## 3. Message

- **id** – `uuid`
- **thread_id** – FK → Thread
- **sender** – enum `user | assistant`
- **content** – markdown string
- **created_at** – timestamp
- **Meaning** – One turn in the chat.

## 4. Anchor

- **id** – `uuid`
- **message_id** – FK → Message (the message being cited)
- **thread_id** – FK → Thread (the thread that owns the anchor)
- **selector** – `jsonb` conforming to the [DOM Anchor Text Quote](https://wicg.github.io/selector-proposals/#dom-anchor-textquote) spec; identifies the exact text span.
- **Meaning** – Bookmark of a text span that serves as the starting point for a child thread.
