import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

let cookies = parseCookies();

export const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}` //Faz com que o token seja passado para todas as requisições 
    }
})

api.interceptors.response.use( response => {
    return response;
}, ( error : AxiosError<any> ) => {
    if(error.response.status === 401){
        if(error.response.data?.code === 'token.expired'){
            //realiza refresh token
            cookies = parseCookies();

            const { 'nextauth.refreshToken' : refreshToken } = cookies

            api.post<any>('/refresh', { refreshToken })
            .then( response => {
                const { token } = response.data;

                //Armazena o token e refresh token do usuário
                setCookie(undefined, 'nextauth.token', token, {
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: '/'
                })

                setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: '/'
                })

                //Atualiza o token passado no cabeçalho das requisições
                api.defaults.headers['Authorization'] = `Bearer ${token}`
            })
        }else{
            //desloga o usuário
        }
    }
})