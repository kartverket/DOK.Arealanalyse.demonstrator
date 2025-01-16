export function getTimeUsed(start, end) {
    const secs = (end.getTime() - start.getTime()) / 1000;
    const rounded = Math.round((secs + Number.EPSILON) * 100) / 100;

    return rounded;
}