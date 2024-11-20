import { useMemo, useRef, useState } from 'react';
import { prettyPrintJson } from 'pretty-print-json';
import { getCrsName, getEpsgCode } from 'utils/helpers';
import { IconButton } from '@mui/material';
import { Check, ContentCopy } from '@mui/icons-material';
import styles from './GeoJson.module.scss';

export default function GeoJson({ data }) {
    const json = useMemo(() => prettyPrintJson.toHtml(data, { quoteKeys: true, trailingCommas: false }), [data]);
    const [copied, setCopied] = useState(false);
    const outputRef = useRef(null);

    function renderCrs() {
        const epsg = getEpsgCode(getCrsName(data));
        const crs = epsg !== null ? `EPSG:${epsg}` : 'WGS84';

        return (
            <div className={styles.epsg}>
                <strong>CRS:</strong> {crs}
            </div>
        );
    }

    async function copyText() {
        await navigator.clipboard.writeText(outputRef.current.textContent)

        const timeout = setTimeout(() => {
            setCopied(false);
            clearTimeout(timeout);
        }, 1500);

        setCopied(true);
    }

    return (
        <div className={styles.geoJsonContainer}>
            <div className={styles.geoJsonWrapper}>
                <div className={styles.geoJson}>
                    <output ref={outputRef} dangerouslySetInnerHTML={{ __html: json }}></output>
                </div>

                <IconButton
                    onClick={copyText}
                    title="Kopiér"
                    className={styles.copyButton}
                >
                    {
                        !copied ?
                            <ContentCopy fontSize="1.5rem" /> :
                            <Check fontSize="1.5rem" />
                    }
                </IconButton>
            </div>

            {renderCrs()}
        </div>
    );
}