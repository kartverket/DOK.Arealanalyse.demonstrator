import { useCollapse } from 'react-collapsed';
import styles from './QualityMeasurement.module.scss';

export default function QualityMeasurement({ result }) {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
    const qualityMeasurement = result.qualityMeasurement || [];

    if (!qualityMeasurement.length) {
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
                        qualityMeasurement.map((measurement, index) => {
                            return (
                                <li key={index} className={styles.measurement}>
                                    <span className={styles.dimension}>{measurement.qualityDimensionName}:</span>
                                    <span>{measurement.value}</span>
                                    {
                                        measurement.comment !== null && (
                                            <span>({measurement.comment})</span>
                                        )
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            </section>
        </div>
    );
}