"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LogoutButton() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleLogout = async () => {
		setIsLoading(true);

		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						toast.success("Successfully signed out");
						// Redirect to home page after successful logout
						router.push("/");
						router.refresh(); // Refresh to clear session state
					},
					onError: () => {
						toast.error("Error signing out");
						// Even if there's an error, redirect to home
						router.push("/");
						router.refresh();
					},
				},
			});
		} catch {
			toast.error("Error signing out");
			// Fallback redirect in case of error
			router.push("/");
			router.refresh();
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button variant="outline" size="default" className="" onClick={handleLogout} disabled={isLoading}>
			{isLoading ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Signing out...
				</>
			) : (
				<>
					<LogOut className="mr-2 h-4 w-4" />
					Sign Out
				</>
			)}
		</Button>
	);
}
