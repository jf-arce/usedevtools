import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain)
	 * En Next.js no necesitamos baseURL si el cliente y el servidor
	 * están en el mismo dominio, pero ponerlo ayuda a evitar errores.
	 */
	baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signUp, useSession, signOut } = createAuthClient();
