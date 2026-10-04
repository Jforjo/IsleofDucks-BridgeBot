import getUsernameOrUUID from "./uuid";
import getProfiles from './profile';

export default async function getColeWeight(
    query: string
): Promise<
    {
        success: true;
        weight: number;
    } | {
        success: false;
        message: string;
        retryAfter?: number;
    }
> {
    const user = await getUsernameOrUUID(query);
    if (!user.success) return user;
    const uuid = user.uuid;

    const profiles = await getProfiles(uuid);
    if (!profiles.success) return profiles;
    const profile = profiles.profiles.find(p => p.selected);
    if (!profile || !profile.profile_id) {
        return {
            success: false,
            message: 'No selected profile found'
        };
    }
    // const member = profile.members[uuid];

    // const weight = senither.totalWeight(member);
    return {
        success: true,
        // weight: weight.totalWeight
        weight: 0
    }
}