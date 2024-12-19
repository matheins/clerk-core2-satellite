"use client";

import { UserButton as ClerkUserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const DotIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			fill="currentColor"
		>
			<title>Dot Icon</title>
			<path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
		</svg>
	);
};

export function UserButton() {
	const { signOut } = useAuth();

	const handleLogout = () => {
		// expect an error here
		try {
			signOut({ redirectUrl: "/login" });
			window.location.href = process.env
				.NEXT_PUBLIC_CLERK_SIGN_IN_URL as string;
		} catch (error) {
			console.error("Error logging out:", error);
		} finally {
			window.location.href = process.env
				.NEXT_PUBLIC_CLERK_SIGN_IN_URL as string;
		}
	};

	return (
		<ClerkUserButton>
			<ClerkUserButton.MenuItems>
				<ClerkUserButton.Action
					label="Logout"
					labelIcon={<DotIcon />}
					onClick={() => handleLogout()}
				/>
			</ClerkUserButton.MenuItems>
		</ClerkUserButton>
	);
}
