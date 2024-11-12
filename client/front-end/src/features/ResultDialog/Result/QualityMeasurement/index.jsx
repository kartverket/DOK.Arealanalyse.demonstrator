import { useCollapse } from 'react-collapsed';
import styles from './QualityMeasurement.module.scss';
import { useMemo } from 'react';

const ORDER = [
    'egnethet_reguleringsplan',
    'egnethet_kommuneplan',
    'egnethet_byggesak',
];

export default function QualityMeasurement({ result }) {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
    const _qualityMeasurement = result.qualityMeasurement || [];

    const qualityMeasurement = useMemo(
        () => {
            return ORDER
                .map(id => _qualityMeasurement.find(qm => qm.qualityDimensionId === id) || null)
                .filter(qm => qm !== null);
        },
        [_qualityMeasurement]
    );

    if (!_qualityMeasurement.length) {
        return null;
    }

    return (
        <div className={`expandable ${isExpanded ? 'expanded' : ''}`}>
            <div className="trigger" role="button" {...getToggleProps()}>
                Kvalitetsinformasjon
            </div>

            <section {...getCollapseProps()}>
                <ul className={styles.ul}>
                    {
                        qualityMeasurement.map(measurement => {
                            return (
                                <li key={measurement.qualityDimensionId} className={styles.measurement}>
                                    <span className={styles.dimension}>{measurement.qualityDimensionName}:</span>
                                    <span>{measurement.value}</span>
                                    <span>({measurement.comment})</span>
                                </li>
                            )
                        })
                    }
                </ul>
            </section>
        </div>
    );
}