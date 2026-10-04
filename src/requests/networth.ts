import { ProfileNetworthCalculator } from "skyhelper-networth";
import getMuseum from "./museum.ts";
import getProfiles from "./profile.ts";
import getUsernameOrUUID from "./uuid.ts";

export default async function getNetworth(
    query: string
): Promise<
    {
        success: true;
        username: string;
        networth: number;
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
    const museum = await getMuseum(profile.profile_id);
    if (!museum.success) return museum;
    const profileData = profile.members[uuid];
    const museumData = museum.members[uuid];
    const bankBalance = profile.banking ? profile.banking.balance ?? 0 : 0;

    const networthManager = new ProfileNetworthCalculator(profileData, museumData, bankBalance);
    const networth = await networthManager.getNetworth({
        onlyNetworth: true,
    });

    return {
        success: true,
        username: user.name,
        networth: networth.networth
    };
}