import styles from './MainPageCard.module.css';

function MainPageCard({Icon, description, onClick}) {

    return(
        <div className={styles.MainPageCard} onClick={onClick}>
            <Icon size={40}></Icon>
            <h2>{description}</h2>
        </div>
    );
}

export default MainPageCard;