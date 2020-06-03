
import service from '../services/blogs'
import { createNotification } from './notification'

const sortState = (items) => (
    items.sort((a, b) => (b.likes - a.likes))
)

const initialState = []

const reducer = (state = initialState, action) => {
    let changed = null

    switch (action.type) {
        case 'BLOG_UPDATE':
            changed = action.data
            console.log("Update:", changed.id, changed)
            return sortState(state.map(x => x.id === changed.id ? changed : x))
        case 'BLOG_CREATE':
            return sortState(state.concat(action.data))
        case 'BLOG_INIT':
            return sortState(action.data)
        case 'BLOG_REMOVE':
            changed = action.data
            return sortState(state.filter(x => x.id === changed.id ? false : true))
        default:
            return state

    }
}
// const vote = (id) => {
//   return async (dispatch) => {
//     console.log('Vote', id)
//     const object = await service.vote(id)
//     dispatch({ type: 'UPDATE', data: { object } })
//   }
// }

const createBlog = (content) => {
    return async (dispatch, getState) => {
        console.log('Create', content)
        try {
            const object = await service.create(content)
            dispatch({
                type: 'BLOG_CREATE',
                data: object
            })
            createNotification(`Created: ${object.title} by ${object.author}`, 2)(dispatch, getState)
        }
        catch (error) {
            console.log("Caught error:", error.response)
            createNotification(`Cannot delete: ${error.response.data.error}`, 5)(dispatch, getState)
        }

    }
}

const initBlogs = () => {
    return async dispatch => {
        const blogs = await service.getAll()
        dispatch({
            type: 'BLOG_INIT',
            data: blogs,
        })
    }
}

const removeBlog = (blog) => {
    return async (dispatch, getState) => {
        console.log("Remove", blog)

        try {
            const object = await service.remove(blog)
            createNotification(`Blog ${blog.title} by ${blog.author} removed!`, 2)(dispatch, getState)

            dispatch({
                type: 'BLOG_REMOVE',
                data: object,
            })
        } catch (error) {
            createNotification(`Cannot delete: ${error.response.data.error}`, 5)(dispatch, getState)
        }



    }
}

const commentBlog = (blog, comment ) => {
    return async dispatch => {
        const resp = await service.comment( blog.id, comment )
        dispatch({
            type: 'BLOG_UPDATE',
            data: resp,
        })
    }
}

const likeBlog = (blog) => {
    return async dispatch => {
        const resp = await service.update({ id: blog.id, likes: (blog.likes + 1) })
        console.log("Update response:", resp)

        dispatch({
            type: 'BLOG_UPDATE',
            data: resp,
        })
    }
}

export default reducer
export { createBlog, initBlogs, likeBlog, removeBlog, commentBlog }