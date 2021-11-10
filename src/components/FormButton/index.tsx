
import styles from './styles.module.scss';

interface FormButtonProps{
    children: string;
}

export default function FormButton({ children} : FormButtonProps){

    return(
        <button 
            type="submit"
            className={styles.formButton}
        >
            {children}
        </button>
    )
}