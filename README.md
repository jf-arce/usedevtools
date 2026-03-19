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
