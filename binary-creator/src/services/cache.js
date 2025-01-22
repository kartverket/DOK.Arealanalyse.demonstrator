import fs from 'node:fs';
import path from 'node:path';
import Keyv from 'keyv';
import mime from 'mime-types';
import date from 'date-and-time';
import { v4 as uuidv4 } from 'uuid';
import log from '../utils/logger.js';
import config from '../utils/config.js';
import { KeyvFile } from 'keyv-file';

const keyv = setupCache();

export async function getResource(url) {
    const entry = await keyv.get(url);

    if (entry === undefined) {
        return await fetchResource(url);
    }

    if (!fs.existsSync(entry)) {
        await keyv.delete(url);

        return await fetchResource(url);
    } else if (hasCacheExpired(entry)) {
        await keyv.delete(url);
        fs.unlinkSync(entry);

        return await fetchResource(url);
    }

    const buffer = loadResource(entry);

    if (buffer === null) {
        return await fetchResource(url);
    }

    const fileName = path.basename(entry);
    const contentType = mime.contentType(fileName)

    return {
        resource: {
            data: buffer,
            contentType
        },
        status: {
            code: 200,
            text: 'OK'
        }
    };
}

async function fetchResource(url) {
    try {
        const response = await fetch(url);

        if (response.status !== 200) {
            log.warn(`Could not fetch resource: ${url} (status ${response.status})`);

            return {
                resource: null,
                status: {
                    code: response.status,
                    text: response.statusText
                }
            };
        }

        const blob = await response.blob();
        const buffer = Buffer.from(await blob.arrayBuffer());
        const filePath = createFilePath(blob);

        saveResource(filePath, buffer);
        await keyv.set(url, filePath);

        return {
            resource: {
                data: buffer,
                contentType: blob.type
            },
            status: {
                code: response.status,
                text: response.statusText
            }
        };
    } catch (error) {
        log.error(error);

        return {
            resource: null,
            status: {
                code: 500,
                text: 'Internal server error'
            }
        };
    }
}

function loadResource(path) {
    try {
        return fs.readFileSync(path);
    } catch (error) {
        log.error(error);
        return null;
    }
}

function saveResource(path, buffer) {
    try {
        fs.createWriteStream(path).write(buffer);
        return true;
    } catch (error) {
        log.error(error);
        return false;
    }
}

function hasCacheExpired(path) {
    const stats = fs.statSync(path);

    return date.subtract(new Date(), stats.mtime).toDays() >= config.CACHE_DAYS;
}

function createFilePath(blob) {
    const ext = mime.extension(blob.type);
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = path.join(config.CACHE_DIR, fileName);

    return filePath;
}

function setupCache() {
    if (!fs.existsSync(config.CACHE_DIR)) {
        fs.mkdirSync(config.CACHE_DIR, { recursive: true });
    }

    const store = new KeyvFile({
        filename: `${config.CACHE_DIR}/cache.json`,
        writeDelay: 100
    });

    return new Keyv({ store });
}