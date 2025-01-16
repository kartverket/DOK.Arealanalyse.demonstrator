import NodeCache from 'node-cache';
import 'dotenv/config';
import log from '../utils/logger.js';   

const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL_SECS });

export async function getResource(base64Str) {
    const entry = cache.get(base64Str);

    if (entry) {
        return { 
            resource: entry,
            status: {
                code: 200,
                text: 'OK'
            }
        };
    }

    try {
        const url = getUrl(base64Str);
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
        const base64Res = buffer.toString('base64');

        const resource = {
            data: base64Res,
            contentType: blob.type
        };

        cache.set(base64Str, resource);

        return { 
            resource,
            status: {
                code: response.status,
                text: response.statusText
            }
        };
    } catch (error) {
        log.error(error);

        return { 
            resource, 
            status: {
                code: 500,
                text: 'Internal server error'
            }
        };
    }
}

function getUrl(base64Str) {
    const buffer = Buffer.from(base64Str, 'base64');

    return buffer.toString('utf8');
}
