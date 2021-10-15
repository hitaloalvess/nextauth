import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../services/api";
import Router from 'next/router';

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

export function AuthProvider( { children }  : AuthProviderProps){

    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;

    async function signIn({email, password}){

        
        try{
            const response = await api.post<any>('/sessions', {
                email, password
            });

            const { permissions, roles } = response.data;

            setUser({
                email,
                permissions,
                roles
            })

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