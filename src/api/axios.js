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

const workerSignUpApi = axios.create({
    baseURL: 'http://3.70.72.246:3001/worker/66de0492e489a3e530a6ff5e'
});

export { adminApi, clientApi, clientSignUpApi, workerSignUpApi};