type DiscordData = {
    uuid: string | null;
    discordname: string | null;
    discordid: string | null;
    discordupdated: number;
    exp: number | null;
    expupdated: number;
}
type DiscordIdResponse = {
    success: false;
    message: string;
} | {
    success: true;
    data: DiscordData;
}

export default async function getDiscordData(uuid: string): Promise<DiscordIdResponse> {
    // const user = await getUsernameOrUUID(query);
    // if (!user.success) return user;
    
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/discordid?uuid=${uuid}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });

    if (!res.ok) return { success: false, message: "Unable to get user's Discord data" };
    const data = await res.json() as DiscordIdResponse;
    return data;
}
