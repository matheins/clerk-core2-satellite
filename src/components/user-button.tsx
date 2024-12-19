"use client";

import { UserButton as ClerkUserButton, useAuth } from "@clerk/nextjs";

export function UserButton() {
	const { signOut } = useAuth();
	return (
		<ClerkUserButton>
			<ClerkUserButton.MenuItems>
				<ClerkUserButton.Action
					label="Open chat"
					labelIcon={undefined}
					onClick={() => signOut()}
				/>
			</ClerkUserButton.MenuItems>
		</ClerkUserButton>
	);
}
