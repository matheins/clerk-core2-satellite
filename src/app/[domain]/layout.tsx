import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import "../globals.css";
import { headers } from "next/headers";
import { getApexDomainFromHost } from "@/utils";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const headersList = await headers();
	const host =
		headersList.get("x-forwarded-host") ??
		(process.env.NEXT_PUBLIC_ROOT_DOMAIN as string);
	const isSatellite = !host.includes(
		process.env.NEXT_PUBLIC_ROOT_DOMAIN as string,
	);

	console.log("root layout", {
		host,
		isSatellite,
		rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
	});

	const domain = getApexDomainFromHost(host);

	return (
		<ClerkProvider
			// does not work: Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server"
			// domain={(url) => url.host}
			domain={
				isSatellite ? domain : (process.env.NEXT_PUBLIC_ROOT_DOMAIN as string)
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