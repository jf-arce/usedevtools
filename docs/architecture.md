# Arquitectura del Proyecto - UseDevTools

Este documento describe la arquitectura, el stack tecnológico y las convenciones de organización de **UseDevTools**, una plataforma para el descubrimiento y gestión de herramientas para desarrolladores.

## 🚀 Stack Tecnológico

### Core

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) - Utilizando las últimas capacidades de React 19.
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) - Tipado estricto para mayor seguridad y mantenibilidad.
- **Runtime:** Node.js.

### Frontend & UI

- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/) - Configuración moderna mediante `@tailwindcss/postcss`.
- **Componentes:** [Shadcn UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) y [Base UI](https://base-ui.com/).
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/).
- **Iconos:** [Lucide React](https://lucide.dev/).
- **Formularios:** [React Hook Form](https://react-hook-form.com/) con validación [Zod](https://zod.dev/).

### Backend & Datos

- **Base de Datos:** PostgreSQL (vía [Neon Database](https://neon.tech/)).
- **ORM:** [Prisma 7](https://www.prisma.io/) - Con soporte para adaptadores serverless (`@prisma/adapter-neon`).
- **Autenticación:** [Better Auth](https://www.better-auth.com/) - Gestión completa de usuarios, sesiones y cuentas sociales.
- **API:** Next.js Server Actions para la mayoría de las mutaciones de datos.

---

## 📂 Estructura de Directorios (`src/`)

El proyecto sigue una organización modular basada en responsabilidades técnicas y funcionales:

| Directorio     | Responsabilidad                                                                                                                                          |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `actions/`     | **Server Actions**: Lógica de mutación de datos (POST/PUT/DELETE) que se ejecuta en el servidor.                                                         |
| `app/`         | **Rutas y Páginas**: Estructura de navegación usando App Router. Incluye grupos de rutas (`(protected)`), rutas dinámicas (`tool/[id]`) y API endpoints. |
| `components/`  | **Componentes de UI**: Divididos en `ui/` (base/átomos) y carpetas por funcionalidad (ej. `explore/`, `home/`, `new-tool/`).                             |
| `constants/`   | **Valores Estáticos**: Opciones de stack tecnológico, validaciones de dominios y configuraciones que no cambian.                                         |
| `data/`        | **Data Access Layer**: Funciones de solo lectura (Server-side) para consultar la base de datos de forma limpia.                                          |
| `hooks/`       | **Hooks de React**: Lógica reutilizable del lado del cliente.                                                                                            |
| `lib/`         | **Utilidades y Clientes**: Configuración de Prisma, clientes de autenticación, y funciones de utilidad general.                                          |
| `types/`       | **Definiciones TypeScript**: Interfaces y tipos globales compartidos en el proyecto.                                                                     |
| `validations/` | **Esquemas de Zod**: Validaciones compartidas entre el cliente (formularios) y el servidor (acciones).                                                   |

---

## 🛠 Patrones de Diseño Clave

### 1. Server-First Architecture

Se prioriza el uso de **Server Components** para el renderizado inicial y la obtención de datos, minimizando el JavaScript enviado al cliente. Las interacciones de escritura se gestionan mediante **Server Actions**.

### 2. Capa de Acceso a Datos (DAL)

Para evitar la dispersión de consultas Prisma por todos los componentes, la lógica de consulta reside en `src/data/`. Esto facilita la reutilización y el mantenimiento de las queries.

### 3. Validación de Extremo a Extremo

Los esquemas de **Zod** en `src/validations/` actúan como la única fuente de verdad para la validación de datos, asegurando que tanto los formularios de `react-hook-form` como las Server Actions manejen datos válidos y tipados.

### 4. Autenticación Robusta

Utilizamos **Better Auth** para gestionar de forma segura el flujo de usuarios, integrándose directamente con el esquema de base de datos de Prisma y proporcionando hooks tanto para cliente como para servidor.

---

## 📊 Modelo de Datos (Prisma)

El esquema de base de datos gira en torno a las siguientes entidades principales:

- **User:** Perfil de usuario y credenciales.
- **Tool:** La entidad central (herramientas registradas).
- **Category & SubCategory:** Clasificación jerárquica de herramientas.
- **Technology:** Stack tecnológico asociado a cada herramienta (Relación Muchos a Muchos).
- **Vote & Favorite:** Interacciones sociales para ranking y personalización.
