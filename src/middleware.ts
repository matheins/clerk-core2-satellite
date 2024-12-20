import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

import { getApexDomainFromHost, parse } from "./utils";

export interface UserMiddlewareInfo {
    id: string;
    accountantId: string | undefined;
    clientIds: string[] | undefined;
    isOnboardingComplete: boolean;
    email: string;
}

const isPublicRoute = createRouteMatcher([
    "/login(.*)",
    "/sso-callback(.*)",
    "/api(.*)",
]);

// INSERT YOUR CLERK USER ID HERE
// Normally we would get this info from the database.
// For this example, we'll just mock it and say we only have one satellite domain.
// In our real implementation, there are dozens of users with custom domains and we can only tell as soon as the user is signed in.
const mockUsersWithCustomDomains = [
    "user_2pnel0tog081y6yndsLmDw0hS5e",
    "user_2po4ooSYO2b1vM4g846F2R62x0Q",
    "user_2qLonWjJAGEzSgwoMwhRKVfYRxC",
];
// const mockUsersWithCustomDomains = [""];

export const satelliteDomain = "satellite.stbrd.com";

const mockGetUserCustomDomain = (userId: string) => {
    if (mockUsersWithCustomDomains.includes(userId)) {
        return satelliteDomain;
    }
    return null;
};

export default clerkMiddleware(
    async (auth, request) => {
        if (isPublicRoute(request)) return;
        await auth.protect({
            unauthenticatedUrl:
                `${process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}?redirect_url=${request.nextUrl.origin}`,
        });

        const { userId, redirectToSignIn } = await auth();

        if (!userId) {
            return redirectToSignIn(
                {
                    returnBackUrl: request.nextUrl.origin,
                },
            );
        }

        const host = request.nextUrl.host;
        const { path, fullPath, searchParams } = parse(request);

        console.log({
            host,
            path,
            fullPath,
            searchParams,
        });

        const userCustomDomain = mockGetUserCustomDomain(userId);

        const nextDomain = `${
            process.env.NODE_ENV === "development" ||
                host.includes("localhost")
                ? "http://"
                : "https://"
        }${userCustomDomain ?? host}`;

        // if user is on wrong domain, redirect to correct domain
        if (userCustomDomain && userCustomDomain !== host) {
            console.log("redirecting to correct domain", {
                nextDomain,
                fullPath,
            });
            return NextResponse.redirect(`${nextDomain}${fullPath}`);
        }

        // redirect from root to dashboard
        if (path === "/") {
            return NextResponse.redirect(
                `${nextDomain}/dashboard?${searchParams}`,
            );
        }

        return NextResponse.rewrite(
            new URL(`/${userCustomDomain ?? host}${fullPath}`, request.url),
        );
    },
    (req) => {
        const host = req.nextUrl.host;
        const isSatellite = !host
            .includes(
                process.env.NEXT_PUBLIC_ROOT_DOMAIN as string,
            );
        const domain = getApexDomainFromHost(host);

        console.log("clerk middleware", {
            host,
            domain,
            rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
            isSatellite,
        });

        return {
            signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
            isSatellite: isSatellite ?? undefined,
            domain: isSatellite
                ? `https://${domain}`
                : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        };
    },
);

// export const config = {
//     matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
