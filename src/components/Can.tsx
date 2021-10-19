import { ReactNode } from "react";
import { useCan } from "../hooks/useCan";

interface CanProps{
    children: ReactNode;
    permissions?: string[];
    roles?: string[];
}

export default function Can({ children, permissions, roles} : CanProps){

    const userHasPermissions = useCan({ permissions, roles });

    if(!userHasPermissions){
        return null;
    }

    return(
        <>
            {children}
        </>
    )
}