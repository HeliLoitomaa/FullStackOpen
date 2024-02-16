import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {   
    return axios.get(baseUrl)
}

const getPerson = (id) => {   
    return axios.get(`${baseUrl}/${id}`)
}

const updatePerson = (id, person) => {
    return axios.put(`${baseUrl}/${id}`, person)
}

const create = (newPerson) => {
    return axios.post(baseUrl, newPerson)
}

const removeWithId = (id) => {
    return axios.delete(`${baseUrl}/${id}`)  
}

export default {getAll, getPerson, updatePerson, create, removeWithId}
