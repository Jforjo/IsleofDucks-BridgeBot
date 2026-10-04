import getUsernameOrUUID from "./uuid.ts";
import getProfiles from "./profile.ts";

function convertToHOTMLevel(HOTMXp: number): number {
    if (HOTMXp >= 1247000) return 10;
    else if (HOTMXp >= 847000) return 9;
    else if (HOTMXp >= 557000) return 8;
    else if (HOTMXp >= 347000) return 7;
    else if (HOTMXp >= 197000) return 6;
    else if (HOTMXp >= 97000) return 5;
    else if (HOTMXp >= 37000) return 4;
    else if (HOTMXp >= 12000) return 3;
    else if (HOTMXp >= 3000) return 2;
    else return 1;
}

export default async function getHOTMData(
    query: string
): Promise<
    {
        success: true;
        username: string;
        HOTMLevel: number;
        powder: {
            mithril: number;
            gemstone: number;
            glacite: number;
        };
        ability: string;
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

    return {
        success: true,
        username: user.name,
        HOTMLevel: convertToHOTMLevel(profile.members[uuid]?.skill_tree?.experience?.mining ?? 0),
        powder: {
            mithril: profile.members[uuid]?.mining_core?.powder_mithril ?? 0,
            gemstone: profile.members[uuid]?.mining_core?.powder_gemstone ?? 0,
            glacite: profile.members[uuid]?.mining_core?.powder_glacite ?? 0
        },
        ability: profile.members[uuid]?.skill_tree?.selected_ability?.mining ?? "None"
    };
}