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
    return axios.create({
        baseURL: `http://3.70.72.246:3001/worker/${workerId}`
    });
}

const workerPutUpdateDataApi = (workerId) =>{
    return axios.create({
        baseURL: `http://3.70.72.246:3001/worker/edit/${workerId}`
    });
}

export { adminApi, clientApi, clientSignUpApi, workerSignUpApi, workerPrfileAPI, workerSignInApi, workerGetDataApi, workerPutUpdateDataApi};