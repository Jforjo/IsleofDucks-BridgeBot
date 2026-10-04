import getProfiles from "./profile.ts";
import getUsernameOrUUID from "./uuid.ts";

export default async function getMagicPower(
    query: string
): Promise<
    {
        success: true;
        username: string;
        magicPower: number;
        selectedPower?: string;
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

    const profileData = profile.members[uuid];
    return {
        success: true,
        username: user.name,
        magicPower: profileData?.accessory_bag_storage?.highest_magical_power || 0,
        selectedPower: profileData?.accessory_bag_storage?.selected_power
    };
}