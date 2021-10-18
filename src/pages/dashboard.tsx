import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"



export default function Dashboard(){

    const { user } = useAuth()

    useEffect(() => {
        api.get<any>('/me')
        .then(response => console.log(response.data))
        .catch( error => console.log(error))
    }, [])
    
    return <h1>Dashboard: {`${user?.email}`}</h1>
}

export const getServerSideProps = withSSRAuth( async(context) => {
    return {
        props:{}
    }
})