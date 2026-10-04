import getUsernameOrUUID from "./uuid.ts";

export async function updateUserSuperlative(query: string, guild: "duck" | "duckling" | "hatchling"): Promise<void> {
    if (guild === "hatchling") return;

    // const user = await getUsernameOrUUID(query);
    // if (!user.success) return;
    
    await fetch(`https://isle-of-ducks.vercel.app/api/superlative/update?user=${query}&guild=${guild}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });
}

export async function getUserSuperlative(query: string): Promise<
    {
        success: true;
        username: string;
        data: {
            current: number;
            starting: number;
        }
    } | {
        success: false;
        message: string;
    }
> {
    const user = await getUsernameOrUUID(query);
    if (!user.success) return user;
    
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/superlative?uuid=${user.uuid}&m=${new Date().toISOString().slice(0, 7)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });

    if (res.ok) {
        const data = await res.json() as {
            success: true;
            data: {
                current: number;
                starting: number;
            }
        } | {
            success: false;
            message: string;
        };
        if (data.success) return {
            success: true,
            username: user.name,
            data: data.data
        }
        return data;
    }
    return {
        success: false,
        message: "Failed to fetch superlative value"
    }
}