import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import "./globals.css";
import { satelliteDomain } from "@/middleware";
import { getApexDomainFromHost } from "@/utils";
import { headers } from "next/headers";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const headersList = await headers();
	const host = getApexDomainFromHost(
		headersList.get("x-forwarded-host") ?? process.env.NEXT_PUBLIC_ROOT_DOMAIN!,
	);
	const isSatellite = !process.env.NEXT_PUBLIC_ROOT_DOMAIN!.includes(host);

	console.log("root layout", {
		host,
		isSatellite,
		rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
		// iterate over headersList
		headers: Object.fromEntries(headersList.entries()),
	});

	return (
		<ClerkProvider
			allowedRedirectOrigins={[satelliteDomain]}
			// does not work: Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server"
			// domain={(url) => url.host}
			domain={
				isSatellite
					? `https://${satelliteDomain}`
					: `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
			}
			isSatellite={isSatellite}
		>
			<html lang="en">
				<body>
					<SignedIn>
						<UserButton />
					</SignedIn>
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
