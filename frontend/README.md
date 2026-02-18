# Notes App - Frontend

A full-featured notes application built with Next.js 15, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **React 19** - Latest React with modern patterns
- **Tailwind CSS v4** - Utility-first CSS
- **Axios** - HTTP client with interceptors
- **React Query (TanStack Query)** - Server state management
- **Jest + React Testing Library** - Testing
- **ESLint + Prettier** - Linting and formatting
- **Husky + lint-staged** - Git hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend

This frontend connects to a Django REST Framework backend. Make sure the backend is running at the URL specified in `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000/api`).

## Scripts

| Command                 | Description                  |
| ----------------------- | ---------------------------- |
| `npm run dev`           | Start dev server (Turbopack) |
| `npm run build`         | Production build             |
| `npm run start`         | Start production server      |
| `npm run lint`          | Run ESLint                   |
| `npm run lint:fix`      | Run ESLint with auto-fix     |
| `npm run format`        | Format with Prettier         |
| `npm run format:check`  | Check formatting             |
| `npm run test`          | Run tests                    |
| `npm run test:watch`    | Run tests in watch mode      |
| `npm run test:coverage` | Run tests with coverage      |

## Project Structure

```
src/
  app/                    # Next.js App Router
    (auth)/               # Auth pages (login, register)
    (dashboard)/          # Protected pages (notes CRUD)
  components/
    ui/                   # Reusable UI (Button, Input, Card, Modal, Select, Spinner, Badge)
    forms/                # Form components (LoginForm, RegisterForm, NoteForm)
    layout/               # Layout components (Header, Sidebar, Footer)
    notes/                # Note components (NoteCard, NoteDetail, NoteList, CategoryFilter)
    providers/            # Context providers (AuthProvider, Providers)
  lib/
    api/                  # HTTP client and API service functions
    hooks/                # Custom React hooks (useAuth, useNotes, useCategories)
    utils/                # Utilities (cn, dates, validation, constants)
    auth/                 # Token management
  types/                  # TypeScript interfaces
  __tests__/              # Test files mirroring src/ structure
  middleware.ts           # Route protection
```

## Frontend Development Process

This section documents the step-by-step process followed to build the frontend, including the reasoning behind each decision.

### Phase 1: Design System — Theme & Color Palette

**Approach:** We follow an Atomic Design methodology:

1. **Theme** — Define the color palette and design tokens first
2. **Atoms** — Small, reusable UI primitives (Button, Input, Badge, etc.)
3. **Molecules** — Compositions of atoms (NoteCard, LoginForm, etc.)
4. **Pages/Containers** — Full page layouts that assemble molecules

#### Color Palette

Four primary colors were chosen to create a warm, natural aesthetic. Custom names avoid conflicts with Tailwind's built-in color utilities.

| Token    | Base Hex  | Tailwind Built-in Conflict | Purpose                          |
| -------- | --------- | -------------------------- | -------------------------------- |
| `sunset` | `#EF9C66` | `orange`                   | Primary accent, CTAs, highlights |
| `honey`  | `#FCDC94` | `yellow`                   | Secondary accent, backgrounds    |
| `sage`   | `#C8CFA0` | `green`                    | Success states, tags             |
| `jade`   | `#78ABA8` | N/A                        | Info states, links, accents      |

Each color is expanded into an 11-step scale (50–950) following Tailwind conventions, defined via Tailwind CSS v4's `@theme` directive in `globals.css`.

**Key design decisions:**
- `honey-100` (`#FAF1E3`) is used as the global application background, providing a warm off-white tone.
- The base colors provided sit in the 300–400 range, ensuring enough room for both lighter tints (UI surfaces) and darker shades (text, hover states).
- Names like `sunset`, `honey`, `sage`, and `jade` are semantic and evocative, making the palette easy to remember and use across the codebase.

#### Typography

Two font families are used throughout the application:

| Font           | Tailwind Class | Role                                  |
| -------------- | -------------- | ------------------------------------- |
| **Inter**      | `font-sans`    | Default body text, UI elements        |
| **Inria Serif**| `font-serif`   | Headings, note titles, display text   |

