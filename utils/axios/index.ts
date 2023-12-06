import axios from "axios";

axios.defaults.withCredentials = true;

export const instance = axios.create({
    baseURL: "/api"
});
