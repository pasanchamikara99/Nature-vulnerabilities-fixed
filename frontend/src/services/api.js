import axios from 'axios';

const api = axios.create({
   
    baseURL: "http://localhost:8000",
    withCredentials: true,

});

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`);