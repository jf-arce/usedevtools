import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PlusCircle, Bookmark, UploadCloud, Star, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function DashboardLoading() {
	return (
		<main className="py-8 space-y-8 container mx-auto px-4 sm:px-6">
			{/* Top Bar Header - Totalmente Estático, sin Skeletons */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
					<p className="text-muted-foreground mt-1">
						Quickly access your favorite tools or manage those you contributed.
					</p>
				</div>
				<Button asChild className="shrink-0 group">
					<Link href="/dashboard/new">
						<PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
						Submit a Tool
					</Link>
				</Button>
			</div>

			{/* Stats Overview - Cajas estáticas, números en Skeleton */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card className="bg-linear-to-br from-card to-card/50 overflow-hidden relative">
					<div className="absolute -right-4 -bottom-4 opacity-5">
						<Bookmark className="w-32 h-32" />
					</div>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
						<CardTitle className="text-sm font-medium">Saved Favorites</CardTitle>
						<Bookmark className="h-4 w-4 text-white" />
					</CardHeader>
					<CardContent className="relative z-10">
						<Skeleton className="h-9 w-16 mb-1 rounded-md" />
						<p className="text-xs text-muted-foreground mt-1">Tools for quick search</p>
					</CardContent>
				</Card>

				<Card className="bg-linear-to-br from-card to-card/50 overflow-hidden relative">
					<div className="absolute -right-4 -bottom-4 opacity-5">
						<UploadCloud className="w-32 h-32" />
					</div>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
						<CardTitle className="text-sm font-medium">My Tools</CardTitle>
						<UploadCloud className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent className="relative z-10">
						<Skeleton className="h-9 w-16 mb-1 rounded-md" />
						<p className="text-xs text-muted-foreground mt-1">Contributions to the community</p>
					</CardContent>
				</Card>

				<Card className="bg-linear-to-br from-card to-card/50 overflow-hidden relative">
					<div className="absolute -right-4 -bottom-4 opacity-5">
						<Star className="w-32 h-32" />
					</div>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
						<CardTitle className="text-sm font-medium">Votes Received</CardTitle>
						<Star className="h-4 w-4 text-yellow-500 border-yellow-500" fill="currentColor" />
					</CardHeader>
					<CardContent className="relative z-10">
						<Skeleton className="h-9 w-16 mb-1 rounded-md" />
						<p className="text-xs text-muted-foreground mt-1">Total likes on your contributions</p>
					</CardContent>
				</Card>
			</div>

			{/* Interactive Zone */}
			<div className="space-y-6">
				<Tabs defaultValue="favorites" className="w-full pointer-events-none">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
						<div className="flex-1 w-full max-w-sm">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input placeholder="Search by name..." disabled className="pl-9" />
							</div>
						</div>

						<TabsList className="shrink-0">
							<TabsTrigger value="favorites" disabled className="flex items-center">
								<Bookmark className="w-4 h-4 mr-2" />
								Favorites <Skeleton className="h-3 w-4 ml-2 rounded-sm" />
							</TabsTrigger>
							<TabsTrigger value="uploads" disabled className="flex items-center">
								<UploadCloud className="w-4 h-4 mr-2" />
								My Tools <Skeleton className="h-3 w-4 ml-2 rounded-sm" />
							</TabsTrigger>
						</TabsList>
					</div>

					{/* Filters Zone */}
					<div className="flex flex-col md:flex-row gap-3 items-center mb-6 p-3 rounded-lg border">
						<Button variant="outline" disabled className="w-full md:w-48 justify-start">
							<SlidersHorizontal className="w-4 h-4 mr-2 text-muted-foreground" />
							Category
						</Button>
						<Skeleton className="h-10 w-full md:flex-1 max-w-sm rounded-md" />
					</div>
				</Tabs>

				{/* Cards Grid Skeleton (Server Response Pending) */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{[...Array(4)].map((_, i) => (
						<Card
							key={i}
							className="py-1! relative overflow-hidden border-neutral-800 bg-neutral-900/50 flex flex-col h-full min-h-72.5"
						>
							<CardHeader className="p-6 pb-0">
								<div className="flex items-start justify-between">
									<Skeleton className="h-14 w-14 rounded-xl" />
									<Skeleton className="h-9 w-9 rounded-lg" />
								</div>
								<div className="mt-4 flex flex-col gap-2">
									<Skeleton className="h-7 w-3/4" />
									<Skeleton className="h-5 w-16 rounded-full mt-1" />
								</div>
							</CardHeader>
							<CardContent className="p-6 pt-2 grow flex flex-col justify-end">
								<div className="space-y-2 mt-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-5/6" />
								</div>
							</CardContent>
							<CardFooter className="flex items-center justify-between p-6 pt-0 mt-auto">
								<div className="flex items-center gap-2">
									<Skeleton className="h-9 w-10 rounded-md" />
									<Skeleton className="h-9 w-14 rounded-md" />
								</div>
								<Skeleton className="h-4 w-16" />
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</main>
	);
}