Both fonts are loaded via `next/font/google` in the root layout and registered as CSS variables (`--font-inter`, `--font-inria-serif`) mapped to Tailwind's `font-sans` and `font-serif` utilities in the `@theme` block.

**Key design decisions:**
- Inter was chosen for its excellent readability at small sizes and neutral tone, perfect for UI text.
- Inria Serif adds personality to titles and headings, creating visual hierarchy and a warm, editorial feel that complements the color palette.

#### Usage in Tailwind

Since the project uses **Tailwind CSS v4**, all colors and fonts are defined as CSS custom properties inside the `@theme` block in `globals.css`. This means they are available as standard Tailwind utilities:

```html
<div class="bg-honey-100 text-jade-700 font-sans">
  <h1 class="font-serif text-2xl">Title in Inria Serif</h1>
  <button class="bg-sunset-400 hover:bg-sunset-500">Click me</button>
</div>
```

### Phase 1.5: Infrastructure — API Client, Auth & Providers

Before building components, the data-fetching and auth infrastructure was set up:

#### Axios Client (`lib/api/client.ts`)

A centralized Axios instance with automatic token management:

- **Request interceptor** — Attaches the JWT access token from `localStorage` to every outgoing request via `Authorization: Bearer <token>`.
- **Response interceptor with token refresh** — On a `401` response, the interceptor:
  1. Queues any concurrent failing requests to avoid race conditions.
  2. Calls the Django `/auth/token/refresh/` endpoint with the stored refresh token.
  3. On success, updates tokens and retries all queued requests transparently.
  4. On failure, clears tokens and redirects to `/login`.

**Key design decisions:**
- A queue-based approach (`failedQueue`) prevents multiple simultaneous refresh calls when several requests fail at once.
- A raw `axios.post` (not `apiClient`) is used for the refresh call to avoid infinite interceptor loops.
- All API service functions (`auth.ts`, `notes.ts`, `categories.ts`) extract `.data` from the Axios response, providing a clean interface to consumers.

#### Next.js API Routes (`app/api/auth/`)

All auth endpoints are proxied through Next.js API routes, keeping the Django backend URL server-side:

| Route                     | Proxies to                       |
| ------------------------- | -------------------------------- |
| `POST /api/auth/login`    | `POST /api/auth/login/`          |
| `POST /api/auth/register` | `POST /api/auth/register/`       |
| `POST /api/auth/refresh`  | `POST /api/auth/token/refresh/`  |
| `POST /api/auth/logout`   | `POST /api/auth/logout/`         |

Each route uses Axios for consistency and properly forwards error responses from the backend.

#### React Query + Providers (`components/providers/`)

- **`Providers.tsx`** wraps the app with `QueryClientProvider` (React Query) and `AuthProvider`.
- **`AuthProvider.tsx`** provides auth context (`user`, `isAuthenticated`, `loginUser`, `logoutUser`) via React Context. On mount, it attempts to restore the session by decoding the JWT payload from `localStorage`.
- **`useAuth` hook** provides typed access to the auth context.

**Key design decisions:**
- React Query is configured with 60s `staleTime` and 1 retry by default, balancing freshness with performance.
- The `QueryClient` is created inside a `useState` to prevent re-creation on re-renders (React 19 best practice).
- The `AuthProvider` uses `useCallback` for `loginUser`/`logoutUser` to prevent unnecessary re-renders in consumers.

### Phase 2: Atoms — Base UI Components

#### Card (`components/ui/Card.tsx`)

The Card is the first atom — a styled container that accepts a theme color variant.

**Props:**
| Prop        | Type                                        | Default  | Description                    |
| ----------- | ------------------------------------------- | -------- | ------------------------------ |
| `color`     | `'sunset' \| 'honey' \| 'sage' \| 'jade'`  | `'jade'` | Theme color for border and bg  |
| `className` | `string`                                    | —        | Additional Tailwind classes    |
| `children`  | `ReactNode`                                 | —        | Card content                   |

**Visual specs:**
- Max width: 303px, Max height: 246px
- Border radius: 11px, Border width: 3px
- Padding: 16px
- Border color: the chosen theme color (e.g. `jade-400`)
- Background: the same color at 50% opacity (e.g. `jade-400/50`)

