import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/apiClient";
import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

type User = {
    email: string;
    permissions: string[];
    roles: string[];
}

interface SignInCredentials{
    email:string;
    password:string;
}

type AuthContextData = {
    signIn: (credentials : SignInCredentials) => Promise<void>;
    user: User;
    isAuthenticated: boolean;
}

interface AuthProviderProps{
    children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function signOut(){ //desloga o usuário
    destroyCookie(undefined, 'nextauth.token');
    destroyCookie(undefined, 'nextauth.refreshToken');

    Router.push('/')
}
export function AuthProvider( { children }  : AuthProviderProps){

    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;

    useEffect( () => { //Armazena os dados do usuário toda vez que ele entrar na página
        const { 'nextauth.token' : token } = parseCookies()

        if(token){
            api.get<any>('/me')
            .then( response => {
                const { email, permissions, roles } = response.data

                setUser({email, permissions, roles})
            })
            .catch(() => {//Se cair aqui, quer dizer que provavelmente o token não é mais válido
                signOut();
            })
        }
    }, [])

    async function signIn({email, password}){

        
        try{
            const response = await api.post<any>('/sessions', {
                email, password
            });

            const { token, refreshToken ,permissions, roles } = response.data;

            //Armazena o token e refresh token do usuário
            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'
            })

            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'
            })

            //Salva os dados do usuário
            setUser({
                email,
                permissions,
                roles
            })

            //Atualiza o token passado no cabeçalho das requisições
            api.defaults.headers['Authorization'] = `Bearer ${token}` 

            Router.push('/dashboard');

        }catch(error){
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, signIn, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);