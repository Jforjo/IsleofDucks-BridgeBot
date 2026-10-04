import getUsernameOrUUID from "./uuid.ts";

type BanResponse = {
    success: false;
    message: string;
} | {
    success: true;
    banned: true;
    reason: string;
} | {
    success: true;
    banned: false;
}

export default async function getBan(query: string): Promise<BanResponse> {
    const user = await getUsernameOrUUID(query);
    if (!user.success) return user;
    
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/ban/check?uuid=${user.uuid}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });

    if (!res.ok) return { success: false, message: "Unable to check ban status" };
    const data = await res.json() as BanResponse;
    return data;
}