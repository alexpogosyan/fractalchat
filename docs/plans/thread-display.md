# Thread Display Integration Plan (REVISED)

## Overview
Integrate thread display into main application while maintaining proper Next.js routing. The app needs both a main layout that can display threads AND proper `/t/[id]` routes for direct navigation and sharing.

## Current State Analysis
- **Main Layout**: `app.tsx` has sidebar but empty content area
- **Existing Route**: `/t/[...ids]/page.tsx` works but exists separately from main layout
- **Thread Component**: `components/Thread.tsx` exists and works
- **Navigation**: Sidebar links to `/t/[id]` but main layout doesn't display content

## Revised Architecture Decision

### Two-Route Approach
1. **Root Route** (`/`): Main layout with sidebar + thread display
2. **Thread Routes** (`/t/[id]`): Use main layout but with thread content

## Implementation Plan

### 1. Convert Main Layout to Layout Component
**Modify `/components/app.tsx` → `/app/layout.tsx` or keep as shared layout**
- Make `app.tsx` a reusable layout component that accepts children
- Include sidebar, header, breadcrumbs
- Accept optional `threadId` prop for breadcrumb updates

### 2. Update Root Route (`/app/page.tsx`)
- Render main layout with empty state (welcome message)
- Show "Select a thread" placeholder

### 3. Update Thread Route (`/app/t/[...ids]/page.tsx`) 
**Two options:**
- **Option A**: Redirect to root with thread content displayed
- **Option B**: Render same layout but with thread content

**Recommended: Option B**
```tsx
// /app/t/[...ids]/page.tsx
export default async function ThreadPage({ params }) {
  const threadId = params.ids?.[0];
  const bundle = await getThreadBundle(threadId);
  
  return (
    <AppLayout threadId={threadId}>
      <Thread bundle={bundle} />
    </AppLayout>
  );
}
```

### 4. Create Shared Layout Component
**New: `/components/AppLayout.tsx`**
```tsx
interface AppLayoutProps {
  children: React.ReactNode;
  threadId?: string | null;
}
```
- Contains sidebar, header, breadcrumbs
- Renders children in main content area
- Updates breadcrumbs based on threadId prop

### 5. Data Flow Options

#### Option A: Server-Side (Recommended)
- `/t/[id]` routes remain server-side
- Load data in page component, pass to layout
- Fast initial load, SEO friendly

#### Option B: Client-Side
- Convert routes to client-side with data fetching
- Better for dynamic interactions
- More complex state management

## Revised File Structure
```
/app/
  layout.tsx (root layout)
  page.tsx (home page with AppLayout + empty state)
  t/[...ids]/page.tsx (thread page with AppLayout + Thread)

/components/
  AppLayout.tsx (shared layout component)  
  Thread.tsx (existing, unchanged)
  ThreadDisplay.tsx (delete - not needed with this approach)
```

## Files to Create/Modify
1. **CREATE**: `/components/AppLayout.tsx` - Shared layout component
2. **MODIFY**: `/app/page.tsx` - Home page with empty state  
3. **MODIFY**: `/app/t/[...ids]/page.tsx` - Use AppLayout with Thread
4. **MODIFY**: `/components/app.tsx` - Convert to AppLayout component
5. **DELETE**: `/components/ThreadDisplay.tsx` - Not needed with route approach

## Benefits of This Approach
- ✅ Proper Next.js routing structure
- ✅ Direct URL access to threads (`/t/abc123`)
- ✅ Shareable thread URLs
- ✅ Server-side rendering for better performance
- ✅ Consistent layout between root and thread pages
- ✅ Clean separation of concerns

## Navigation Flow
1. User clicks sidebar link → Navigates to `/t/[id]`
2. Route renders `AppLayout` with `Thread` as children
3. Layout updates breadcrumbs based on threadId
4. Thread content displays in main area
5. Sidebar shows active thread highlighting

## Success Criteria
- ✅ `/t/[id]` URLs work and are shareable
- ✅ Consistent sidebar/header across all pages
- ✅ Thread content displays properly in main area
- ✅ Breadcrumbs update dynamically
- ✅ No duplicate code between routes