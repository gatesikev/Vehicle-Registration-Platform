import axios from 'axios'

const api = axios.create({
  baseURL: 'https://vehicle-registration-api-qpwz.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api