# Web App with Supabase Authentication

A modern web application built with SvelteKit and Supabase authentication, featuring beautiful UI components from Flowbite.

## Features

- 🔐 Complete authentication system (login, register, password reset)
- 🎨 Modern UI with Flowbite components
- ⚡ Fast development with SvelteKit
- 🔒 Secure authentication with Supabase
- 📱 Responsive design

## Setup

### Prerequisites

- **Docker**: Required for local Supabase development
  - Install Docker Desktop from [docker.com](https://docker.com)
  - Make sure Docker is running before starting Supabase locally

### 1. Install Dependencies

```sh
pnpm install
```

### 2. Local Development Setup

#### Option A: Local Supabase (Recommended for Development)

1. **Start Supabase locally**:

   ```sh
   pnpm supabase:start
   ```

   This will start all Supabase services locally using Docker.

2. **Copy the local credentials** from the terminal output and create a `.env` file:

```env
VITE_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
VITE_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key_from_terminal
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key_from_terminal
```

3. **Access Supabase Studio** at `http://localhost:54323` to manage your local database

#### Option B: Remote Supabase (Production-like)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env` file in the project root:

```env
VITE_PUBLIC_SUPABASE_URL=your_supabase_project_url
VITE_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Database Setup

In your Supabase dashboard (local or remote), enable the following authentication providers:

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

### 5. Available Supabase Commands

```sh
# Start local Supabase services
pnpm supabase:start

# Stop local Supabase services
pnpm supabase:stop

# Check status of local services
pnpm supabase:status

# Reset local database
pnpm supabase:reset

# Open Supabase Studio (web interface)
pnpm supabase:studio

# Generate TypeScript types from your database schema
pnpm supabase:gen-types
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
- `SUPABASE_SERVICE_ROLE_KEY`: Required for admin-only features such as listing all users (keep this private; never expose it to the client)

## Troubleshooting

### Docker Issues

If you encounter Docker-related errors:

1. **Make sure Docker Desktop is running**
2. **Check Docker status**: `docker --version`
3. **Restart Docker Desktop** if needed
4. **Try running Supabase commands with sudo** (Linux/macOS)

### Supabase Local Development

- **First time setup**: `pnpm supabase:start` may take a few minutes to download Docker images
- **Port conflicts**: Make sure ports 54321-54327 are available
- **Reset local database**: `pnpm supabase:reset` if you need a fresh start

### Authentication Issues

- **Local development**: Use the credentials from `pnpm supabase:start` output
- **Email confirmation**: Disabled by default in local development
- **OAuth providers**: Configure in Supabase Studio (local or remote)

## Local Development URLs

When running Supabase locally, you can access:

- **Supabase Studio**: `http://localhost:54323`
- **API**: `http://127.0.0.1:54321`
- **Database**: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- **Inbucket (Email testing)**: `http://localhost:54324`

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
