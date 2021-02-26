import React from 'react';
import styles from './RoundButton.module.css';
import { iRoundButton } from '../interfaces';

const RoundButton: React.FC<iRoundButton> = (props: iRoundButton) => (
    <button className={styles.roundButton} onClick={props.action}>{props.text}</button>
)

export default RoundButton;