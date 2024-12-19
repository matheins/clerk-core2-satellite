import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import "../globals.css";
import AuthProvider from "@/components/auth-provider";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		// <ClerkProvider
		// 	afterSignOutUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL as string}
		// >
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
		// </ClerkProvider>
	);
}
