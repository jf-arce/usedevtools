export interface GithubRelease {
	tag: string;
	name: string;
	date: string;
	url: string;
}

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
	npmTrend?: number;
	releases?: GithubRelease[];
	docsUrl?: string;
	installUrl?: string;
	hasDiscussions?: boolean;
	hasWiki?: boolean;
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

					// Fetch NPM downloads, NPM trend, releases en paralelo
					const [npmDownloads, npmTrend, releases] = await Promise.all([
						fetch(`https://api.npmjs.org/downloads/point/last-week/${repo}`, {
							next: { revalidate: 86400 },
						})
							.then((r) => (r.ok ? r.json() : null))
							.then((d) => d?.downloads || 0)
							.catch(() => 0),
						fetch(`https://api.npmjs.org/downloads/range/last-month/${repo}`, {
							next: { revalidate: 86400 },
						})
							.then((r) => (r.ok ? r.json() : null))
							.then((d) => {
								if (!d?.downloads?.length) return undefined;
								const days = d.downloads as { day: string; downloads: number }[];
								const mid = Math.floor(days.length / 2);
								const firstHalf = days.slice(0, mid).reduce((s: number, d: any) => s + d.downloads, 0);
								const secondHalf = days.slice(mid).reduce((s: number, d: any) => s + d.downloads, 0);
								if (firstHalf === 0) return undefined;
								return Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
							})
							.catch(() => undefined as number | undefined),
						fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=5`, {
							next: { revalidate: 3600 },
							headers: {
								"User-Agent": "usedevtools-app",
								Accept: "application/vnd.github.v3+json",
							},
						})
							.then((r) => (r.ok ? r.json() : []))
							.then((items: any[]) =>
								items.map((r: any) => ({
									tag: r.tag_name,
									name: r.name || r.tag_name,
									date: r.published_at,
									url: r.html_url,
								})),
							)
							.catch(() => [] as GithubRelease[]),
					]);

					// Resolver docs URL: intentar /docs primero, fallback a homepage
					let docsUrl: string | undefined;
					const homepage = data.homepage as string | undefined;
					if (homepage && homepage !== data.html_url) {
						try {
							const docsController = new AbortController();
							const docsTimeout = setTimeout(() => docsController.abort(), 3000);
							const docsPath = homepage.replace(/\/$/, "") + "/docs";
							const docsRes = await fetch(docsPath, {
								method: "HEAD",
								signal: docsController.signal,
								redirect: "follow",
								headers: { "User-Agent": "usedevtools-bot/1.0" },
							});
							clearTimeout(docsTimeout);
							docsUrl = docsRes.ok ? docsPath : homepage;
						} catch {
							docsUrl = homepage;
						}
					}

					// Buscar URL de instalación: probar rutas comunes bajo docsUrl
					let installUrl: string | undefined;
					if (docsUrl) {
						const base = docsUrl.replace(/\/$/, "");
						const candidates = [
							`${base}/installation`,
							`${base}/getting-started`,
							`${base}/get-started`,
							`${base}/docs/installation`,
						];
						for (const candidate of candidates) {
							try {
								const ctrl = new AbortController();
								const tid = setTimeout(() => ctrl.abort(), 3000);
								const res = await fetch(candidate, {
									method: "HEAD",
									signal: ctrl.signal,
									redirect: "follow",
									headers: { "User-Agent": "usedevtools-bot/1.0" },
								});
								clearTimeout(tid);
								if (res.ok) {
									installUrl = candidate;
									break;
								}
							} catch {
								// try next
							}
						}
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
						npmTrend: npmTrend !== undefined && Math.abs(npmTrend) >= 1 ? npmTrend : undefined,
						releases: releases.length > 0 ? releases : undefined,
						docsUrl,
						installUrl,
						hasDiscussions: data.has_discussions || false,
						hasWiki: data.has_wiki || false,
					};
				}
			}
		}
	} catch (e) {
		console.error("Falló la obtención de estadísticas de GitHub para", siteUrl, e);
	}

	return null;
}
