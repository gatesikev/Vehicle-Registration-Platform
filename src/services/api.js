import axios from 'axios'

const api = axios.create({
  baseURL: 'https://student-management-system-backend.up.railway.app/api/vehicle-service',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api