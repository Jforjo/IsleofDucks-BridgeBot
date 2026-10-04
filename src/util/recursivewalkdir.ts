import { resolve } from 'path';
import { readdir } from 'fs/promises';
import type Logger from '../logger.ts';
import { pathToFileURL } from 'url';

export default async function recursiveWalkDir(
    path = "",
    callback: (path: string) => Promise<void>,
    logger: Logger,
    errMessage: string
) {
    if (path.includes('src\\events') || path.includes('src/events')) return;
    const filesInPath = await readdir(path, { withFileTypes: true });

    await Promise.all(
        filesInPath.map((fileInPath) => {
            const resolvedPath = resolve(path, fileInPath.name);
            return fileInPath.isDirectory()
                ? recursiveWalkDir(resolvedPath, callback, logger, errMessage)
                : callback(pathToFileURL(resolvedPath).href);
        })
    ).catch((error) => {
        logger.log('log_error', errMessage, error);
    });
};
