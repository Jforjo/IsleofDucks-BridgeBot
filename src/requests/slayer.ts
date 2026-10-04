import getProfiles from "./profile.ts";
import getUsernameOrUUID from "./uuid.ts";

export const slayerLevels: Record<string, Record<number, number>> = {
    zombie: {
        1: 5,
        2: 15,
        3: 200,
        4: 1_000,
        5: 5_000,
        6: 20_000,
        7: 100_000,
        8: 400_000,
        9: 1_000_000,
    },
    spider: {
        1: 5,
        2: 25,
        3: 200,
        4: 1_000,
        5: 5_000,
        6: 20_000,
        7: 100_000,
        8: 400_000,
        9: 1_000_000,
    },
    wolf: {
        1: 10,
        2: 30,
        3: 250,
        4: 1_500,
        5: 5_000,
        6: 20_000,
        7: 100_000,
        8: 400_000,
        9: 1_000_000,
    },
    enderman: {
        1: 10,
        2: 30,
        3: 250,
        4: 1_500,
        5: 5_000,
        6: 20_000,
        7: 100_000,
        8: 400_000,
        9: 1_000_000,
    },
    blaze: {
        1: 10,
        2: 30,
        3: 250,
        4: 1_500,
        5: 5_000,
        6: 20_000,
        7: 100_000,
        8: 400_000,
        9: 1_000_000,
    },
    vampire: {
        1: 20,
        2: 75,
        3: 240,
        4: 840,
        5: 2_400,
    }
};

export function getSlayerXp(type: keyof typeof slayerLevels, level: number): number {
    if (level < 1) return 0;
    if (slayerLevels[type][level] !== undefined) return slayerLevels[type][level];

    return -1;
}

export function calcSlayerLevel(
    slayerType: keyof typeof slayerLevels,
    slayerXp: number
): number {
    let level = 0;
    while (true) {
        const nextXp = getSlayerXp(slayerType, level + 1);
        if (nextXp === -1) return level;
        if (slayerXp < nextXp) {
            // const prevXp = getSlayerXp(slayerType, level);
            // return level + (slayerXp - prevXp) / (nextXp - prevXp);
            return level;
        }
        level++;
    }
}

export default async function getSlayers(
    query: string
): Promise<
    {
        success: true;
        username: string;
        slayers: {
            zombie: {
                xp: number;
                level: number;
            };
            spider: {
                xp: number;
                level: number;
            };
            wolf: {
                xp: number;
                level: number;
            };
            enderman: {
                xp: number;
                level: number;
            };
            blaze: {
                xp: number;
                level: number;
            };
            vampire: {
                xp: number;
                level: number;
            };
        };
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
        slayers: {
            zombie: {
                xp: profileData?.slayer?.slayer_bosses?.zombie?.xp || 0,
                level: calcSlayerLevel("zombie", profileData?.slayer?.slayer_bosses?.zombie?.xp || 0)
            },
            spider: {
                xp: profileData?.slayer?.slayer_bosses?.spider?.xp || 0,
                level: calcSlayerLevel("spider", profileData?.slayer?.slayer_bosses?.spider?.xp || 0)
            },
            wolf: {
                xp: profileData?.slayer?.slayer_bosses?.wolf?.xp || 0,
                level: calcSlayerLevel("wolf", profileData?.slayer?.slayer_bosses?.wolf?.xp || 0)
            },
            enderman: {
                xp: profileData?.slayer?.slayer_bosses?.enderman?.xp || 0,
                level: calcSlayerLevel("enderman", profileData?.slayer?.slayer_bosses?.enderman?.xp || 0)
            },
            blaze: {
                xp: profileData?.slayer?.slayer_bosses?.blaze?.xp || 0,
                level: calcSlayerLevel("blaze", profileData?.slayer?.slayer_bosses?.blaze?.xp || 0)
            },
            vampire: {
                xp: profileData?.slayer?.slayer_bosses?.vampire?.xp || 0,
                level: calcSlayerLevel("vampire", profileData?.slayer?.slayer_bosses?.vampire?.xp || 0)
            }
        }
    }
}