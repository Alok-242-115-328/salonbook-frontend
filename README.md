# SalonBook Client

Next.js App Router + TypeScript + Tailwind CSS frontend for the SalonBook appointment booking platform.

## Important features

- Responsive salon-themed UI with light/dark mode, animated gradient backgrounds and subtle image motion
- Public home, dynamic services, search, category filtering and price sorting
- Better Auth email/password and Google sign-in/sign-up with password rules and image upload
- Protected service details and booking with duplicate slot conflict feedback
- Role-based customer and admin dashboards with guarded routes
- Customer appointment tracking, cancellation and Stripe Checkout redirection
- Admin service CRUD, appointment management, user block/unblock and transaction viewing
- Toast notifications, loading states and custom error pages

## Technology stack

Next.js 16, React 19, TypeScript, Tailwind CSS, Better Auth client, Sonner, Lucide icons, next-themes.

## Installation

```bash
npm install
cp .env.local.example .env.local
```

Update `.env.local` with the running server URL. Never commit `.env.local`.

## Required environment variables

`NEXT_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_CLIENT_URL`

## Run locally

```bash
npm run build
npm start
```

Open `http://localhost:3000`. Start the server first on `http://localhost:5000`.

## Scripts

- `npm run build` - production build
- `npm start` - serve production build
- `npm run typecheck` - TypeScript validation
- `npm run lint` - Next.js lint

## First admin account

On a fresh database, the first user who signs up receives the admin role. Later public sign-ups are customers. For controlled admin setup beyond the first account, configure `ADMIN_PIN` on the server and use `POST /api/admin/promote`.

## Deployment

Set both public environment variables to the deployed client and server URLs. Ensure the server CORS `CLIENT_URL` matches the deployed client exactly. Use HTTPS in production so Better Auth cookies and Stripe Checkout work correctly.

## Repository

Client repository: add its GitHub URL after pushing this folder as its own repository.
