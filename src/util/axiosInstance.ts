// src/api/axiosInstance.ts
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://assignment.devotel.io'
})

export default axiosInstance
