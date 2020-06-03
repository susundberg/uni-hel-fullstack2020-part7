import axios from 'axios'
const baseUrl = '/api/blogs'


let TOKEN = null
const setToken = newToken => { TOKEN = `bearer ${newToken}` }


const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async newObject => {
    const config = { headers: { Authorization: TOKEN }, }
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}
const comment = async (id, comment) => {
    console.log("COMMENT BLOG", id, comment )
    const response = await axios.post(baseUrl + "/" + id + "/comments", {comment})
    return response.data
}

const update = async (obj) => {
    console.log("UPDATE BLOG", obj)
    const response = await axios.put(baseUrl + "/" + obj.id, obj)
    return response.data
}

const remove = async (obj) => {
    console.log("DEL BLOG", obj)
    const config = { headers: { Authorization: TOKEN }, }
    const response = await axios.delete(baseUrl + "/" + obj.id, config)
    return response.data
}

const sort = (blogs) => {
    blogs.sort((a, b) => (  b.likes - a.likes )  )

}
export default { getAll, create, update, remove, setToken, comment, sort }