export async function parseJsonFile(file) {
    try {
        const text = await file.text();
        return JSON.parse(text);
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function getFileType(file) {
    const extension = getExtension(file);

    switch (extension) {
        case 'json':
        case 'geojson':
            return 'geojson';
        case 'sos':
        case 'sosi':
            return 'sosi'
        case 'gml':
            return 'gml';
        default:
            return null;
    }
}

function getExtension(file) {
    return file.name.split('.').pop();
}

