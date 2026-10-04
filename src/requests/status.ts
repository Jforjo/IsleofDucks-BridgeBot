import type { StatusResponse } from "@zikeji/hypixel/dist/types/AugmentedTypes";
import getUsernameOrUUID from "./uuid.ts";

export default async function getStatus(
    query: string
): Promise<
    {
        success: true;
        username: string;
        session: StatusResponse["session"];
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

    const username = await getUsernameOrUUID(query);
    if (!username.success) return username;
    const uuid = username.uuid;

    const res = await fetch(`https://api.hypixel.net/v2/status?uuid=${encodeURIComponent(uuid)}`, {
        method: 'GET',
        headers: {
            'API-Key': process.env.HYPIXEL_API_KEY
        }
    });
    if (res.status === 200) {
        const data = await res.json() as StatusResponse;
        if (data.success) {
            if (!data.session) {
                return {
                    success: false,
                    message: 'Session not found'
                };
            }
            return {
                success: true,
                username: username.name,
                session: data.session
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