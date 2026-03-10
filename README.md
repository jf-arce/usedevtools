# UseDevTools

Developer tools platform. Built with modern technologies to ensure maximum performance and scalability.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Turbopack)
- **Database & ORM:** PostgreSQL via [@neondatabase/serverless](https://neon.tech/) + [Prisma ORM 7](https://www.prisma.io/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Authentication:** [Better Auth](https://better-auth.com/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/usedevtools.git
cd usedevtools
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project based on an example file and add your credentials (Database, Authentication, etc.):

```env
DATABASE_URL="your-neon-connection-string"
```

### 4. Generate Prisma Client & Sync Database

```bash
npm run prisma:generate
npm run prisma:push
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 📝 Development Notes and Solved Issues

During the development of this application, we faced specific challenges associated with migrating to the latest versions of our tech stack. The problems and their respective solutions are documented below:

### 1. Conflict between Prisma ORM 7 and Turbopack (Next.js 16)

**The Problem:**
When trying to boot the Next.js 16 development server using Turbopack (`next dev`), the build failed when integrating Prisma ORM 7. Turbopack did not correctly detect the Prisma client types because they were dynamically generated and injected into the `node_modules/@prisma/client` folder as CommonJS modules (`prisma-client-js`). Due to Turbopack's hyper-aggressive caching, updates to internal modules inside `node_modules` were ignored, breaking the developer experience unless falling back to the old Webpack compiler (`next dev --webpack`).

**The Solution:**
To natively integrate both tools without disabling the fast Turbopack engine, we applied the following patterns to the project:

1. **Re-generating the client outside of `node_modules`:**
   In Prisma 7, it's possible to create a 100% static ESM module. To do this, we modified `prisma/schema.prisma` by changing the default provider and redirecting file creation to a controlled subfolder:

   ```prisma
   // prisma/schema.prisma
   generator client {
     provider = "prisma-client"
     output   = "./generated/client"
   }
   ```

2. **TypeScript Path Mapping (`tsconfig.json`):**
   To avoid breaking all existing imports consuming `@prisma/client` throughout our codebase (e.g., validations, components, server actions), we transparently configured a route alias in the `tsconfig.json` file:

   ```json
   "compilerOptions": {
     "paths": {
       "@/*": ["./src/*"],
       "@prisma/client": ["./prisma/generated/client"]
     }
   }
   ```

   Thanks to this, any import like `import { PrismaClient } from "@prisma/client";` is resolved internally by looking up the new `./prisma/generated/client` folder.

3. **Exclusion in `.gitignore`:**
   By pulling the generated types out of `node_modules`, they started living in the local working tree. We explicitly excluded the `/prisma/generated/client` folder in the `.gitignore` file to avoid pushing auto-generated build files (artifacts) into the repository.

4. **Enabled Turbopack in `package.json`:**
   We completely cleaned up the old `"dev": "next dev --webpack"` script, restoring its native value `"dev": "next dev"`, finally achieving millisecond compile and hot-reload times.
