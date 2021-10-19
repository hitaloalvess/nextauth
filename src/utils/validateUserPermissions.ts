
type User = {
    permissions?: string[];
    roles?: string[];
}

interface ValidateUserPermissionsParams{
    user: User;
    permissions?: string[];
    roles?: string[];
}

export function validateUserPermissions({ user, permissions, roles} : ValidateUserPermissionsParams){

    if(permissions?.length > 0){
        const hasAllPermissions = permissions.every(permission => {//retorna true somente se user conter todas as permissions
            return user.permissions.includes(permission);
        })

        if(!hasAllPermissions){
            return false;
        }
    }

    if(roles?.length > 0){
        const hasRoles = roles.some(role => {//retorna true se user conter algum role contida em roles
            return user.roles.includes(role);
        })

        if(!hasRoles){
            return false;
        }
    }

    return true;
}