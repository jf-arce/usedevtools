"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, PlusCircle, LayoutDashboard, Github } from "lucide-react";

export default function Navbar() {
	const { data: session, isPending } = useSession();

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
					usedevtools.
				</Link>

				<div className="flex items-center gap-4">
					{isPending ? (
						<div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
					) : session ? (
						<div className="flex items-center gap-4">
							<Button variant="outline" size="sm" asChild>
								<Link href="https://github.com/jf-arce/usedevtools" target="_blank">
									<Github />
								</Link>
							</Button>

							<Button variant="outline" size="sm" asChild className="hidden sm:flex">
								<Link href="/new-tool" className="flex">
									<PlusCircle />
									Add Tool
								</Link>
							</Button>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="relative h-9 w-9 rounded-full">
										<Avatar className="h-9 w-9">
											<AvatarImage src={session.user.image || ""} alt={session.user.name} />
											<AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56" align="end" forceMount>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">{session.user.name}</p>
											<p className="text-xs leading-none text-muted-foreground">
												{session.user.email}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/dashboard">
											<LayoutDashboard className="mr-2 h-4 w-4" />
											Panel de Control
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="text-red-600 focus:text-red-600"
										onClick={() => signOut()}
									>
										<LogOut className="mr-2 h-4 w-4" />
										Cerrar Sesión
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => signIn.social({ provider: "github" })}
							>
								<Github className="mr-2 h-4 w-4" />
								GitHub
							</Button>
							<Button size="sm" onClick={() => signIn.social({ provider: "google" })}>
								Empezar
							</Button>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
