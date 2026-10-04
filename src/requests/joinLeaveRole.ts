import getUsernameOrUUID from "./uuid.ts";

type RoleResponse = {
    success: false;
    message: string;
} | {
    success: true;
}

export default async function updateRoles(query: string, guild: "duck" | "duckling" | "hatchling", status: "joined" | "left"): Promise<RoleResponse> {
    const user = await getUsernameOrUUID(query);
    if (!user.success) return user;
    
    const res = await fetch(`https://isle-of-ducks.vercel.app/api/role?uuid=${user.uuid}&guild=${guild}&status=${status}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
        }
    });

    if (!res.ok) return { success: false, message: "Failed to update user guild roles" };
    const data = await res.json() as RoleResponse;
    return data;
}