import { useEffect } from "react"
import Can from "../components/Can"
import { useAuth } from "../hooks/useAuth"
import { setupAPIClient } from "../services/api"
import { api } from "../services/apiClient"
import { withSSRAuth } from "../utils/withSSRAuth"



export default function Dashboard(){

    const { user, signOut } = useAuth()

    useEffect(() => {
        api.get<any>('/me')
        .then(response => console.log(response.data))
        .catch( error => console.log(error))
    }, [])
    
    return (
        <>
            <h1>Dashboard: {`${user?.email}`}</h1>
            <Can permissions={['metrics.list']}>
                <div>Métricas</div>
            </Can>
            <button onClick={signOut}>SignOut</button>
        </>
    )
}

export const getServerSideProps = withSSRAuth( async(context) => {

    const apiClient = setupAPIClient(context)
    const response = await apiClient.get('/me');

    console.log(response.data);

    return {
        props:{}
    }
})