import axios from 'axios';

const api = axios.create({
    baseURL: 'https://192.168.100.7',
});

// logging out user if get 401
api.interceptors.response.use(
    response => response,
    (error) => {
        if(error.response && error.response.status === 401) {
            sessionStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;