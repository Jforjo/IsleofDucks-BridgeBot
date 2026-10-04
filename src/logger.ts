import express from 'express';
import { createServer } from 'node:http';
import { Server} from 'socket.io';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export default class Logger {
    private app = express();
    private server = createServer(this.app);
    private io = new Server(this.server);
    private __dirname = dirname(fileURLToPath(import.meta.url));

    constructor(connectionEvents?: {
        event: string;
        listener: (...args: any[]) => void
    }[]) {
        this.app.use(express.static(path.join(this.__dirname, 'public')));
        this.app.get('/', (_req, res) => res.sendFile(path.join(this.__dirname, 'index.html')));

        this.io.on('connection', (socket) => {
            if (connectionEvents) {
                connectionEvents.forEach(({ event, listener }) => {
                    socket.on(event, listener);
                });
            }
        });

        this.server.listen(3000, "0.0.0.0", () => console.log('listening on port 3000: http://176.31.182.223:18080'));
    }

    public log(event: string, ...args: any[]) {
        this.io.emit(event, ...args);
        if (event.startsWith("log_")) {
            console.log(`[${event.replace("log_", "").toUpperCase()}]`, ...args);
        }
    }
}