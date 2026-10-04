import type { SkyblockMuseumResponse } from "@zikeji/hypixel/dist/types/AugmentedTypes";

export default async function getMuseum(
    profile: string
): Promise<
    {
        success: true;
        members: SkyblockMuseumResponse["members"];
    } | {
        success: false;
        message: string;
        retryAfter?: number;
    }
> {
    if (!process.env.HYPIXEL_API_KEY) {
        return {
            success: false,
            message: 'Missing HYPIXEL_API_KEY',
        };
    }
    const res = await fetch(`https://api.hypixel.net/v2/skyblock/museum?profile=${encodeURIComponent(profile)}`, {
        method: 'GET',
        headers: {
            'API-Key': process.env.HYPIXEL_API_KEY
        }
    });
    if (res.status === 200) {
        const data = await res.json() as SkyblockMuseumResponse;
        if (data.success) {
            if (!data.members) {
                return {
                    success: false,
                    message: 'Profile not found'
                };
            }
            return {
                success: true,
                members: data.members
            };
        } else {
            return {
                success: false,
                message: "Unknown error"
            };
        }
    } else if (res.status === 429) {
        const retryAfterHeader = res.headers.get("RateLimit-Reset");
        const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : null;
        return {
            success: false,
            message: retryAfter !== null && !isNaN(retryAfter)
                ? `Rate limit exceeded. Retry after ${Math.ceil((Date.now() / 1000) - retryAfter)} seconds`
                : "Rate limit exceeded. Please try again later.",
            retryAfter: retryAfter !== null && !isNaN(retryAfter) ? retryAfter : undefined
        };
    } else {
        return {
            success: false,
            message: "Unknown error"
        };
    }
}