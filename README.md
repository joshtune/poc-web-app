# Web App with Supabase Authentication

A modern web application built with SvelteKit and Supabase authentication, featuring beautiful UI components from Flowbite.

## Features

- 🔐 Complete authentication system (login, register, password reset)
- 🎨 Modern UI with Flowbite components
- ⚡ Fast development with SvelteKit
- 🔒 Secure authentication with Supabase
- 📱 Responsive design

## Setup

### 1. Install Dependencies

```sh
pnpm install
```

### 2. Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env` file in the project root:

```env
VITE_PUBLIC_SUPABASE_URL=your_supabase_project_url
VITE_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Database Setup

In your Supabase dashboard, enable the following authentication providers:

1. **Email Authentication**: Already enabled by default
2. **Google OAuth** (optional):
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials

### 4. Development

Start the development server:

```sh
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Authentication Pages

- `/login` - Sign in with email/password or Google
- `/register` - Create new account with email verification
- `/forgot-password` - Request password reset email
- `/reset-password` - Reset password with secure token

## Building

To create a production version of your app:

```sh
pnpm build
```

You can preview the production build with `pnpm preview`.

## Tech Stack

- **Frontend**: SvelteKit, TypeScript, Tailwind CSS
- **UI Components**: Flowbite Svelte
- **Authentication**: Supabase Auth
- **Package Manager**: pnpm

## Environment Variables

Make sure to set these environment variables:

- `VITE_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `VITE_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
