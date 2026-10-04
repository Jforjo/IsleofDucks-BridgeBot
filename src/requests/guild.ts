import type { Guild } from "@zikeji/hypixel/dist/types/Augmented/Guild";
import type { GuildResponse } from "@zikeji/hypixel/dist/types/AugmentedTypes";

export default async function getGuild(
    uuid: string
): Promise<
    {
        success: true;
        guild: Guild;
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
    const res = await fetch(`https://api.hypixel.net/v2/guild?player=${encodeURIComponent(uuid)}`, {
        method: 'GET',
        headers: {
            'API-Key': process.env.HYPIXEL_API_KEY
        }
    });
    if (res.status === 200) {
        const data = await res.json() as GuildResponse;
        if (data.success) {
            if (!data.guild || data.guild === null) {
                return {
                    success: false,
                    message: 'Guild not found'
                };
            }
            return {
                success: true,
                guild: data.guild
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
                ? `Rate limit exceeded. Retry after ${retryAfter / 1000} seconds`
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