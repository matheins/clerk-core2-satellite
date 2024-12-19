import type { NextConfig } from "next";

export const config = {
    async headers() {
        return [{
            source: "/login",
            headers: [
                {
                    key: "Access-Control-Allow-Origin",
                    value: "*",
                },
            ],
        }];
    },
} satisfies NextConfig;
