# Fix: Prisma Client Resolution con Next.js 16 + Turbopack

## Contexto: Prisma 7 ya no genera en node_modules

En Prisma 7 el cliente **ya no se genera en `node_modules`**. El `output` es obligatorio en el schema y el cliente se genera en la carpeta que configures:

```prisma
generator client {
  provider = "prisma-client"
  output   = "./generated/client"
}
```

Esto genera dos entry points con propósitos distintos:

| Archivo | Exporta | Dónde se puede usar |
|---|---|---|
| `client.ts` | `PrismaClient`, namespace `Prisma`, enums, tipos de modelos | Solo servidor (usa `node:process`, `node:path`) |
| `browser.ts` | Enums, tipos de modelos | Server y client components |

## El problema original

El proyecto tenía tres issues encadenados:

1. **TypeScript no resolvía el alias** — `tsconfig.json` apuntaba al directorio `./prisma/generated/client` pero no había ningún `index.ts` adentro, por lo que TypeScript no podía resolver el módulo.

2. **`serverExternalPackages` rompía el runtime** — `@prisma/client` estaba en `serverExternalPackages`, lo que hacía que Node.js lo buscara en `node_modules` en tiempo de ejecución. Pero `node_modules/@prisma/client` está vacío en Prisma 7 con output custom (no genera `.prisma/client/default`).

3. **Client components tiraban error de build** — Al apuntar el alias a `client.ts`, los componentes cliente intentaban bundlear módulos de Node.js (`node:process`, `node:path`) que no son válidos en el browser.

## La solución

### `next.config.ts`
Se removió `@prisma/client` de `serverExternalPackages`. Como `node_modules/@prisma/client` está vacío en Prisma 7, externalizarlo hacía que el runtime falle.

```ts
serverExternalPackages: ["@prisma/adapter-neon"] // @prisma/client removido
```

### `tsconfig.json`
Se agregó un alias `@prisma/generated` apuntando a `browser.ts`:

```json
"@prisma/generated": ["./prisma/generated/client/browser"]
```

`browser.ts` es seguro para cualquier contexto (server y client). El alias cubre todos los archivos que solo necesitan enums y tipos de modelos — que es la gran mayoría.

No se creó alias para `client.ts` intencionalmente: al dejarlo como import relativo explícito queda claro que es un caso especial server-only, y evita que alguien lo importe accidentalmente desde un client component.

### Imports resultantes

Archivos que solo necesitan enums o tipos (components, validations, types):
```ts
import { PricingType } from "@prisma/generated"
```

Los únicos dos archivos que necesitan `PrismaClient` o el namespace `Prisma` importan directo:
```ts
// src/lib/db.ts — instancia el singleton de PrismaClient
import { PrismaClient } from "../../prisma/generated/client/client"

// src/data/get-tools.ts — necesita tipos de queries como Prisma.ToolWhereInput
import { Prisma } from "../../prisma/generated/client/client"
```

## Por qué solo esos 2 archivos usan `client.ts`

`PrismaClient` se instancia una sola vez en `db.ts` (patrón singleton) y el resto del código lo consume via `import { db } from "@/lib/db"`. Nadie más necesita importar `PrismaClient` directamente.

`get-tools.ts` es el único caso extra porque usa el namespace `Prisma` para tipar parámetros (`Prisma.ToolWhereInput`, `Prisma.ToolInclude`), que solo existe en `client.ts`.
