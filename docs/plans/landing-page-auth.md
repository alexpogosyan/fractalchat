# Landing Page Auth Buttons Enhancement Plan

## Overview
Enhance the existing LandingPage component with authentication options: Sign In, Sign Up, and Try Without Signup (anonymous account) buttons.

## Current State Analysis
- **Auth Decision**: Already handled in `/app/page.tsx` - shows `AppLayout` for authenticated users, `LandingPage` for anonymous
- **LandingPage Component**: Exists in `/components/LandingPage.tsx` 
- **Auth Actions**: Available in `/app/auth/actions.ts`
- **Routing**: Sign in/up routes likely exist at `/auth/signin` and `/auth/signup`

## Requirements

### Button Layout
1. **Sign In** - Link to existing sign in page
2. **Sign Up** - Link to existing sign up page  
3. **Try Without Signup** - Anonymous account creation + redirect to app

### Anonymous Account Feature
- Use Supabase anonymous account feature
- Create temporary session without email/password
- Redirect user directly to main app experience
- Data can be optionally linked to real account later

## Implementation Plan

### 1. Update LandingPage Component
**Modify: `/components/LandingPage.tsx`**
- Add auth button section to existing design
- Use shadcn Button components for consistent styling
- Arrange buttons in logical hierarchy (primary/secondary styling)

### 2. Create Anonymous Account Action
**New/Modify: `/app/auth/actions.ts`**
- Add `createAnonymousAccount()` server action
- Use Supabase `signInAnonymously()` method
- Handle success/error states
- Redirect to main app on success

### 3. Button Styling & Layout
**Suggested arrangement:**
```
Primary: "Get Started" (Sign Up)
Secondary: "Sign In" 
Tertiary/Ghost: "Try Without Signup"
```

### 4. Anonymous Account Implementation
```typescript
// In auth/actions.ts
export async function createAnonymousAccount() {
  const supabase = await getServerClient();
  const { error } = await supabase.auth.signInAnonymously();
  
  if (error) {
    return { error: error.message };
  }
  
  redirect('/'); // Redirect to main app
}
```

## UI/UX Considerations

### Button Hierarchy
- **"Get Started"** (Sign Up) - Primary button, most prominent
- **"Sign In"** - Secondary button for existing users
- **"Try Without Signup"** - Tertiary/ghost button, less prominent

### Button Group Layout
```tsx
<div className="flex flex-col sm:flex-row gap-4 justify-center">
  <Button size="lg" asChild>
    <Link href="/auth/signup">Get Started</Link>
  </Button>
  <Button size="lg" variant="outline" asChild>
    <Link href="/auth/signin">Sign In</Link>
  </Button>
  <Button size="lg" variant="ghost" onClick={handleTryAnonymous}>
    Try Without Signup
  </Button>
</div>
```

### Anonymous Account UX
- Clear indication that it's temporary
- Option to convert to real account later
- Maybe show "Guest Session" indicator in header

## Files to Modify
1. **MODIFY**: `/components/LandingPage.tsx` - Add auth buttons
2. **MODIFY**: `/app/auth/actions.ts` - Add anonymous account creation
3. **TEST**: Verify anonymous account flow works with Supabase
4. **OPTIONAL**: Add guest session indicators

## Supabase Anonymous Accounts
- **Feature**: `supabase.auth.signInAnonymously()`
- **Benefits**: Instant access without friction
- **Limitations**: Temporary, data may be lost if not linked
- **Conversion**: Can link anonymous account to real email later

## Success Criteria
- ✅ Landing page shows clear auth options
- ✅ Sign In/Sign Up buttons navigate to existing auth pages
- ✅ "Try Without Signup" creates anonymous session and redirects
- ✅ Anonymous users can use app normally
- ✅ Consistent button styling with rest of app
- ✅ Good mobile/desktop responsive layout

## Future Enhancements
- Anonymous account → real account conversion flow
- "Save your work" prompts for anonymous users
- Progress indicators during anonymous account creation