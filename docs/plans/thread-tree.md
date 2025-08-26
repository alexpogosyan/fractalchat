# Thread Tree Sidebar Implementation Plan

## Overview

Implement a hierarchical thread tree view in the sidebar using shadcn Collapsible components to display the recursive thread structure of conversations.

## ✅ IMPLEMENTATION COMPLETED

## Final Implementation Summary

- ✅ Thread tree data loaded via `getThreadTree()` in `data.tsx`
- ✅ Recursive `ThreadTreeItem` components in `app-sidebar.tsx`
- ✅ Types moved to shared `/packages/types/index.ts`
- ✅ `coreGetThreadTree()` function builds hierarchical structure
- ✅ Collapsible UI with ChevronRight icons and animations

## Required Changes

### 1. Install Dependencies

- Generate shadcn collapsible component: `pnpm dlx shadcn@latest add collapsible`

### 2. Database Layer Enhancements

- Create `coreGetThreadTree()` function in `/lib/db/core.ts`
- Build complete thread hierarchy with children included
- Return tree structure suitable for recursive rendering

### 3. Data Layer Updates (`data.tsx`)

- Fetch thread tree data using new `coreGetThreadTree()`
- Pass tree data to `<AppSidebar>` component as props
- Handle loading/error states

### 4. Component Updates (`app-sidebar.tsx`)

- Accept thread tree data as props
- Implement recursive `ThreadTreeNode` component
- Use Collapsible for expandable thread nodes
- Show chevron icons for threads with children
- Add thread titles and navigation links
- Handle thread selection/active states

### 5. Type Definitions

- Move existing types from `/src/types/app.ts` to shared `/packages/types/index.ts`
- Add `ThreadTreeNode` interface extending `Thread`
- Include `children: ThreadTreeNode[]` property
- Add `@fractalchat/types` dependency to web app

### 6. Integration (`app.tsx`)

- Replace static `<AppSidebar />` with data-loaded version
- Import from `data.tsx` instead of `app-sidebar.tsx`

## Implementation Details

### Thread Tree Structure

```typescript
interface ThreadTreeNode extends Thread {
  children: ThreadTreeNode[];
  messageCount?: number;
  lastActivity?: string;
}
```

### ✅ Database Implementation

- `coreGetThreadTree()` fetches all threads with message counts
- Client-side tree building using Map-based approach
- Hierarchical structure with parent-child relationships
- Sorted by creation date with recursive ordering

### ✅ UI Implementation

- ✅ Collapsible items for threads with children
- ✅ ChevronRight icons with rotation animation
- ✅ Left-aligned items without chevrons (pl-8 class)
- ✅ Single-line titles with truncate/ellipsis
- ✅ Clickable navigation to `/t/[threadId]` for all items
- ✅ Proper hover cursors and link behavior
- ❌ Active thread highlighting (not yet implemented)

## Files to Modify

1. `/packages/types/index.ts` - Move existing types + add `ThreadTreeNode`
2. `/apps/web/package.json` - Add `@fractalchat/types` dependency
3. `/apps/web/src/types/app.ts` - Update imports to use shared types
4. `/apps/web/src/lib/db/core.ts` - Add `coreGetThreadTree()` + update imports
5. `/apps/web/src/components/app-sidebar/data.tsx` - Load and pass tree data
6. `/apps/web/src/components/app-sidebar/app-sidebar.tsx` - Implement tree UI
7. `/apps/web/src/components/app.tsx` - Use data-loaded sidebar
8. `/apps/web/src/components/ui/collapsible.tsx` - Generate shadcn component

## Dependencies

- `lucide-react` (ChevronRight icon - already installed)
- Collapsible component will be generated via shadcn CLI

## Required Shadcn Components

**Already available:**

- `Sidebar`, `SidebarContent`, `SidebarGroup`, `SidebarGroupContent`, `SidebarGroupLabel`
- `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuSub`
- `SidebarRail`

**Need to generate:**

- `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`

## Success Criteria

