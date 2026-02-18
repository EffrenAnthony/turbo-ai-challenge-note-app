Apply the following frontend project rules before finalizing any change. These rules are mandatory and must always be followed.

---

## Clean Code Rules

- **Zero warnings**: No TypeScript, ESLint, or compiler warnings left behind. Resolve all before finishing.
- **Zero unused elements**: No unused imports, variables, functions, types, or parameters. If it's not used, delete it.
- **One component per file**: Each `.tsx` file exports a single component. If you need a subcomponent, create it in its own file.
- **Refactor when complexity is high**: If a component exceeds ~150 lines or has more than 3 responsibilities, split it into smaller components, hooks, or utilities.
- **Ordered and readable code**: Follow the internal component order: types → hooks → derived variables → handlers → early returns → JSX.
- **Move constants out**: Never define magic constants inline. Extract them to a constants file.
- **Move shared types out**: Types used by more than one file must live in `@/types/`.

---

## File Organization

### Constants
- Constants go in `@/lib/utils/constants.ts` or a dedicated file within `@/lib/utils/`.
- Never hardcode magic strings or numbers inline.

### Types & Interfaces
- Shared types and interfaces go in `@/types/` with their corresponding file (`notes.ts`, `categories.ts`, `auth.ts`, `api.ts`).
- Re-export from `@/types/index.ts`.
- Types local to a single component can stay in the same file, but if reused, move them to `@/types/`.
- Use `interface` for object shapes (not `type`). Name as `ComponentNameProps`.

### Components
- Atomic UI (Button, Input, Card, Spinner): `@/components/ui/`
- Forms: `@/components/forms/`
- SVG Icons: `@/components/icons/` (one file per icon, barrel export in `index.ts`)
- Layout (Sidebar, Header): `@/components/layout/`
- Feature-specific (NoteCard, NoteList): `@/components/{feature}/`
- Providers: `@/components/providers/`

### Hooks
- Custom hooks in `@/lib/hooks/`. `use` prefix is mandatory.
- React Query hooks are simple wrappers that return `useQuery(...)` or `useMutation(...)`.

### API
- API functions in `@/lib/api/`. Always return `response.data`, never the full response.
- Use `apiClient` (axios) for all client-side calls. Never use `fetch` on the client side.

### Utilities
- Utility functions in `@/lib/utils/`.
- Use `cn()` for Tailwind class merging.

---

## Style & Formatting Rules

### Prettier (enforced)
- No semicolons
- Single quotes
- Trailing commas everywhere
- Print width: 100
- Tab width: 2

### Imports
- Always use the `@/` alias for internal imports. Never use relative paths (`../../`).
- Import order:
  1. External libraries (`react`, `next`, `axios`, `formik`)
  2. Type imports (`import type { ... }`)
  3. Internal lib (utils, hooks, api, auth)
  4. Internal components
- No unused imports.

### Exports
- Named exports for components: `export function Button() {}`
- Default exports only for Next.js pages: `export default function LoginPage() {}`
- Barrel exports (`index.ts`) for folders that need them (icons, types).

---

## Tailwind CSS v4 Rules

- Use `@theme` in `globals.css` for design tokens (colors, fonts).
- Color palette: `sunset`, `honey`, `sage`, `jade` (50-950 each).
- Base font: Inter (`font-sans`). Title font: Inria Serif (`font-serif`).
- `font-serif` is only used on: welcome title (login/register), NoteCard title, NoteForm title input.
- Use `cn()` for conditional classes. Never use inline ternaries for complex class logic.
- Color variants mapped with `Record<CardColor, string>`.
- Buttons are outline style: `bg-transparent` + `border-2`, subtle hover, focus ring.

---

## React & Next.js Rules

### Components
- `'use client'` only when required (hooks, events, browser APIs).
- Props extend HTML attributes when applicable: `extends ButtonHTMLAttributes<HTMLButtonElement>`.
- Spread `...props` to pass native HTML attributes through.
- Use `React.SyntheticEvent<HTMLFormElement>` for form events (not `FormEvent`, deprecated in React 19).

### Forms
- **Formik** for all forms (login, register, note editor).
- Validation in a separate `validate` function, not inline.
- Show errors only if the field was touched: `formik.touched.field ? formik.errors.field : undefined`.
- `enableReinitialize: true` when initial data can change.

