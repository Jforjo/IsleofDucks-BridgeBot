import type { BotEvent } from "../../../utils.ts";

const whitelist = [
    "Xaramis57X",
    "J_forjoooooo"
];

export default {
    id: "chat:autoAcceptParty",
    once: false,
    regex: /-----------------------------------------------------\s(?:\[.{0,8}] )?(\w{2,16}) has invited you to join their party!\sYou have 60 seconds to accept\. Click here to join!\s-----------------------------------------------------/,
    run: async (bridge, bot, user: string) => {
        if (!whitelist.includes(user)) return;
        bot.chat(`/p accept ${user}`, bridge, "Failed to send party accept command", bot.name);
    },
} as BotEvent;