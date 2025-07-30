import React, { useState } from "react";
import { useContext,createContext } from "react";
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)


export const AuthProvider = ({children}) => {
    const [user,SetUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)



    const login = async ({email,password}) =>{
        try{
            const res = await axios.post("http://localhost:8000/api/v1/login/" , 
                {email,
                password
                },
                {
                    withCredentials : true
                }
            )
            setAccessToken(res.data.access);
            return {success : true , message : res.data.message}
        }
        catch(err){
            const errmssg = err.response?.data?.error || "Login failed. Please try again."
            return {success : false , message : errmssg}
        }
    }

    const value = {
        user,
        accessToken,
        login
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}