**Key design decisions:**
- The card uses the theme color at 50% opacity for the background rather than a lighter shade from the scale. This creates a translucent effect that maintains color consistency while being visually lighter than the border.
- A `color` prop with a strict union type ensures only valid theme colors are used, providing compile-time safety.
- The component extends `HTMLAttributes<HTMLDivElement>` to support all standard div props (event handlers, aria attributes, etc.).

#### Button (`components/ui/Button.tsx`)

A pill-shaped, themed button that follows the same color system as the Card.

**Props:**
| Prop        | Type                                        | Default    | Description                    |
| ----------- | ------------------------------------------- | ---------- | ------------------------------ |
| `color`     | `'sunset' \| 'honey' \| 'sage' \| 'jade'`  | `'sunset'` | Theme color for border and bg  |
| `iconLeft`  | `ReactNode`                                 | —          | Icon rendered before label     |
| `iconRight` | `ReactNode`                                 | —          | Icon rendered after label      |
| `disabled`  | `boolean`                                   | `false`    | Disabled state (50% opacity)   |

**Visual specs (from Figma):**
- Border radius: 46px (pill shape), Border width: 1px
- Padding: 12px top/bottom, 16px left/right
- Border color: theme color, Background: theme color at 50% opacity
- Hover: increased opacity (70%), Focus: ring with lighter shade

**Key design decisions:**
- Reuses the same `CardColor` type from Card to ensure color consistency across the design system.
- Supports optional icons on either side via `iconLeft`/`iconRight` slots, with a `gap-2` flex layout.
- Focus styles use `ring-2` with offset for accessibility compliance.

#### Input (`components/ui/Input.tsx`)

A themed text input with built-in password toggle functionality.

**Props:**
| Prop    | Type     | Default | Description                          |
| ------- | -------- | ------- | ------------------------------------ |
| `label` | `string` | —       | Optional label above the input       |
| `error` | `string` | —       | Error message displayed below        |
| `type`  | `string` | —       | When `'password'`, shows eye toggle  |

**Features:**
- **Password toggle** — When `type="password"`, an eye/eye-off icon button appears inside the input. Clicking it toggles between hidden and visible text.
- **Themed styling** — Uses `honey` palette for borders, placeholders, and focus states (`sunset` for focus ring).
- **Error state** — Red border and error message when validation fails.

**Key design decisions:**
- Eye icons are inline SVG components to avoid external icon library dependencies.
- The toggle button uses `tabIndex={-1}` to prevent it from interfering with form tab navigation.
- The input uses `pr-12` padding when in password mode to prevent text from overlapping the toggle icon.

### Phase 3: Molecules — Composed Components

#### NoteCard (`components/notes/NoteCard.tsx`)

The NoteCard composes the Card atom with note-specific content, following the layout from the design reference.

**Layout (top to bottom):**
1. **Date + Category** — Single row: bold "Mon DD" format followed by category name
2. **Title** — Large serif font (`font-serif text-2xl font-bold`)
3. **Description** — Body text, clamped to 3 lines

**Props:**
| Prop    | Type        | Default  | Description                   |
| ------- | ----------- | -------- | ----------------------------- |
| `note`  | `Note`      | —        | Note data object              |
| `color` | `CardColor` | `'jade'` | Theme color passed to Card    |

**Key design decisions:**
- The date is formatted inline as "Mon DD" (e.g. "Feb 15") to match the compact card layout, rather than using the full date format from the dates utility.
- The title uses `font-serif` (Inria Serif) for visual hierarchy and personality, while the rest of the card uses the default sans-serif (Inter).
- The description is clamped to 3 lines (`line-clamp-3`) to prevent overflow within the card's max height.
- The entire card is wrapped in a `Link` for navigation, with a hover shadow transition for interactivity feedback.

#### LoginForm / RegisterForm (`components/forms/`)

Both forms use React Query's `useMutation` to call the auth API, with client-side validation before submission.

