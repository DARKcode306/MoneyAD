
# Money DRC - Rewards Platform

A web-based rewards platform built with React, Express, and PostgreSQL.

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Neon Database account (for deployment)

## Tech Stack

- Frontend: React + Vite + TypeScript
- Backend: Express.js + TypeScript
- Database: PostgreSQL with Drizzle ORM
- Styling: Tailwind CSS + shadcn/ui

## Getting Started

1. Clone the repository on Replit
2. Set up environment variables in Replit Secrets:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: Random string for session encryption
   - `ADMIN_USERNAME`: Admin panel username
   - `ADMIN_PASSWORD`: Admin panel password

3. Install dependencies:
```bash
npm install
```

4. Push database schema:
```bash
npm run db:push
```

5. Start development server:
```bash
npm run dev
```

The app will be available at http://0.0.0.0:5000

## Database Setup

This project uses Drizzle ORM with PostgreSQL. The schema is defined in `shared/schema.ts`.

To set up the database:

1. Create a new PostgreSQL database
2. Add the database URL to Replit Secrets as `DATABASE_URL`
3. Run migrations: `npm run db:push`

## Development

- Frontend code is in the `client/src` directory
- Backend code is in the `server` directory
- Shared types and schema are in `shared` directory

## Deployment

1. Go to the Deployment tab in Replit
2. Choose "Deploy to Production"
3. The app will be built and deployed automatically

## Project Structure

```
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities and helpers
├── server/               # Backend Express application
│   ├── routes.ts        # API routes
│   └── db.ts           # Database connection
└── shared/              # Shared code between frontend and backend
    └── schema.ts       # Database schema
```

## API Routes

- `/api/tasks` - Task management
- `/api/currencies` - Currency management
- `/api/withdrawal-methods` - Withdrawal methods
- `/api/admin/*` - Admin panel routes

## License

MIT
