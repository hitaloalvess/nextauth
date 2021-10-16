import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../contexts/AuthContext';

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue = [];

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
            console.log('Token expirado = ' + error.response.data?.code)
            //realiza refresh token
            cookies = parseCookies();

            const { 'nextauth.refreshToken' : refreshToken } = cookies
            const originalConfig = error.config; // armazena todas as configurações da requisição

            if(!isRefreshing){
                isRefreshing = true;

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

                    //Executa novamente todas as requisições que falharam por token inválido, com a situação de sucesso do refreshToken
                    failedRequestsQueue.forEach(request => request.onSuccess(token));
                    failedRequestsQueue = [];
                })
                .catch((error)  => {
                        //Executa novamente todas as requisições que falharam por token inválido, com a situação de falha do refreshToken
                        failedRequestsQueue.forEach(request => request.onFailure(error));
                        failedRequestsQueue = [];
                    }
                )
                .finally(() => isRefreshing = false);
            }

            return new Promise((resolve, reject) => { //Utilizado para tornar o código assíncrono dentro do intercept
                failedRequestsQueue.push({
                    onSuccess: (token : string) => {
                        originalConfig.headers['Authorization'] = `Bearer ${token}`

                        resolve(api(originalConfig));
                    },
                    onFailure: (error : AxiosError) => {
                        reject(error)
                    }
                })
            })
        }else{//Cai aqui quando da algum erro de não autorizado , que não seja token expirado
            console.log('cai aqui = '+ error.response.data?.code) 
            //desloga o usuário
            signOut();

        }
    }

    return Promise.reject(error); //Caso o erro não cai nos if's acima, isso deixa que o erro do axios continue acontecendo, para que assim seja tratado dentro dos catch's da própria requisição
})