| Form           | Validation                                                                 | On Success               |
| -------------- | -------------------------------------------------------------------------- | ------------------------ |
| **LoginForm**  | Email format only (no password rules — backend handles credential check)   | Store tokens, go to `/notes` |
| **RegisterForm** | Email format + password strength (8+ chars, upper, lower, digit, special) | Store tokens, go to `/notes` |

**Password validation rules** (defined in `lib/utils/validation.ts`):
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character (`!@#$%^&*(),.?":{}|<>`)

### Phase 4: Pages — Auth Screens

#### Auth Layout (`app/(auth)/layout.tsx`)

A centered layout with `bg-honey-100` background that wraps all auth pages. Provides consistent vertical spacing and max-width constraint (`max-w-md`).

#### Login Page (`app/(auth)/login/page.tsx`)

| Element        | Detail                                              |
| -------------- | --------------------------------------------------- |
| Image          | `plant.png` from `/public/assets/`                  |
| Heading        | "Yay, You're Back!" — `font-serif text-4xl`         |
| Form           | `LoginForm` (email + password)                      |
| Footer link    | "Oops! I've never been here before" → `/register`   |

#### Register Page (`app/(auth)/register/page.tsx`)

| Element        | Detail                                              |
| -------------- | --------------------------------------------------- |
| Image          | `cat.png` from `/public/assets/`                    |
| Heading        | "Yay, New Friend!" — `font-serif text-4xl`          |
| Form           | `RegisterForm` (email + password with validation)   |
| Footer link    | "We're already friends!" → `/login`                 |

**Key design decisions:**
- Both pages share the same vertical layout structure (image → heading → form → link) but with distinct personality through different images and messages.
- The playful, friendly copy ("Yay, New Friend!", "We're already friends!") reinforces the warm aesthetic of the color palette.
- Headings use `font-serif` (Inria Serif) with `font-light` weight for an elegant, editorial feel.

### Phase 5: Dashboard — Notes View

The main application screen after login, composed of a sidebar and the notes grid.

#### Dashboard Layout (`app/(dashboard)/layout.tsx`)

A passthrough layout — the notes page manages its own full-screen layout with sidebar since it needs client-side state for category filtering.

#### Sidebar (`components/layout/Sidebar.tsx`)

A static sidebar displaying categories fetched from the backend via React Query.

**Features:**
- **Category list** — Each category is shown with a colored dot matching the theme palette (sunset, honey, sage, jade — cycled by index).
- **Category filtering** — Clicking a category filters the notes list; clicking again deselects.
- **Logout button** — Positioned at the bottom of the sidebar; calls `logoutUser()` from AuthContext and redirects to `/login`.
- **Responsive** — Hidden on mobile (`hidden md:block`), with a simplified inline filter shown instead.

**Key design decisions:**
- Categories are assigned colors by index using a `getCategoryColor()` utility that cycles through the four theme colors. This ensures consistent color mapping without requiring a `color` field in the backend model.
- The sidebar uses `flex-col` with `flex-1` on the nav and `mt-auto` on the logout button to push it to the bottom regardless of category count.

#### Category Color Mapping (`lib/utils/categoryColors.ts`)

A utility that maps category indices to theme colors, used by both the Sidebar (dot colors) and NoteList (card colors):

```ts
const COLORS: CardColor[] = ['sunset', 'honey', 'sage', 'jade']
getCategoryColor(index) // cycles through colors
getCategoryDotClass(index) // returns Tailwind bg class for the dot
```

#### NoteList (`components/notes/NoteList.tsx`)

Renders the notes grid or an empty state.

**Empty state:**
- `bubletea.png` image centered in the viewport
- Message: "I'm just here waiting for your charming notes..." in serif font

**With notes:**
- Responsive grid: 1 column → 2 on `sm` → 3 on `lg`
- Each NoteCard receives a `color` prop derived from its category using the same `getCategoryColor()` utility

#### Notes Page (`app/(dashboard)/notes/page.tsx`)

The orchestrator page that wires everything together:

| Area           | Component / Behavior                                    |
| -------------- | ------------------------------------------------------- |
| Left sidebar   | `Sidebar` with categories + logout (hidden on mobile)   |
| Top right      | "+ New Note" `Button` (pill, honey color)                |
| Mobile filter  | Inline category chips (visible only on mobile)          |
| Content        | `NoteList` with filtered notes or empty state           |
| Loading        | Centered `Spinner` while notes are being fetched        |

