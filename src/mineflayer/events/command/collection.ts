import type { BotEvent } from "../../../utils.ts";
import getCollections, { isValidCollection } from "../../../requests/collections.ts";
import { formatNumberWithCommas } from "../../../util/format.ts";

export default {
    id: "chat:commandCollection",
    once: false,
    regex: /^(Guild >|Officer >|From) (\[(?:VIP|VIP\+|MVP|MVP\+|MVP\+\+)])? ?(\w{2,17})(?: (\[.{1,15}]))?: (?:(?:✧?(˚?\w{2,17}).*?): )?!?(?:[cC][oO][lL][lL][sS]?|[cC][oO][lL][lL][eE][cC][tT][iI][oO][nN][sS]?) ([ a-zA-Z0-9_]+)$/,
    run: async (
        bridge,
        bot,
        type: "Guild >" | "Officer >" | "From",
        rank: string | undefined,
        author: string,
        guildRank: string | undefined,
        bridgeAuthor: string | undefined,
        query: string
    ) => {
        if (bridgeAuthor && bridgeAuthor.startsWith(bridge.BRIDGE_CHAR)) return;
        
        const channel =
            type === "Officer >" ? "/oc" :
            type === "From" ? `/msg ${author}` :
            "/gc"
        ;

        let coll: string;
        let user: string;
        let isColl = await isValidCollection(query);
        if (!isColl.success) {
            return bot.chat(`${channel} ${isColl.message}`, bridge, `Failed to send isValidCollection error message with query "${query}"`, bot.name);
        }
        if (!isColl.isValid) {
            const tempColl = query.split(" ").slice(1).join(" ");
            isColl = await isValidCollection(tempColl);
            if (!isColl.success) {
                return bot.chat(`${channel} ${isColl.message}`, bridge, `Failed to send isValidCollection error message with query "${tempColl}"`, bot.name);
            }
            if (!isColl.isValid) {
                return bot.chat(`${channel} Invalid Collection "${tempColl == "" ? query : tempColl}"`, bridge, "Failed to send Invalid Collection message", bot.name);
            }
            user = query.split(" ")[0];
            coll = tempColl;
        } else {
            coll = query;
            user = bridgeAuthor || author;
        }
        const collectionRes = await getCollections(user);
        
        // const params = query.split(" ");
        // let coll = params.length > 1 ? params.slice(1).join(" ") : query;
        // let collectionRes = await getCollections(params[0]);
        // if (params.length === 1 && !collectionRes.success) {
        //     collectionRes = await getCollections(bridgeAuthor || author);
        //     coll = query;
        // }
        if (!collectionRes.success) {
            return bot.chat(`${channel} ${collectionRes.message}`, bridge, "Failed to send Collection error message", bot.name);
        }

        const selectedCollection = collectionRes.collections.find(c => c.name?.toLowerCase() === coll.toLowerCase());
        if (!selectedCollection) {
            return bot.chat(`${channel} Collection "${query}" not found for ${collectionRes.username}.`, bridge, "Failed to send Collection not found message", bot.name);
        }

        bot.chat(`${channel} ${collectionRes.username}'s ${selectedCollection.name ?? selectedCollection.id} Collection: ${formatNumberWithCommas(selectedCollection.amount)}`, bridge, "Failed to send Collection message", bot.name);
    }
} as BotEvent;