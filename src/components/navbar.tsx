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
import { LogOut, PlusCircle, LayoutDashboard, Layers } from "lucide-react";
import { UseDevToolsIcon } from "./icons";
import { GithubDark } from "./ui/svgs/githubDark";
import { Loader } from "./loader";
import { useState } from "react";

export default function Navbar() {
	const { data: session, isPending } = useSession();
	const [signInLoading, setSignInLoading] = useState(false);

	const handleGithubSignIn = async () => {
		setSignInLoading(true);
		try {
			await signIn.social({ provider: "github" });
		} catch (err) {
			console.error("GitHub sign-in failed", err);
			setSignInLoading(false);
		}
	};

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link href="/" className="flex gap-1 items-center font-bold text-xl tracking-tight">
					<UseDevToolsIcon className="h-6 w-6" />
					<span>
						UseDev
						<span className="text-tertiary">Tools.</span>
					</span>
				</Link>

				<div className="flex items-center gap-4">
					{isPending ? (
						<div className="flex items-center gap-4">
							<div className="flex gap-2">
								<div className="h-9 w-9 rounded-md bg-muted/60 animate-pulse" />
								<div className="h-9 w-24 rounded-md bg-muted/60 animate-pulse" />
							</div>
							<div className="h-9 w-32 rounded-md bg-muted/60 animate-pulse" />
						</div>
					) : session ? (
						<div className="flex items-center gap-4">
							<Button variant="ghost" asChild>
								<Link href="https://github.com/jf-arce/usedevtools" target="_blank">
									<GithubDark />
								</Link>
							</Button>

							<div className="flex gap-2">
								<Button variant="outline" asChild>
									<Link href="/explore" className="flex items-center gap-2">
										<Layers />
										Explore
									</Link>
								</Button>

								<Button variant="outline" asChild className="hidden sm:flex">
									<Link href="/dashboard" className="flex items-center gap-2">
										<LayoutDashboard />
										Dashboard
									</Link>
								</Button>
							</div>

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
											Dashboard
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="text-red-600 focus:text-red-600"
										onClick={() => signOut()}
									>
										<LogOut className="mr-2 h-4 w-4" />
										Sign out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<div className="flex gap-2">
								<Button variant="ghost" asChild>
									<Link href="https://github.com/jf-arce/usedevtools" target="_blank">
										<GithubDark />
									</Link>
								</Button>
								<Button variant="ghost" asChild>
									<Link href="/explore" className="flex items-center gap-2 font-semibold">
										<Layers />
										Explore
									</Link>
								</Button>
							</div>
							<div className="flex gap-2">
								<Button
									variant="default"
									className="font-semibold"
									onClick={handleGithubSignIn}
									disabled={signInLoading}
									aria-busy={signInLoading}
								>
									{signInLoading ? <Loader /> : "Continue with GitHub"}
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
