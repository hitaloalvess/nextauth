import { FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { withSSRGuest } from "../utils/withSSRGuest";
import { BiEnvelope, BiLockAlt } from 'react-icons/bi'

import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";

import styles from './home.module.scss';

export default function Home(){

    const { signIn } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    async function handleSubmit(event : FormEvent){
        event.preventDefault();

        const data = {
            email, password
        }

        await signIn(data);
    }

    return (
        <main className={styles.container}>
            <section className={styles.image}>
                <img src="/images/bg-home.png" alt="background home" />
            </section>
            <section className={styles.signIn}>
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <FormInput
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Digite seu email"
                        onChange={e => setEmail(e.target.value)}
                    >
                        <BiEnvelope />
                    </FormInput>

                    <FormInput 
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Digite sua senha"
                        onChange={ e =>setPassword(e.target.value)}
                    >
                        <BiLockAlt />
                    </FormInput>
                    <FormButton> Entrar </FormButton>
                </form>
            </section>
        </main>
    )
}

export const getServerSideProps = withSSRGuest(async() => {
    
    return {
        props:{
        }
    }
});