**Key design decisions:**
- Category filtering is done client-side with `useMemo` — since the notes payload is small, this avoids extra API calls.
- The page uses `bg-honey-100` as background to match the design, consistent with the auth screens.
- Responsive behavior: on mobile the sidebar is hidden and replaced by compact category chips at the top.

#### API Routes Added

| Route                      | Proxies to              | Methods    |
| -------------------------- | ----------------------- | ---------- |
| `/api/categories`          | `/api/categories/`      | GET        |
| `/api/notes`               | `/api/notes/`           | GET, POST  |
| `/api/notes/[id]`          | `/api/notes/{id}/`      | GET, PATCH, DELETE |

### Phase 6: Note Editor — Create & Edit View

A full-screen editor that handles both note creation and editing, powered by Formik with auto-save.

#### Flow: Creating a New Note

1. User clicks "+ New Note" on the notes page.
2. The `/notes/new` page immediately creates a note in the backend with placeholder data (`title: "Untitled"`, `content: "."`, `category_id: 1`).
3. On success, the user is redirected (`router.replace`) to `/notes/{id}` — the editor view.
4. The editor strips the placeholder values and shows empty inputs with placeholders.

**Key design decisions:**
- Creating the note upfront ensures every edit is a PATCH to an existing resource, simplifying the auto-save logic (no need to handle "create vs. update" branching).
- `router.replace` is used instead of `push` so the "new" page doesn't appear in browser history.

#### NoteForm (`components/forms/NoteForm.tsx`)

The main editor component, built with **Formik** for form state management.

**Layout (top to bottom):**

| Area                | Component / Behavior                                            |
| ------------------- | --------------------------------------------------------------- |
| Top-left            | Category dropdown (pill button with colored dot + chevron)      |
| Top-right           | Saving indicator (spinner + "Saving...") and close button (X)  |
| Card — top-right    | "Last Edited: [date]" label                                    |
| Card — title        | `<input>` with serif font, placeholder "Note Title"             |
| Card — content      | `<textarea>` full height, placeholder "Pour your heart out..."  |
| Card — bottom-right | Voice dictation button (microphone icon)                        |

**Features:**

1. **Category dropdown** — Shows current category with colored dot. Opens a dropdown listing other categories. Selecting one immediately PATCHes the backend and changes the card color.

2. **Auto-save with debounce** — As the user types in title or content, a 1.5s debounce triggers a PATCH mutation. A spinner with "Saving..." appears during the save. Uses `useRef` for the timeout to avoid stale closures.

3. **Voice dictation** — Uses the Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`). Clicking the mic button starts continuous English speech recognition. Transcribed text is appended to the content field. The button pulses red while listening. Gracefully handles unsupported browsers with an alert.

4. **Card color** — The editor card uses the same `colorStyles` as the Card atom, dynamically changing based on the selected category.

5. **Close button** — Top-right X navigates back to `/notes`.

**Key design decisions:**
- Formik's `enableReinitialize` ensures the form stays in sync if the note data changes externally.
- The debounce ref is cleared on each keystroke, so only the final state after the user pauses is saved.
- Category changes bypass the debounce and save immediately since they're discrete actions.
- `SpeechRecognition` types are declared globally via a `declare global` block to avoid installing additional type packages.
- The editor card takes the full remaining screen height with `flex-1`, making it feel like a dedicated writing space.

#### Note Detail Page (`app/(dashboard)/notes/[id]/page.tsx`)

A client component that:
1. Extracts the `id` from route params using React 19's `use()`.
2. Fetches the note via React Query (`useQuery`).
3. Renders `NoteForm` once loaded, with a centered spinner while fetching.

#### Edit Redirect (`app/(dashboard)/notes/[id]/edit/page.tsx`)

Simply redirects to `/notes/[id]` — the edit and detail views are unified.

---

## Environment Variables

| Variable              | Description          | Default                     |
| --------------------- | -------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api` |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL     | `http://localhost:3000`     |
