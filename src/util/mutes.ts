import { writeFile } from "fs/promises";
import { readFile } from "fs/promises";
import type { BotName } from "../utils";

type MuteUser = {
    uuid: string;
    discordId?: string | null;
    ends: number;
}
type MuteResult = {
    duck: MuteUser[];
    duckling: MuteUser[];
    duckieprincess: MuteUser[];
    // [key: BotName]: MuteUser[];
}
type MutesReponse = {
    success: false;
    message: string;
} | MuteResult;
/**
 * Fetches the mute list from the database
 * @returns {Promise<MutesReponse>} The mute list, or an error message
 */
export async function getMutes(): Promise<MutesReponse> {
    const res = await readFile('src/db.json', 'utf-8');
    // if (!res.ok) return { success: false, message: "Unable to access db.json" };
    const data = JSON.parse(res);
    if (!('mutes' in data)) return { success: false, message: "Unable to fetch mutes" };
    return data.mutes as MuteResult;
}
/**
 * Adds a user to the mute list
 * @param {string} type - The type of mute to add the user to
 * @param {MuteUser} user - The user to add to the mute list
 * @returns {Promise<MutesReponse>} The updated mute list
 */
export async function addMute(
    type: BotName,
    user: MuteUser
): Promise<MutesReponse> {
    const res = await readFile('src/db.json', 'utf-8');
    // if (!res.ok) return { success: false, message: "Unable to access db.json" };
    const data = JSON.parse(res);
    if (!('mutes' in data)) return { success: false, message: "Unable to fetch mutes" };
    if ((data.mutes as MuteResult)[type].find((u) =>
        u.discordId === user.discordId ||
        u.uuid === user.uuid
    )) return data.mutes as MuteResult;
    data.mutes[type].push(user);
    await writeFile('src/db.json', JSON.stringify(data), 'utf-8');
    return data.mutes as MuteResult;
}
/**
 * Removes a user from the mute list
 * @param {string} type - The type of mute to remove the user from
 * @param {strin} uuid - The uuid of the user to remove from the mute list
 * @returns {Promise<MutesReponse>} The updated mute list
 */
export async function removeMute(
    type: BotName,
    uuid: string
): Promise<MutesReponse> {
    const res = await readFile('src/db.json', 'utf-8');
    // if (!res.ok) return { success: false, message: "Unable to access db.json" };
    const data = JSON.parse(res);
    if (!('mutes' in data)) return { success: false, message: "Unable to fetch mutes" };
    const mutes = (data.mutes as MuteResult)[type].filter((u) =>
        u.uuid !== uuid
    );
    data.mutes[type] = mutes;
    await writeFile('src/db.json', JSON.stringify(data), 'utf-8');
    return data.mutes as MuteResult;
}
/**
 * Removes expired mutes from the db.json
 * and returns the updated mute list
 * @returns {Promise<MutesReponse>}
 */
export async function checkMutes(): Promise<MutesReponse> {
    const res = await readFile('src/db.json', 'utf-8');
    // if (!res.ok) return { success: false, message: "Unable to access db.json" };
    const data = JSON.parse(res);
    if (!('mutes' in data)) return { success: false, message: "Unable to fetch mutes" };
    const mutesDuck = (data.mutes as MuteResult).duck.filter((user) =>
        user.ends < Date.now()
    );
    data.mutes.duck = mutesDuck;
    const mutesDuckling = (data.mutes as MuteResult).duckling.filter((user) =>
        user.ends < Date.now()
    );
    data.mutes.duckling = mutesDuckling;
    await writeFile('src/db.json', JSON.stringify(data), 'utf-8');
    return data.mutes as MuteResult;
}