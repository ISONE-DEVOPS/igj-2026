import axios from 'axios';
import backendURL from './backend'

const axiosServices = axios.create({baseURL: backendURL,});

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

export default axiosServices;