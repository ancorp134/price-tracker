

let token = null

export const setAccessToken = (newtoken) => {
    token = newtoken
}

export const getAccessToken = () => token;