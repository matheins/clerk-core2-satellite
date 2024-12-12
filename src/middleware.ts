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
            unauthenticatedUrl: new URL(
                "/login",
                "https://".concat(
                    process.env.NEXT_PUBLIC_ROOT_DOMAIN as string,
                ),
            ).toString(),
        });

        const { userId, redirectToSignIn } = await auth();

        if (!userId) return redirectToSignIn();

        const { path, domain, fullPath, searchParams } = parse(request);

        console.log({
            domain,
            path,
            fullPath,
            searchParams,
        });

        const userCustomDomain = mockGetUserCustomDomain(userId);

        const nextDomain = `${
            process.env.NODE_ENV === "development" ||
                domain.includes("localhost")
                ? "http://"
                : "https://"
        }${userCustomDomain ?? domain}`;

        // if user is on wrong domain, redirect to correct domain
        if (userCustomDomain && userCustomDomain !== domain) {
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
            new URL(`/${userCustomDomain ?? domain}${fullPath}`, request.url),
        );
    },
    (req) => {
        const host = req.nextUrl.host;
        const isSatellite = !(process.env.NEXT_PUBLIC_ROOT_DOMAIN as string)
            .includes(
                host,
            );
        const domain = getApexDomainFromHost(host);

        console.log("clerk middleware", {
            host,
            domain,
            rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
            isSatellite,
        });

        return {
            isSatellite: isSatellite ?? undefined,
            domain: isSatellite
                ? `https://${domain}`
                : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        };
    },
);

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