- ✅ Hierarchical thread tree displays in sidebar
- ✅ Expand/collapse functionality works
- ✅ Thread navigation via clicks for all items
- ✅ Proper left alignment for leaf items
- ✅ Single-line titles with ellipsis
- ✅ Hover cursor behavior
- ❌ Active thread highlighting (future enhancement)
- ✅ Responsive design with shadcn styling
- ✅ Types in shared package structure

---

## 🔄 NEXT PHASE: Thread Expansion State Management

### Problem Analysis

**Current Issue**: Thread expansion state is managed by individual `useState` in each `ThreadTreeItem`. When navigation occurs (URL change), components unmount/remount and all expansion state is lost, causing all threads to collapse.

**Root Cause**: Component-level state doesn't persist across navigation/page refreshes.

### Existing Store Analysis

- **Main Store**: `/store/useStore.ts` - Large store with thread data, messages, anchors, chat logic
- **Selectors**: `/store/selectors.ts` - Reusable store selectors
- **Architecture**: Uses Zustand with Immer middleware for immutable updates

### Solution: Separate UI State Store

#### New Store: `/store/useThreadUIStore.ts`

**Focused on UI state only:**

```typescript
interface ThreadUIState {
  expandedThreads: Set<string>;
  toggleExpanded: (threadId: string) => void;
  setExpanded: (threadId: string, expanded: boolean) => void;
  isExpanded: (threadId: string) => boolean;
  expandAncestorPath: (threadTree: ThreadTreeNode[], threadId: string) => void;
}
```

#### Key Features:

1. **Persistent Expansion**: Thread expansion survives navigation
2. **Auto-Expand Ancestry**: Current thread's parents stay expanded
3. **Manual Control**: Users can expand/collapse threads manually
4. **Set-Based Storage**: Efficient storage of expanded thread IDs
5. **Modular**: Separate from main store for clean separation of concerns

### Implementation Plan

#### 1. Create Thread UI Store

**New File: `/store/useThreadUIStore.ts`**

- Lightweight store focused only on UI state
- Use `Set<string>` for efficient expanded thread tracking
- Methods for toggle, set, and bulk operations
- Auto-expansion utilities

#### 2. Update ThreadTreeItem Component

**Modify: `/components/app-sidebar/app-sidebar.tsx`**

- Remove local `useState` for `isOpen`
- Use `useThreadUIStore` for expansion state
- Call `toggleExpanded` on user clicks
- Read `isExpanded` for render state

#### 3. Auto-Expand Current Thread Path

**Integration with AppLayout/AppSidebar:**

- When `currentThreadId` changes, auto-expand ancestry path
- Use `expandAncestorPath` utility to ensure parents are visible
- Preserve user's manual expansion choices

#### 4. Store Integration Pattern

```typescript
// In ThreadTreeItem
const { isExpanded, toggleExpanded } = useThreadUIStore();
const expanded = isExpanded(thread.id);

const handleToggle = () => {
  toggleExpanded(thread.id);
};

// In AppSidebar (when currentThreadId changes)
useEffect(() => {
  if (currentThreadId && threadTree.length > 0) {
    expandAncestorPath(threadTree, currentThreadId);
  }
}, [currentThreadId, threadTree]);
```

### Files to Create/Modify

1. **CREATE**: `/store/useThreadUIStore.ts` - New UI-focused store
2. **MODIFY**: `/components/app-sidebar/app-sidebar.tsx` - Use new store
3. **MODIFY**: `/store/selectors.ts` - Add UI store selectors if needed
4. **TEST**: Verify expansion persists across navigation

### Benefits

- ✅ **Persistent State**: Expansion survives page navigation
- ✅ **Auto-Expand**: Current thread's parents always visible
- ✅ **User Control**: Manual expand/collapse choices remembered
- ✅ **Performance**: Set-based storage, efficient lookups
- ✅ **Separation**: UI state separate from business logic
- ✅ **Modularity**: Small, focused store vs monolithic

### Success Criteria

