import getProfiles from "./profile.ts";
import getUsernameOrUUID from "./uuid.ts";

export default async function getBankAndPurse(
    query: string
): Promise<
    {
        success: true;
        username: string;
        bank: number;
        purse: number;
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
        bank: ( profileData?.profile?.bank_account ?? 0 ) + ( profile?.banking?.balance ?? 0 ),
        purse: profileData?.currencies?.coin_purse ?? 0
    };
}