import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import puppeteer from 'puppeteer-core';
import date from 'date-and-time';

const BROWSER_URL = 'http://localhost:9222';
const FILE_URI = getFileUri();

const _wmtsCache = new Map();
let _browser = null;

export async function createMapImage(inputData) {
    if (inputData.wmts) {
        inputData.wmts.capabilities = await getWmtsCapabilities(inputData.wmts);
    }

    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        await page.goto(FILE_URI, { waitUntil: 'networkidle0' });
        return await page.evaluate(data => window.mapRenderer.createMapImage(data), inputData);
    } catch (error) {
        throw error;
    } finally {
        await page.close();
    }
}

async function getBrowser() {
    if (_browser !== null && _browser.connected) {
        return _browser;
    }

    _browser = await puppeteer.connect({ browserURL: BROWSER_URL });

    return _browser;
}

async function getWmtsCapabilities(wmts) {
    const entry = _wmtsCache.get(wmts.url);

    if (entry !== undefined && !shouldRefreshCache(entry)) {
        return entry.capabilities;
    }

    const response = await fetch(wmts.url);
    const text = await response.text();
    const capabilities = Buffer.from(text).toString('base64');

    _wmtsCache.set(wmts.url, { capabilities, timestamp: new Date() });

    return capabilities;
}

function shouldRefreshCache(entry) {
    const now = new Date();
    const diff = date.subtract(now, entry.timestamp);

    return diff.toDays() > 30;
}

function getFileUri() {
    const __filename = fileURLToPath(import.meta.url);
    const currenPath = path.dirname(__filename);
    const filePath = path.join(currenPath, 'html', 'map-renderer.html');
    const url = pathToFileURL(filePath);

    return url.href;
}