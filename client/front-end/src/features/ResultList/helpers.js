export function getResultClassNames(result, styles) {
    const classNames = [];

    switch (result.resultStatus) {
        case 'NO-HIT-GREEN':
            classNames.push(styles.success);
            break;
        case 'NO-HIT-YELLOW':
            classNames.push(styles.redwarning);
            break;
        case 'HIT-YELLOW':
            classNames.push(styles.warning);
            break;
        case 'HIT-RED':
            classNames.push(styles.error);
            break;
        default:
            break;
    }

    return classNames.join(' ');
}

export function getResultTitle(result) {
    const datasetTitle = result.runOnDataset ?
        `«${result.runOnDataset.title}»${result.title !== null ? `\r\n(${result.title})` : ''}` :
        `«${result.title}»`

    switch (result.resultStatus) {
        case 'NO-HIT-GREEN':
            return `Området er utenfor ${datasetTitle}`;
        case 'NO-HIT-YELLOW':
            return `Området har ikke treff for ${datasetTitle}`;
        case 'HIT-YELLOW':
            return `Området har treff i ${datasetTitle}`;
        case 'HIT-RED':
            return `Området er i konflikt med ${datasetTitle}`;
        default:
            return '';
    }
}

export function getDistance(result) {
    let distance = result.distanceToObject;

    if (distance >= 20_000) {
        distance = 20_000;
        return `> ${distance.toLocaleString('nb-NO')} m`
    }

    return `${distance.toLocaleString('nb-NO')} m`
}

export function getHitAreaPercent(result) {
    const percent = (result.hitArea / result.inputGeometryArea) * 100;
    const rounded = Math.round((percent + Number.EPSILON) * 100) / 100;

    return `${rounded.toLocaleString('nb-NO')} %`
}