- ✅ Thread expansion state persists across navigation
- ✅ Current thread's ancestry path auto-expands
- ✅ User's manual expansion choices are remembered
- ✅ No performance regressions
- ✅ Clean separation between UI state and data state

---

## 🔄 NEXT PHASE: Active Thread Highlighting + New Thread Button

### Research Summary

- Thread URLs follow pattern `/t/[...ids]` where `ids` is an array
- Current thread ID extracted as `ids.at(-1)` in page.tsx
- Sidebar components are server-side (no "use client")
- SidebarMenuButton supports `isActive` prop for highlighting
- Button component available in UI library

### Implementation Plan

#### 1. Active Thread Highlighting

**Convert to Client Component:**

- Add `"use client"` to `app-sidebar.tsx`
- Import `usePathname` from `next/navigation`
- Extract current thread ID from pathname `/t/threadId`

**Update ThreadTreeItem Component:**

- Pass `currentThreadId` prop down recursively
- Use `SidebarMenuButton`'s `isActive` prop when `thread.id === currentThreadId`
- Apply to both leaf items and parent items with children

#### 2. New Thread Button

**Add to SidebarGroup:**

- Place button above thread list in SidebarContent
- Use shadcn Button component with appropriate styling
- Add Plus icon from lucide-react
- Button text: "New Thread"
- Empty onClick handler for now

**Button Styling:**

- Use `variant="outline"` or `variant="ghost"`
- Full width with proper padding
- Icon + text layout

### Files to Modify

1. `/apps/web/src/components/app-sidebar/app-sidebar.tsx` - Add client-side logic and button
2. Update imports for `usePathname`, `Button`, and `Plus` icon

### UI Behavior

- **Active highlighting**: Current thread item gets highlighted background/text color via `isActive` prop
- **Button placement**: Prominent but not overwhelming, above thread list
- **Responsive**: Works on mobile and desktop sidebar states

---

## ✅ COMPLETED: Thread Tree with Actions & Fixes

### What Was Implemented

#### Three Dot Menu with Actions ✅
- Added dropdown menu to **root-level threads only** (child threads read-only)
- **Delete action**: Uses shadcn dialog with confirmation instead of browser alert
- **Rename action**: Inline editing with input field (Enter/Escape keys)
- Menu appears on hover with `SidebarMenuAction` component

#### Store Integration ✅
- Added `updateThreadTitle()` action to store interface and implementation
- Added `resetStore()` and store cleanup on signout to prevent cross-user data leaks
- Thread deletion removes from both database and live thread tree
- Navigation away from deleted threads to prevent 404s

#### Navigation & Highlighting Fixes ✅
- Fixed breadcrumbs extraction: `pathname.split('/').slice(2).at(-1)` for last thread ID
- Fixed sidebar highlighting: Same fix applied to AppSidebar component
- Auto-expansion of ancestor threads when navigating to child threads
- Proper highlighting of current thread (not parent) in sidebar

#### User Onboarding ✅
- Welcome thread creation for new users (signup + anonymous)
- Multi-level branching example: Welcome → carbon dioxide → fossil fuels
- Proper markdown formatting for ReactMarkdown rendering
- Working anchors with correct text selectors
- Demonstrates full conversation tree functionality

#### Files Modified
1. `/store/useStore.ts` - Added thread tree management, resetStore, updateThreadTitle
2. `/components/app-sidebar/app-sidebar.tsx` - Three dot menus, navigation fixes
3. `/components/AppLayout.tsx` - Store integration, breadcrumb fixes  
4. `/components/AvatarMenu.tsx` - Store cleanup on signout
5. `/app/auth/actions.ts` - Welcome thread creation for new users
6. `/lib/onboarding.ts` - Complete onboarding flow with nested examples

### Current Status: COMPLETE ✅

The thread tree is fully functional with:
- ✅ Hierarchical display with expand/collapse
- ✅ Root-level thread management (delete/rename)
- ✅ Proper navigation and highlighting
- ✅ User onboarding with working examples
- ✅ Store state management and cleanup
- ✅ Breadcrumb navigation for deep threads
