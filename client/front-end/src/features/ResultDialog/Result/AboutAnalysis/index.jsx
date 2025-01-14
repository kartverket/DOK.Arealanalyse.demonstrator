import { useCollapse } from 'react-collapsed';
import styles from './AboutAnalysis.module.scss';

export default function AboutAnalysis({ result }) {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

    function getDistanceToObject() {
        return result.distanceToObject <= 20000 ?
            `${result.distanceToObject.toLocaleString('nb-NO')} m` :
            `> 20 000 m`;
    }

    function getInputGeometryArea() {
        return Math.round(result.inputGeometryArea).toLocaleString('nb-NO');
    }

    function getHitArea() {
        return Math.round(result.hitArea).toLocaleString('nb-NO');
    }

    function getHitAreaPercent() {
        const percent = (result.hitArea / result.inputGeometryArea) * 100;
        const rounded = Math.round((percent + Number.EPSILON) * 100) / 100;

        return rounded.toLocaleString('nb-NO');
    }

    return (
        <div className={`expandable ${isExpanded ? 'expanded' : ''}`}>
            <div className="trigger" role="button" {...getToggleProps()}>
                Om analysen
            </div>

            <section {...getCollapseProps()}>
                <ul className={styles.ul}>
                    <li>
                        Algoritmer kjørt:
                        <ol>
                            {
                                result.runAlgorithm.map((algorithm, index) => <li key={index}>{algorithm}</li>)
                            }
                        </ol>
                    </li>
                    <li>
                        Buffer brukt: {result.buffer.toLocaleString('nb-NO')} m
                    </li>
                    {
                        result.distanceToObject > 0 && (
                            <li>Avstand til nærmeste objekt: {getDistanceToObject()}</li>
                        )
                    }
                    {
                        result.inputGeometryArea > 0 && (
                            <li>Områdeareal: {getInputGeometryArea()} m²</li>
                        )
                    }
                    {
                        result.hitArea !== null && (
                            <li>Treffareal: {getHitArea()} m² ({getHitAreaPercent()} %)</li>
                        )
                    }
                </ul>
            </section>
        </div>
    );
}