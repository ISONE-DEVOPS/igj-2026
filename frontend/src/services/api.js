import axios from 'axios';
import backendURL from './backend'

const api = axios.create({baseURL: backendURL,});

export default api;