export interface GithubStats {
	stars: number;
	forks: number;
	openIssues: number;
	license: string | null;
	repoUrl: string;
	owner: string;
	repo: string;
	createdAt: string;
	npmDownloads?: number;
}

export async function getGithubStats(siteUrl: string): Promise<GithubStats | null> {
	try {
		let repoUrl = siteUrl;

		// Si no es una URL de GitHub, intenta buscar un enlace a GitHub en la página principal
		if (!siteUrl.includes("github.com")) {
			try {
				// Hacemos fetch a la página de la herramienta (Time out corto para no bloquear)
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 5000);

				const res = await fetch(siteUrl, {
					signal: controller.signal,
					next: { revalidate: 86400 }, // Caché por 1 día
					headers: {
						"User-Agent": "usedevtools-bot/1.0",
					},
				});
				clearTimeout(timeoutId);

				if (res.ok) {
					const html = await res.text();
					// Busca enlaces que vayan a github.com/owner/repo
					const match = html.match(
						/href="https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)[^"]*"/,
					);

					if (match) {
						const owner = match[1];
						const repo = match[2];
						// Ignorar enlaces genéricos de GitHub
						if (owner !== "sponsors" && owner !== "features" && owner !== "about") {
							repoUrl = `https://github.com/${owner}/${repo}`;
						}
					}
				}
			} catch (e) {
				console.error("No se pudo obtener el HTML de la página web:", siteUrl, e);
			}
		}

		if (repoUrl.includes("github.com")) {
			// Extraer owner y repo
			const urlObj = new URL(repoUrl);
			const pathParts = urlObj.pathname.split("/").filter(Boolean);

			if (pathParts.length >= 2) {
				const owner = pathParts[0];

				// Remover posible .git del nombre del repo
				let repo = pathParts[1];
				if (repo.endsWith(".git")) {
					repo = repo.slice(0, -4);
				}

				const apiRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
					next: { revalidate: 3600 }, // Caché de la API por 1 hora
					headers: {
						"User-Agent": "usedevtools-app",
						Accept: "application/vnd.github.v3+json",
					},
				});

				if (apiRes.ok) {
					const data = await apiRes.json();

					// Intentar obtener descargas semanales de NPM (si el paquete existe con el mismo nombre)
					let npmDownloads = 0;
					try {
						const npmRes = await fetch(`https://api.npmjs.org/downloads/point/last-week/${repo}`, {
							next: { revalidate: 86400 },
						});
						if (npmRes.ok) {
							const npmData = await npmRes.json();
							npmDownloads = npmData.downloads || 0;
						}
					} catch (e) {
						// Ignorar errores de NPM si no es un paquete JS/TS
					}

					return {
						stars: data.stargazers_count,
						forks: data.forks_count,
						openIssues: data.open_issues_count,
						license: data.license?.name || null,
						repoUrl: data.html_url,
						owner: data.owner.login,
						repo: data.name,
						createdAt: data.created_at,
						npmDownloads: npmDownloads > 0 ? npmDownloads : undefined,
					};
				}
			}
		}
	} catch (e) {
		console.error("Falló la obtención de estadísticas de GitHub para", siteUrl, e);
	}

	return null;
}
