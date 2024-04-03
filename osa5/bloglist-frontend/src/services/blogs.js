import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  console.log('req=',request)
  return request.then(response => response.data)
}

const getItem = async(id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data

}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  console.log('response', response.data)
  return response.data
}

const deleteWithId = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const addLike = async (blog) => {
  const newLikes = blog.likes + 1
  const bloguser = blog.user

  const blogObject = {
    likes: newLikes,
    author: blog.author,
    title: blog.title,
    url: blog.url,
    user: bloguser.id
  }
  const url = `${baseUrl}/${blog.id}`
  const response = await axios.put(url, blogObject)
  return response.data
}

export default { getAll, getItem, create, setToken, deleteWithId, addLike }