import getProfiles from "./profile.ts";
import getUsernameOrUUID from "./uuid.ts";

export const classLevels: Record<number, number> = {
    1: 50, 2: 125, 3: 235, 4: 395, 5: 625, 6: 955, 7: 1425, 8: 2095, 9: 3045,
    10: 4385, 11: 6275, 12: 8940, 13: 12700, 14: 17960, 15: 25340, 16: 35640,
    17: 50040, 18: 70040, 19: 97640, 20: 135640, 21: 188140, 22: 259640, 23: 356640,
    24: 488640, 25: 668640, 26: 911640, 27: 1239640, 28: 1684640, 29: 2284640,
    30: 3084640, 31: 4149640, 32: 5559640, 33: 7459640, 34: 9959640, 35: 13259640,
    36: 17559640, 37: 23159640, 38: 30359640, 39: 39559640, 40: 51559640, 41: 66559640,
    42: 85559640, 43: 109559640, 44: 139559640, 45: 177559640, 46: 225559640,
    47: 285559640, 48: 360559640, 49: 453559640, 50: 569809640
};
export function getClassXp(level: number): number {
    if (level < 1) return 0;
    if (level > Object.keys(classLevels).length) return -2;
    if (!classLevels[level]) return -1;
    return classLevels[level];
}
export function calcClassLevel(cataxp: number): {
    level: number;
    overflowLevel?: number;
} {
    let level = 0;
    while (true) {
        const nextXp = getClassXp(level + 1);
        if (nextXp === -1) return { level };
        if (nextXp === -2) break;
        if (cataxp < nextXp) {
            const prevXp = getClassXp(level);
            return {
                level: level + (cataxp - prevXp) / (nextXp - prevXp)
            };
            // return level;
        }
        level++;
    }
    // Overflow Level
    let overflowLevel = 0;
    const maxXp = getClassXp(level);
    let slope = 200_000_000;
    // let slope = maxXp - getClassXp(level - 1);
    let overflowXp = cataxp - maxXp;
    let xpForCurr = maxXp + slope;
    while (cataxp >= xpForCurr) {
        overflowLevel++;
        if (overflowXp < slope) break;
        overflowXp -= slope;
        xpForCurr += slope;
        // if ((level + overflowLevel) % 10 === 0) slope *= 2;
    }
    return {
        level: level,
        overflowLevel: (level + overflowLevel) + (overflowXp / slope)
    };
}

export const catalevels: Record<number, number> = {
    1: 50, 2: 125, 3: 235, 4: 395, 5: 625, 6: 955, 7: 1425, 8: 2095, 9: 3045,
    10: 4385, 11: 6275, 12: 8940, 13: 12700, 14: 17960, 15: 25340, 16: 35640,
    17: 50040, 18: 70040, 19: 97640, 20: 135640, 21: 188140, 22: 259640, 23: 356640,
    24: 488640, 25: 668640, 26: 911640, 27: 1239640, 28: 1684640, 29: 2284640,
    30: 3084640, 31: 4149640, 32: 5559640, 33: 7459640, 34: 9959640, 35: 13259640,
    36: 17559640, 37: 23159640, 38: 30359640, 39: 39559640, 40: 51559640, 41: 66559640,
    42: 85559640, 43: 109559640, 44: 139559640, 45: 177559640, 46: 225559640,
    47: 285559640, 48: 360559640, 49: 453559640, 50: 569809640
};
export function getCataXp(level: number): number {
    if (level < 1) return 0;
    if (level > Object.keys(catalevels).length) return -2;
    if (!catalevels[level]) return -1;
    return catalevels[level];
}
export function calcCataLevel(cataxp: number): {
    level: number;
    overflowLevel?: number;
} {
    let level = 0;
    while (true) {
        const nextXp = getCataXp(level + 1);
        if (nextXp === -1) return { level };
        if (nextXp === -2) break;
        if (cataxp < nextXp) {
            const prevXp = getCataXp(level);
            return {
                level: level + (cataxp - prevXp) / (nextXp - prevXp)
            };
            // return level;
        }
        level++;
    }
    // Overflow Level
    let overflowLevel = 0;
    const maxXp = getCataXp(level);
    let slope = 200_000_000;
    // let slope = maxXp - getCataXp(level - 1);
    let overflowXp = cataxp - maxXp;
    let xpForCurr = maxXp + slope;
    while (cataxp >= xpForCurr) {
        overflowLevel++;
        if (overflowXp < slope) break;
        overflowXp -= slope;
        xpForCurr += slope;
        // if ((level + overflowLevel) % 10 === 0) slope *= 2;
    }
    return {
        level: level,
        overflowLevel: (level + overflowLevel) + (overflowXp / slope)
    };
}

export default async function getCata(query: string): Promise<
    {
        success: true;
        username: string;
        cataLevel: number;
        cataXp: number;
        secrets: number;
        classXp: {
            healer: number;
            mage: number;
            berserk: number;
            archer: number;
            tank: number;
        } | null;
        classLevel: {
            healer: number;
            mage: number;
            berserk: number;
            archer: number;
            tank: number;
        } | null;
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

    // const profile = profiles.profiles.reduce((prev, curr) => {
    //     const prevCataXp = prev.members[uuid]?.dungeons?.dungeon_types?.catacombs?.experience || 0;
    //     const currCataXp = curr.members[uuid]?.dungeons?.dungeon_types?.catacombs?.experience || 0;
    //     return currCataXp > prevCataXp ? curr : prev;
    // });
    let profile = profiles.profiles.find(p => p.selected);
    if (!profile) {
        profile = profiles.profiles.reduce((prev, curr) => {
            const prevCataXp = prev.members[uuid]?.dungeons?.dungeon_types?.catacombs?.experience || 0;
            const currCataXp = curr.members[uuid]?.dungeons?.dungeon_types?.catacombs?.experience || 0;
            return currCataXp > prevCataXp ? curr : prev;
        });
    }

    const cataLevel = calcCataLevel(profile.members[uuid]?.dungeons?.dungeon_types?.catacombs?.experience || 0);

    return {
        success: true,
        username: user.name,
        cataXp: profile.members[uuid]?.dungeons?.dungeon_types?.catacombs?.experience || 0,
        cataLevel: cataLevel.overflowLevel ? cataLevel.overflowLevel : cataLevel.level,
        secrets: profile.members[uuid]?.dungeons?.secrets || 0,
        classXp: profile.members[uuid]?.dungeons?.player_classes ? Object.fromEntries(
            Object.entries(profile.members[uuid]?.dungeons?.player_classes).map(([k, v]) => [k, v.experience || 0])) as {
                healer: number;
                mage: number;
                berserk: number;
                archer: number;
                tank: number;
            } : null,
        classLevel: profile.members[uuid]?.dungeons?.player_classes ? Object.fromEntries(
            Object.entries(profile.members[uuid]?.dungeons?.player_classes).map(([k, v]) => {
                const classLevel = calcClassLevel(v.experience || 0);
                return [
                    k,
                    classLevel.overflowLevel ? classLevel.overflowLevel : classLevel.level
                ]
            })) as {
                healer: number;
                mage: number;
                berserk: number;
                archer: number;
                tank: number;
            } : null,
    }
}