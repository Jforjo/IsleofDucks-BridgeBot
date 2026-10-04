import getUsernameOrUUID from "./uuid.ts";

type RecruitResponse = {
    success: false;
    message: string;
} | {
    success: true;
    banned: true;
    reason: string;
} | {
    success: true;
    data: {
        apis: {
            inventory: boolean;
            banking: boolean;
            collection: boolean;
            skills: boolean;
            vault: boolean;
        };
        experience: number;
        req: number;
    };
}

export default async function getRecruit(query: string, guild: "duck" | "duckling"): Promise<RecruitResponse> {
    const user = await getUsernameOrUUID(query);
    if (!user.success) return user;
    
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/recruit?uuid=${user.uuid}&guild=${guild}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });

    if (!res.ok) return { success: false, message: "Unable to check recruit statistics" };
    const data = await res.json() as RecruitResponse;
    return data;
}