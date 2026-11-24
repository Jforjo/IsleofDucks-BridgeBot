import getUsernameOrUUID from "./uuid.ts";
import getProfiles from "./profile.ts";

function convertToHOTFLevel(HOTFXp: number): number {
    // if (HOTFXp >= 1247000) return 10;
    // else if (HOTFXp >= 847000) return 9;
    if (HOTFXp >= 547000) return 8;
    else if (HOTFXp >= 347000) return 7;
    else if (HOTFXp >= 197000) return 6;
    else if (HOTFXp >= 97000) return 5;
    else if (HOTFXp >= 37000) return 4;
    else if (HOTFXp >= 12000) return 3;
    else if (HOTFXp >= 3000) return 2;
    else return 1;
}

export default async function getHOTFData(
    query: string
): Promise<
    {
        success: true;
        username: string;
        HOTFLevel: number;
        whispers: {
            forest: number;
            desert: number;
        };
        ability: string;
        gifts: {
            fig: number;
            mangrove: number;
            helix: number;
        }
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
        HOTFLevel: convertToHOTFLevel(profile.members[uuid]?.skill_tree?.experience?.foraging ?? 0),
        whispers: {
            forest: profile.members[uuid]?.foraging_core?.whispers?.forest?.total ?? 0,
            desert: profile.members[uuid]?.foraging_core?.whispers?.desert?.total ?? 0
        },
        ability: profile.members[uuid]?.skill_tree?.selected_ability?.foraging ?? "None",
        gifts: {
            fig: profile.members[uuid]?.foraging?.tree_gifts?.FIG ?? 0,
            mangrove: profile.members[uuid]?.foraging?.tree_gifts?.MANGROVE ?? 0,
            helix: profile.members[uuid]?.foraging?.tree_gifts?.HELIX ?? 0
        }
    };
}