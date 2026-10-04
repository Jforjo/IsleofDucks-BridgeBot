import type { BotEvent } from "../../../utils.ts";

export default {
    id: "entityHurt",
    once: false,
    run: async (bridge, bot, entity) => {
        try {
            bridge.logger.log(`log_entity_${bot.name}`, `${JSON.stringify(entity, null, 2)}`);
        } catch (e) {
            bridge.logger.log(`log_entity_${bot.name}`, `TryCatch entity error: ${e}`);
            bridge.logger.log(`log_entity_${bot.name}`, `${entity}`);
        }
        try {
            bridge.logger.log(`log_entity_${bot.name}`, `${JSON.stringify(bot.bot.entities, null, 2)}`);
        } catch (e) {
            bridge.logger.log(`log_entity_${bot.name}`, `TryCatch bot entities error: ${e}`);
            bridge.logger.log(`log_entity_${bot.name}`, `${bot.bot.entities}`);
        }
        if (bot.name !== "hatchling") {
            bot.bot.quit();
        }
    },
} as BotEvent;