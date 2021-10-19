import { validateUserPermissions } from "../utils/validateUserPermissions";
import { useAuth } from "./useAuth";


interface useCanParams{
    permissions?: string[];
    roles?: string[];
}

export function useCan({ permissions, roles} : useCanParams){

    const { user, isAuthenticated } = useAuth();
    
    //Se usuário não estiver autenticado
    if(!isAuthenticated){
        return false;
    }

    const userHasValidPermissions = validateUserPermissions({
        user,
        permissions, 
        roles
    })

    return userHasValidPermissions;
}