import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const req = axios.get(baseUrl)
  return req.then(res => res.data)
}

const create = (nameObject) => {
  const req = axios.post(baseUrl, nameObject)
  return req.then(res => res.data)
}

const remove = (id) => {
  console.log(`${baseUrl}/${id}`);
  
  const req = axios.delete(`${baseUrl}/${id}`)
  return req.then(res => res.data)
}

export default {getAll, create, remove}
