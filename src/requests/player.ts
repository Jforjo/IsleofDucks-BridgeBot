import type { PlayerResponse } from "@zikeji/hypixel/dist/types/AugmentedTypes";

export default async function getPlayer(
    uuid: string
): Promise<
    {
        success: true;
        player: PlayerResponse["player"];
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
    const res = await fetch(`https://api.hypixel.net/v2/player?uuid=${encodeURIComponent(uuid)}`, {
        method: 'GET',
        headers: {
            'API-Key': process.env.HYPIXEL_API_KEY
        }
    });
    if (res.status === 200) {
        const data = await res.json() as PlayerResponse;
        if (data.success) {
            if (!data.player) {
                return {
                    success: false,
                    message: 'Player not found'
                };
            }
            return {
                success: true,
                player: data.player
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