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

const workerSignUpApi = (workerId) => {
    return axios.create({
        baseURL: `http://3.70.72.246:3001/worker/${workerId}`
    });
} 

const workerPrfileAPI = axios.create({
    baseURL: 'http://3.70.72.246:3001/worker/edit/:workerid'
});

export { adminApi, clientApi, clientSignUpApi, workerSignUpApi, workerPrfileAPI};