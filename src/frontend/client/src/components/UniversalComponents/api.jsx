import axios from 'axios';

const address = window.RUNTIME_CONFIG?.SERVER_IP

const api = axios.create({
    baseURL: `https://${address}`,
    withCredentials: true
});

// adding token globally to all requests
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");
//         if(token) {
//             config.headers.Authorization = `Token ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// logging out user if get 401
api.interceptors.response.use(
    response => response,
    (error) => {
        if(error.response && error.response.status === 401) {
            localStorage.clear();
            //window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;