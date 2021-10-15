import { FormEvent, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

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
        <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Digite seu email"
              onChange={e => setEmail(e.target.value)} />

            <input
              type="password"
              name="password"
              id="password"
              placeholder="Digite sua senha"
              onChange={ e =>setPassword(e.target.value)} />

            <button type="submit"> Entrar </button>
        </form>
    )
}