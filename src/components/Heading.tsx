import React from 'react';
import styles from '/src/components/Heading.module.css';


const Heading: React.FC = () => (
    <section className={styles.allHeading}>
        <div className={styles.mainHeadline}>Jordan&apos;s Jumpin&apos; Jive Jukebox</div>
        <div className={styles.subHeadline}>Screw You, Google Play Music!</div>
    </section>
)

export default Heading