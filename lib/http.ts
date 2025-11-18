import axios from "axios"
const baseURL = process.env.NEXT_PUBLIC_API_URL
const client = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})

client.interceptors.request.use((config) => {
  return config
})

client.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error)
  }
)

export default client