import axios from 'axios'

const customAxios = axios.create({
  baseURL: 'http://0.0.0.0:9080',
})

export default customAxios
