"use client";

import { UserButton as ClerkUserButton, useAuth } from "@clerk/nextjs";

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
	return (
		<ClerkUserButton>
			<ClerkUserButton.MenuItems>
				<ClerkUserButton.Action
					label="Logout"
					labelIcon={<DotIcon />}
					onClick={() => signOut()}
				/>
			</ClerkUserButton.MenuItems>
		</ClerkUserButton>
	);
}
