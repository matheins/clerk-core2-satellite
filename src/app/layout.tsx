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
	const isSatelite = !host.includes(process.env.NEXT_PUBLIC_ROOT_DOMAIN!);

	console.log("root layout", {
		host,
		isSatelite,
	});

	return (
		<ClerkProvider
			allowedRedirectOrigins={[satelliteDomain]}
			domain={host}
			isSatellite={isSatelite}
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
