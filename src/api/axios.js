import axios from 'axios';

const adminApi = axios.create({
    baseURL: 'http://3.70.72.246:3001/admin/login'
});


const clientApi = axios.create({
    baseURL: 'http://3.70.72.246:3001/auth/login'
});

const clientSignUpApi = axios.create({
    baseURL: 'http://3.70.72.246:3001/auth/signup'
});

// const workerSignUpApi = (workerId) => {
//     return axios.create({
//         baseURL: `http://3.70.72.246:3001/worker/${workerId}`
//     });
// } 

const workerSignUpApi = axios.create({
    baseURL: `http://3.70.72.246:3001/auth/worker/signup`
});

const workerSignInApi = axios.create({
    baseURL:'http://3.70.72.246:3001/auth/worker/login'
})

const workerPrfileAPI = axios.create({
    baseURL: 'http://3.70.72.246:3001/worker/edit/:workerid'
});


const workerGetDataApi = (workerId) =>{
    return axios.get(`http://3.70.72.246:3001/worker/${workerId}`);
}

const workerPutUpdateDataApi = (workerId) =>{
    return axios.create({
        baseURL: `http://3.70.72.246:3001/worker/edit/${workerId}`
    });
}

const serviceApi = (workerId) =>{
    return axios.create({
        baseURL: `http://3.70.72.246:3001/worker/add/${workerId}`
    });
}
const Rating = (workerId) => {
    return axios.create({
        baseURL: `http://3.70.72.246:3001/worker/${workerId}`
    })
}

const deleteService = (workerId, serviceId) => {
    return axios.create({
        baseURL: `http://3.70.72.246:3001/worker/${workerId}/service/${serviceId}`
    })
}

const searchAPI = axios.create({
    baseURL: 'http://3.70.72.246:3001/shareable/search',})



const workerGetOrdersApi = axios.create({
    baseURL: 'http://3.70.72.246:3001',
})

axios.defaults.withCredentials = true;

axios.interceptors.request.use(request => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        request.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return request;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    response => response, // Directly return successful responses.
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
            try {
                const refreshToken = localStorage.getItem('refreshToken'); // Retrieve the stored refresh token.
                // Make a request to your auth server to refresh the token.
                const response = await axios.post('https:3.70.72.246:3001/auth/refresh', {
                    refreshToken,
                });
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                // Store the new access and refresh tokens.
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                // Update the authorization header with the new access token.
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                return axios(originalRequest); // Retry the original request with the new access token.
            } catch (refreshError) {
                // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/chooselogin';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error); // For all other errors, return the error as is.
    }
);

export { adminApi, clientApi, clientSignUpApi, workerSignUpApi, workerPrfileAPI, workerSignInApi, workerGetDataApi, workerPutUpdateDataApi,serviceApi,Rating,deleteService, searchAPI, workerGetOrdersApi};