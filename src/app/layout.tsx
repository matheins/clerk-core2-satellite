import { SignedIn } from "@clerk/nextjs";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";
import { UserButton } from "@/components/user-button";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AuthProvider>
			<html lang="en">
				<body>
					<SignedIn>
						<UserButton />
					</SignedIn>
					{children}
				</body>
			</html>
		</AuthProvider>
	);
}
