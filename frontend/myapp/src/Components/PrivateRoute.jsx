import React from "react";
import { useAuth } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

function PrivateRoute ({children}) {
    const {accessToken} = useAuth()
    

    if(!accessToken){
        return <Navigate to='/login' replace></Navigate>
    }

    return children
}

export default PrivateRoute