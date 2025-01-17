import fs from 'node:fs';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import date from 'date-and-time';
import NodeCache from 'node-cache';
import log from '../utils/logger.js';
import config from '../utils/config.js';

const cache = new NodeCache();

if (!fs.existsSync(config.CACHE_DIR)) {
    fs.mkdirSync(config.CACHE_DIR, { recursive: true });
}

export async function getResource(base64Str) {
    const entry = cache.get(base64Str);

    if (entry === undefined) {
        return await fetchResource(base64Str);
    }

    if (!fs.existsSync(entry)) {
        cache.del(base64Str);

        return await fetchResource(base64Str);
    } else if (hasCacheExpired(entry)) {
        cache.del(base64Str);
        fs.unlinkSync(entry);

        return await fetchResource(base64Str);
    }

    const buffer = loadResource(entry);

    if (buffer === null) {
        return await fetchResource(base64Str);
    }

    return {
        resource: {
            data: buffer,
            contentType: mime.contentType(entry)
        },
        status: {
            code: 200,
            text: 'OK'
        }
    };
}

async function fetchResource(base64Str) {
    try {
        const url = getUrlFromBase64(base64Str);
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
        cache.set(base64Str, filePath);

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

function getUrlFromBase64(base64Str) {
    return Buffer.from(base64Str, 'base64').toString('utf8');
}
