import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import puppeteer from 'puppeteer-core';
import log from '../utils/logger.js';   
import { getTimeUsed } from '../utils/helpers.js';

const BROWSER_URL = 'http://localhost:9222';
const FILE_URI = getFileUri();

let _browser = null;

export async function createMapImage(inputData) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    const start = new Date();

    try {
        await page.goto(FILE_URI, { waitUntil: 'networkidle0' });
        const result = await page.evaluate(data => window.mapRenderer.createMapImage(data), inputData);
        const end = new Date();

        log.info(`Generated map image in ${getTimeUsed(start, end)} sec.`);

        return result;
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

function getFileUri() {
    const __filename = fileURLToPath(import.meta.url);
    const currenPath = path.dirname(__filename);
    const filePath = path.join(currenPath, '../html', 'map-renderer.html');
    const url = pathToFileURL(filePath);

    return url.href;
}