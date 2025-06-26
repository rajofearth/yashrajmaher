# Authentication Setup

This project uses **Better Auth** with **Prisma** for authentication. The setup includes secure login, signup, and
dashboard protection.

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-key-here-make-it-long-and-random"
BETTER_AUTH_URL="http://localhost:3000"

# Client-side environment variables (must start with NEXT_PUBLIC_)
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# For production, use your actual domain:
# BETTER_AUTH_URL="https://yourdomain.com"
# NEXT_PUBLIC_BETTER_AUTH_URL="https://yourdomain.com"
```

## Features

### ✅ Secure Authentication

- Email & Password authentication using Better Auth
- Server-side validation with Zod schemas
- CSRF protection and secure session management

### ✅ Protected Routes

- Dashboard routes are automatically protected via middleware
- Unauthorized users are redirected to login
- Authenticated users on login/signup pages are redirected to dashboard

### ✅ Form Handling

- Server Actions for authentication
- Real-time form validation with error display
- Loading states and proper UX feedback

### ✅ User Management

- User profile display with avatar support
- Account information and stats
- Secure logout functionality

## Routes

- `/login` - Sign in page
- `/signup` - Create account page
- `/dashboard` - Protected dashboard (requires authentication)

## Database Schema

The User model includes:

- `id` - Unique identifier
- `name` - Full name
- `email` - Email address (unique)
- `emailVerified` - Email verification status
- `image` - Profile image URL (optional)
- `createdAt` / `updatedAt` - Timestamps

## Setup Instructions

1. **Install dependencies** (already done):

   ```bash
   npm install better-auth prisma @prisma/client zod
   ```

2. **Set up environment variables** in `.env.local`

3. **Run Prisma migrations**:

   ```bash
   npx prisma migrate dev
   ```

4. **Generate Prisma client**:

   ```bash
   npx prisma generate
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

## Security Features

- **Server Actions**: All authentication logic runs on the server
- **Input Validation**: Zod schemas validate all form inputs
- **Session Management**: Better Auth handles secure sessions
- **CSRF Protection**: Built-in protection against CSRF attacks
- **Middleware Protection**: Route-level authentication checks

## File Structure

```
app/
├── (auth)/
│   ├── actions.js           # Server actions for auth
│   ├── login/
│   │   ├── page.jsx         # Login page
│   │   └── login-form.jsx   # Login form component
│   └── signup/
│       ├── page.jsx         # Signup page
│       └── signup-form.jsx  # Signup form component
├── (admin)/
│   └── dashboard/
│       └── page.jsx         # Protected dashboard
├── auth.js                  # Better Auth configuration
└── api/auth/
    ├── session/
    │   └── route.js         # Session check API endpoint
    └── [...all]/
        └── route.js         # Auth API endpoints

lib/
├── auth-client.js           # Client-side auth utilities
└── types.js                 # Zod schemas

middleware.js                # Route protection middleware
prisma/db.js                 # Prisma client
```

## Usage Examples

### Server-side Authentication Check

```jsx
import { headers } from "next/headers";
import { auth } from "@/app/auth";

export default async function ProtectedPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	return <div>Welcome {session.user.name}!</div>;
}
```

### Client-side Authentication

```jsx
"use client";
import { useSession } from "@/lib/auth-client";

export default function ClientComponent() {
	const { data: session, isPending } = useSession();

	if (isPending) return <div>Loading...</div>;
	if (!session) return <div>Please login</div>;

	return <div>Hello {session.user.name}!</div>;
}
```

## Recent Updates & Fixes

### ✅ React 19 Compatibility

- Updated `useFormState` to `useActionState` in login/signup forms
- Fixed import statements for React 19
- Updated form handling to use latest React APIs

### ✅ Prisma Edge Runtime Fix

- Removed direct Prisma usage from middleware (Edge Runtime incompatible)
- Created dedicated `/api/auth/session` route for auth checks
- Middleware now uses fetch to validate authentication

### ✅ Better Auth Configuration

- Added comprehensive trusted origins (localhost, network, production)
- Configured proper secret and session management
- Fixed middleware redirect loops and hydration issues

## Troubleshooting

1. **Database Connection**: Ensure your PostgreSQL database is running and the `DATABASE_URL` is correct
2. **Environment Variables**: Make sure all required env vars are set in `.env.local`
3. **Prisma**: Run `npx prisma generate` after any schema changes
4. **CORS Issues**: Ensure `BETTER_AUTH_URL` matches your actual domain in production
5. **React 19**: Use `useActionState` instead of deprecated `useFormState`
6. **Middleware Issues**: Check that `/api/auth/session` route is working correctly
