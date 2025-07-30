import axios from "axios";


let logoutFn;

export const setLogoutFn = (fn) => {
    logoutFn = fn
}

const api = axios.create({
    baseURL : "http://localhost:8000/api/v1",
    withCredentials : true

})


api.interceptors.response.use(
    (response)=>response,
    async (error) => {
        const originReq = error.config

        if(error.response && error.response.status==401 && !originReq._retry){
            originReq._retry = true
            try{
                const refresh_token = await axios.post("http://localhost:8000/api/v1/token/refresh/",
                    {},
                    {withCredentials:true}
                )
                const newRefreshToken = refresh_token.data.access
                setAccessToken(newRefreshToken)
                originReq.headers['Authorization'] = `Bearer ${newRefreshToken}`
                return api(originReq)
            }
            catch(eror){
                console.log("Refresh Token Expired")
                if(logoutFn){
                    logoutFn()
                }
            }
        }
        return Promise.reject(error)
    }

    
)

export default api