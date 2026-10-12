import getUsernameOrUUID from "./uuid.ts";

export async function getBestiaryKills(query: string): Promise<{
    success: false;
    message: string;
} | {
    success: true;
    bestiary: Record<string, number>;
    username: string;
}> {
    const user = await getUsernameOrUUID(query);
    if (!user.success) return user;
    
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/bestiary?uuid=${user.uuid}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });

    if (!res.ok) return { success: false, message: "Unable to fetch bestiary data" };
    const data = await res.json() as {
        success: false;
        message: string;
    } | {
        success: true;
        bestiary: Record<string, number>
    };
    if (data.success) return {
        success: data.success,
        bestiary: data.bestiary,
        username: user.name
    };
    return data
}

export async function getBestiaryDeaths(query: string): Promise<{
    success: false;
    message: string;
} | {
    success: true;
    deaths: Record<string, number>;
    username: string;
}> {
    const user = await getUsernameOrUUID(query);
    if (!user.success) return user;
    
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/deaths?uuid=${user.uuid}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });

    if (!res.ok) return { success: false, message: "Unable to fetch deaths data" };
    const data = await res.json() as {
        success: false;
        message: string;
    } | {
        success: true;
        deaths: Record<string, number>
    };
    if (data.success) return {
        success: data.success,
        deaths: data.deaths,
        username: user.name
    };
    return data
}