# Fractalchat – Project Overview

Fractalchat is an experimental chat interface for interacting with a language model in a non-linear, recursive way.  
Instead of a single, linear conversation thread, users can branch off subthreads from any span of text in a message.  
This creates a directed tree of related conversations, allowing deep exploration of ideas while maintaining context at each level.

## Core Concepts

- **Message:** Basic unit of the conversation. Each message belongs to a specific thread.
- **Thread:** A sequence of messages. Can be a root thread (doesn't have parent thread) or a subthread.
- **Anchor:** A text selection within a message that links to a child thread. Each anchor has thread id it points to.
- **Conversation Tree:** A recursive structure where threads can have child threads via anchors.

## Primary Features

- Branching chat UI via in-message anchors
- Navigable tree structure in the sidebar showing all anchors and their nesting levels, with indentation. Allows jumping to any anchor within the currently selected root thread.
- Breadcrumb navigation for moving upward along the current branch path
- Context passed to the LLM includes thread ancestry
- Stateless or persistent mode (via Supabase)
- LLM responses returned as Markdown and rendered to HTML
