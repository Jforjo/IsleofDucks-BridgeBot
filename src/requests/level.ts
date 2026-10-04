import getProfiles from "./profile.ts";
import getUsernameOrUUID from "./uuid.ts";

export default async function getLevel(
    query: string
): Promise<
    {
        success: true;
        username: string;
        level: number;
    } | {
        success: false;
        message: string;
        retryAfter?: number;
    }
> {
    const user = await getUsernameOrUUID(query);
    if (!user.success) return user;
    const profiles = await getProfiles(user.uuid);
    if (!profiles.success) return profiles;
    const profile = profiles.profiles.find(p => p.selected);
    if (!profile) {
        let experience = 0;
        for (const profile of profiles.profiles) {
            if (profile.members && profile.members[user.uuid]) {
                experience = Math.max(experience, profile.members[user.uuid]?.leveling?.experience || 0);
            }
        }
        return {
            success: true,
            username: user.name,
            level: experience / 100
        };
    }
    const exp = profile.members[user.uuid]?.leveling?.experience
    return {
        success: true,
        username: user.name,
        level: exp ? exp / 100 : 0
    }
}