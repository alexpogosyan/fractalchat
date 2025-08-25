# Hierarchical Thread Breadcrumbs Plan

## Overview
Replace the current simple breadcrumbs with proper hierarchical navigation that shows the thread ancestry path from root thread to current thread.

## Current State Analysis
- **Existing**: `components/ui/Breadcrumbs.tsx` component (needs to be integrated)
- **Current Layout**: Shows "Fractalchat > Thread abc123" for all threads
- **Thread Structure**: Threads have `parent_id` relationships forming a hierarchy
- **Data Available**: `threadTree` contains full hierarchy, `threadId` identifies current thread

## Requirements

### Breadcrumb Logic
1. **No thread selected**: No breadcrumbs (empty state)
2. **Root thread**: Show just the root thread title
3. **Child thread**: Show path from root → parent → child
4. **Deep nesting**: Show full ancestry chain

### Example Breadcrumb Paths
```
No selection: (no breadcrumbs)
Root thread: "AI Discussion"
Child thread: "AI Discussion > Machine Learning"  
Grandchild: "AI Discussion > Machine Learning > Neural Networks"
```

## Implementation Plan

### 1. Create Breadcrumb Helper Function
**New utility: `getBreadcrumbPath(threadTree, currentThreadId)`**
- Find current thread in tree structure
- Traverse up parent chain to root
- Return array of thread objects with titles and IDs
- Handle edge cases (thread not found, missing titles)

### 2. Update AppLayout Component
**Modify: `/components/AppLayout.tsx`**
- Import breadcrumb utility function
- Calculate breadcrumb path from `threadTree` and `threadId`
- Only show breadcrumbs when `currentThreadId` exists
- Render breadcrumb chain with proper links

### 3. Breadcrumb Navigation
**Link behavior:**
- Each breadcrumb item links to its thread (`/t/[id]`)
- Last item (current thread) is not clickable
- Proper hover states and active styling

### 4. Thread Title Fallbacks
**Handle missing titles:**
- Use thread title if available
- Fallback to "Thread [first 8 chars of ID]"
- Ensure consistent formatting

## Implementation Details

### Breadcrumb Path Algorithm
```typescript
function getBreadcrumbPath(
  threadTree: ThreadTreeNode[], 
  threadId: string | null
): ThreadTreeNode[] {
  if (!threadId) return [];
  
  // Find thread in tree (recursive search)
  const thread = findThreadInTree(threadTree, threadId);
  if (!thread) return [];
  
  // Build path from root to current
  const path: ThreadTreeNode[] = [];
  let current = thread;
  
  while (current) {
    path.unshift(current);
    current = findThreadInTree(threadTree, current.parent_id);
  }
  
  return path;
}
```

### AppLayout Integration
```tsx
// In AppLayout.tsx
const breadcrumbPath = getBreadcrumbPath(threadTree, currentThreadId);

{breadcrumbPath.length > 0 && (
  <Breadcrumb>
    <BreadcrumbList>
      {breadcrumbPath.map((thread, index) => {
        const isLast = index === breadcrumbPath.length - 1;
        const title = thread.title || `Thread ${thread.id.slice(0, 8)}`;
        
        return (
          <React.Fragment key={thread.id}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage>{title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={`/t/${thread.id}`}>
                  {title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        );
      })}
    </BreadcrumbList>
  </Breadcrumb>
)}
```

## Files to Create/Modify
1. **CREATE**: `/lib/breadcrumbs.ts` - Breadcrumb path utilities
2. **MODIFY**: `/components/AppLayout.tsx` - Integrate hierarchical breadcrumbs
3. **REFERENCE**: `/components/ui/Breadcrumbs.tsx` - Use existing component patterns
4. **TEST**: Verify with nested thread structures

## User Experience
- **Clear hierarchy**: Users see exactly where they are in thread tree
- **Navigation**: Click any parent to navigate up the hierarchy  
- **Consistency**: Same breadcrumb logic works for all thread depths
- **Responsive**: Breadcrumbs work on mobile and desktop
- **Performance**: Efficient tree traversal algorithms

## Success Criteria
- ✅ Root threads show single breadcrumb with thread title
- ✅ Child threads show full ancestry path
- ✅ Breadcrumb links navigate to parent threads
- ✅ Current thread shown as non-clickable page indicator
- ✅ No breadcrumbs shown when no thread selected
- ✅ Proper fallbacks for missing thread titles
- ✅ Efficient tree traversal performance