### HTTP Requests — Axios Configuration
- All client-side HTTP requests must use the shared `apiClient` from `@/lib/api/client.ts`. Never create new axios instances or use `fetch`.
- `apiClient` is pre-configured with:
  - `baseURL` pointing to the API URL from constants.
  - Default `Content-Type: application/json` header.
  - **Request interceptor**: Automatically attaches the Bearer access token from localStorage to every request.
  - **Response interceptor**: Catches 401 errors, queues failed requests, refreshes the token using the refresh endpoint, replays queued requests, and redirects to `/login` if refresh fails.
- API functions (`@/lib/api/`) are thin wrappers around `apiClient` that return `response.data`:
  ```tsx
  export async function getNotes(): Promise<PaginatedResponse<Note>> {
    const response = await apiClient.get<PaginatedResponse<Note>>('/notes/')
    return response.data
  }
  ```
- Never handle token attachment, refresh logic, or auth headers manually in components — the interceptors handle it.

### Data Fetching & Server State — TanStack React Query
- **All server data** (notes, categories, user data) must be fetched and managed through React Query. Never use `useEffect` + `useState` for data fetching.
- Create a custom hook in `@/lib/hooks/` for each query:
  ```tsx
  export function useNotes() {
    return useQuery({ queryKey: ['notes'], queryFn: getNotes })
  }
  ```
- **Loading states**: Always handle loading with `isLoading` from the query. Show a `<Spinner />` or skeleton while loading. Never render the main content before data is ready.
  ```tsx
  const { data, isLoading } = useNotes()
  if (isLoading) return <Spinner />
  ```
- **Error states**: Always handle errors with `isError` and `error` from the query. Show a user-friendly error message, never raw error objects or technical messages.
  ```tsx
  const { data, isLoading, isError } = useNotes()
  if (isError) return <p>Something went wrong. Please try again.</p>
  ```
- **Mutations**: Use `useMutation` for create, update, and delete operations. Always handle `onSuccess` (invalidate queries, update cache) and `onError` (show feedback to user).
  ```tsx
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })
  ```
- **Optimistic updates**: For UI-critical mutations (like autosave), use `queryClient.setQueryData` in `onSuccess` to update the cache immediately.
- **Pending state for mutations**: Use `mutation.isPending` to disable buttons and show loading indicators during submission.
  ```tsx
  <Button disabled={mutation.isPending}>
    {mutation.isPending ? 'Saving...' : 'Save'}
  </Button>
  ```
- **Error display for mutations**: Use `mutation.isError` and `mutation.error` to show inline error messages after failed submissions.
- QueryClient config: `staleTime: 60 * 1000`, `retry: 1`.

### Authentication
- Tokens stored in localStorage (for axios) + cookies (for middleware).
- Axios interceptor with queue-based token refresh.
- Middleware protects routes server-side by checking cookies.
- `/` redirects to `/notes` or `/login` based on session.
- **React Context** only for auth (user, login, logout).

### Icons
- All SVG icons in `@/components/icons/` as React components.
- Each icon accepts `className?: string`.
- Import from `@/components/icons` (barrel export).
- Never use inline SVGs in components.

### API Routes (Next.js)
- API routes in `app/api/` are proxies to the Django backend.
- They use axios to forward requests.
- They pass authorization headers to the backend.

---

## Checklist Before Finishing

Before finalizing any change, verify:

1. [ ] Zero TypeScript and ESLint warnings
2. [ ] Zero unused imports, variables, or functions
3. [ ] Constants extracted to constants files
4. [ ] Shared types in `@/types/`
5. [ ] One component per file
6. [ ] Long components refactored
7. [ ] SVG icons in `@/components/icons/`
8. [ ] Imports ordered and using `@/` alias
9. [ ] Prettier format applied (no semicolons, single quotes)
10. [ ] `font-serif` only where it belongs (specific titles)
11. [ ] Buttons with outline style
12. [ ] Forms using Formik with separate validation
13. [ ] All HTTP requests use `apiClient` from `@/lib/api/client.ts`
14. [ ] All server data fetched via React Query hooks
15. [ ] Loading states handled with `isLoading` + Spinner
16. [ ] Error states handled with `isError` + user-friendly message
17. [ ] Mutations use `isPending` for button disabled state
18. [ ] Mutation errors displayed inline to the user
