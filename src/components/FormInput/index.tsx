import { ChangeEvent, ReactElement } from "react";

import styles from './styles.module.scss';

interface FormInputProps{
    type: string;
    name: string;
    id:string;
    placeholder?: string;
    onChange: ( e : ChangeEvent<HTMLInputElement>) => void;
    children: ReactElement;
}

export default function FormInput({type, name, id, placeholder, onChange, children} : FormInputProps){
    
    return (
        <div className={styles.formInput}>
            {children}
            <input
                type={type}
                name={name}
                id={id} 
                placeholder={placeholder || ''}
                onChange={onChange}
            />
        </div>
    );
}