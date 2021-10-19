import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";
import decode from 'jwt-decode'
import { validateUserPermissions } from "./validateUserPermissions";

interface WithSSRAuthOptions{
    permissions: string[];
    roles: string[];
}

export const withSSRAuth = <P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptions)  =>  {

    return async(context : GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(context);
        const token = cookies['nextauth.token'];

        if(!cookies['nextauth.token']){
            return{
                redirect:{
                    destination: '/',
                    permanent:false
                }
            }
        }

        if(options){
            const user = decode(token);
            const { permissions, roles } = options;

            const hasValidPermissions = validateUserPermissions({
                user,
                permissions,
                roles
            })

            if(!hasValidPermissions){
                return {
                    redirect:{
                        destination:'/dashboard',
                        permanent:false
                    }
                }
            }
        }

        try{
            return await fn(context)
        }catch(error){
            if(error instanceof AuthTokenError){

                destroyCookie(context, 'nextauth.token');
                destroyCookie(context, 'nextauth.refreshToken');

                return {
                    redirect:{
                        destination: '/',
                        permanent:false
                    }
                }
            }
        }
    }
}