# Thread Tree Sidebar Feature Doc

## Overview

Hierarchical thread tree view in the sidebar using shadcn Collapsible components to display the recursive thread structure of conversations.

## Data Model

```typescript
interface ThreadTreeNode extends Thread {
  children: ThreadTreeNode[];
  messageCount?: number;
  lastActivity?: string;
}
```

## Implementation

### Database Layer
- `coreGetThreadTree()` in `/lib/db/core.ts` fetches all threads with message counts
- Client-side tree building using Map-based approach
- Hierarchical structure with parent-child relationships
- Sorted by creation date with recursive ordering

### UI Components
- Recursive `ThreadTreeItem` components in `app-sidebar.tsx`
- Collapsible items for threads with children
- ChevronRight icon click toggles expand/collapse
- Title click navigates to thread (does not toggle expand/collapse)
- Single-line titles with truncate/ellipsis
- Active thread highlighting via `isActive` prop

### State Management
- Separate UI store: `/store/useThreadUIStore.ts`
- Persistent expansion state across navigation
- Auto-expand ancestry path for current thread
- Set-based storage for efficient lookups

### Thread Actions (Root-level only)
- Three-dot dropdown menu on hover
- Delete with confirmation dialog
- Rename with inline editing (Enter/Escape keys)

## Files

| File | Purpose |
|------|---------|
| `/packages/types/index.ts` | ThreadTreeNode type definition |
| `/apps/web/src/lib/db/core.ts` | `coreGetThreadTree()` function |
| `/apps/web/src/store/useThreadUIStore.ts` | UI state for expansion |
| `/apps/web/src/components/app-sidebar/data.tsx` | Data loading |
| `/apps/web/src/components/app-sidebar/app-sidebar.tsx` | Tree UI components |

## Dependencies

- `lucide-react` - ChevronRight, Plus icons
- shadcn components: Collapsible, SidebarMenu*, Button, DropdownMenu, Dialog
