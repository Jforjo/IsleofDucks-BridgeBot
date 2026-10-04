import getUsernameOrUUID from "./uuid.ts";

export async function getScrambleScore(query: string): Promise<
    {
        success: true;
        score: number;
        uuid: string;
    } | {
        success: false;
        message: string;
    }
> {
    const user = await getUsernameOrUUID(query);
    if (!user.success) return user;
    
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/scramble`, {
        method: 'GET',
    });

    if (!res.ok) return { success: false, message: "Unable to fetch scramble scores" };
    const data = await res.json() as {
        success: true;
        data: {
            uuid: string;
            discordid: string | null;
            score: number;
        }[];
    } | {
        success: false;
        message: string;
    };
    if (!data.success) return data;

    const userData = data.data.find(d => d.uuid === user.uuid);
    return { success: true, score: 0, uuid: user.uuid };
}

export async function updateScrambleScore(query: string): Promise<
    {
        success: true;
    } | {
        success: false;
        message: string;
    }
> {
    const user = await getUsernameOrUUID(query);
    if (!user.success) return user;
    
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/scramble?uuid=${user.uuid}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });

    if (!res.ok) return { success: false, message: "Unable to update scramble scores" };
    const data = await res.json() as {
        success: true;
    } | {
        success: false;
        message: string;
    };
    return data;
}
