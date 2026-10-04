import type EventEmitter from "events";
import type { BotEvent } from "../utils.ts";
import type { Bot } from "mineflayer";
import recursiveWalkDir from "./recursivewalkdir.ts";
import type Bridge from "../bridge.ts";
import type Mineflayer from "../mineflayer/mineflayer.ts";

export default async function loadEvents(dir: string, emitter: EventEmitter, bridge: Bridge, bot: Mineflayer) {
    const callback = async (path: string) => {
        if (!(path.endsWith('.ts') || path.endsWith('.js'))) return;

        const { id, once, regex, run } = (await import(path))
            .default as BotEvent;

        if (!id) {
            bridge.logger.log('log_warn', `The event ${path} doesn't have an ID!`);
            return;
        }

        if (!run) {
            bridge.logger.log('log_warn', `The event ${id} doesn't have an executable function!`);
            return;
        }

        if (regex) {
            try {
                (emitter as Bot).addChatPattern(id.replace('chat:', ''), regex, {
                    repeat: true,
                    parse: true,
                });
            } catch (error) {
                bridge.logger.log('log_error', `There was an error adding the chat pattern for event ${id}: ${(error as Error).message}`);
            }
        }

        if (once) {
            emitter.once(id, run.bind(null, bridge, bot));
            return;
        }

        emitter.on(id, (...args) => {
            run(bridge, bot, ...args.flat(2));
        });

        // bridge.logger.log('log_info', `Loaded event: ${id}`);
    };

    await recursiveWalkDir(dir, callback, bridge.logger, 'Error while loading events:');
}