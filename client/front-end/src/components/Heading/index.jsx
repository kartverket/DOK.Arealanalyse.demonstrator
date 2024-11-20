import logo from 'assets/gfx/logo-kartverket.svg';
import styles from './Heading.module.scss';

export default function Heading() {
    return (
        <div className={styles.heading}>
            <img src={logo} alt="Kartverket logo" />
            <h1>Arealanalyse av DOK-datasett - Demonstrator</h1>
            <a href="https://dok-arealanalyse-api.azurewebsites.net/" target="_blank" rel="noopener noreferrer" className={styles.apiLink}>API</a>
        </div>
    );
}