import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${import.meta.env.VITE_API_ACCESS_TOKEN}`

  return config
})

export default instance
