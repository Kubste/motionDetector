import styles from './MainPageCard.module.css';

function MainPageCard({Icon, description}) {

    return(
        <div className={styles.MainPageCard}>
            <Icon size={40}></Icon>
            <h2>{description}</h2>
        </div>
    );
}

export default MainPageCard;