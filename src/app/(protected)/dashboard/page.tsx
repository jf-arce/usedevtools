import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, ExternalLink, Toolbox, Settings } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect("/");

	// Traemos solo las herramientas del usuario actual
	const userTools = await db.tool.findMany({
		where: { userId: session.user.id },
		include: { category: true },
		orderBy: { createdAt: "desc" },
	});

	return (
		<div className="py-10 space-y-8">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Mi Panel</h1>
					<p className="text-muted-foreground">Gestiona las herramientas que has compartido.</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/new">
						<PlusCircle className="mr-2 h-4 w-4" />
						Nueva Herramienta
					</Link>
				</Button>
			</div>

			{/* Stats rápidas */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Publicadas</CardTitle>
						<PlusCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{userTools.length}</div>
					</CardContent>
				</Card>
			</div>

			{/* Lista de herramientas */}
			<div className="rounded-md border bg-card">
				<div className="p-4 border-b">
					<h2 className="font-semibold">Mis aportes</h2>
				</div>
				{userTools.length === 0 ? (
					<div className="p-8 text-center text-muted-foreground">
						Aún no has compartido ninguna herramienta. ¡Empieza ahora!
					</div>
				) : (
					<div className="divide-y">
						{userTools.map((tool) => (
							<div
								key={tool.id}
								className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
							>
								<div>
									<h3 className="font-medium">{tool.title}</h3>
									<div className="flex gap-2 items-center">
										<span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
											{tool.category.name}
										</span>
										<span className="text-xs text-muted-foreground">
											{new Date(tool.createdAt).toLocaleDateString()}
										</span>
									</div>
								</div>
								<div className="flex gap-2">
									<Button variant="ghost" size="icon" asChild>
										<a href={tool.url} target="_blank" rel="noreferrer">
											<ExternalLink className="h-4 w-4" />
										</a>
									</Button>
									{/* Aquí podrías añadir un botón de editar más adelante */}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
