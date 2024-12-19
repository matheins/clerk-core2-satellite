import { SignedIn, UserButton } from "@clerk/nextjs";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";

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
