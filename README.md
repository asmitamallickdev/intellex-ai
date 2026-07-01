This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database Layer Configuration (Neon + pgvector)

Intellex AI integrates with **Neon PostgreSQL** and uses **pgvector** for vector search similarity.

### 1. Configure Neon
1. Create a project in [Neon Console](https://neon.tech).
2. Neon provides two connection strings in your dashboard:
   - **Connection Pooling (`DATABASE_URL`)**: Pooled connection hostname (includes `-pooler`) for application runtime.
   - **Direct Connection (`DIRECT_URL`)**: Direct connection hostname for database migrations.

### 2. Environment Variables
Create a `.env` file in the project root containing your Neon credentials (reference [.env.example](file:///d:/intellex-ai/.env.example)):
```env
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require"
DIRECT_URL="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require"
```

### 3. Enable pgvector
Our `prisma/schema.prisma` is pre-configured to register `pgvector` under database extensions:
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  extensions = [pgvector(map: "vector")]
}
```

### 4. Database Commands & Scripts
Run these scripts using `npm run`:

*   **Generate Prisma Client**: Updates the client types after schema changes.
    ```bash
    npm run prisma:generate
    ```
*   **Run Migrations (Development)**: Generates and executes database migrations on your direct Neon connection.
    ```bash
    npm run prisma:migrate:dev
    ```
*   **Run Migrations (Production)**: Deploys migration files directly.
    ```bash
    npm run prisma:migrate:deploy
    ```
*   **Database Push**: Syncs schema models to the database without migration logs (useful for fast prototyping).
    ```bash
    npm run prisma:db:push
    ```
*   **Open Prisma Studio**: Launches a visual database GUI workspace at `http://localhost:5555`.
    ```bash
    npm run prisma:studio
    ```
