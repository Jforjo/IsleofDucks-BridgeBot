import { Client } from "discord.js";
import type Bridge from "../bridge.ts";
import loadEvents from "../util/loadevents.ts";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default class Discord extends Client {
    
    public async loadEvents(bridge: Bridge) {
        await loadEvents(path.join(__dirname, "events"), this, bridge, bridge.mineflayerDuck);
    }
}