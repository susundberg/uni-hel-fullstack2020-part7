

import service from '../services/login'
import blogService from '../services/blogs'
import { createNotification } from './notification'

const initialState = { username: null }

const reducer = (state = initialState, action) => {
    console.log("user state", state)
    console.log("user action", action)

    switch (action.type) {
        case "USER_LOGIN":
            return { ...state, username: action.data.username, user: action.data }
        case "USER_LOGOUT":
            return { username: null }
        case "USERS_INIT":
            return { ...state, users : action.data }
        default:
            return state
    }

}
const login = (username, password) => {
    return async (dispatch, getState) => {
        try {
            const user = await service.login({
                username, password,
            })
            dispatch({
                type: 'USER_LOGIN',
                data: user
            })
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            blogService.setToken(user.token)
            createNotification("Logged in", 2)(dispatch, getState)

        } catch (exception) {
            console.log("LOGIN FAILED!") // setErrorMessage('Wrong credentials', 5)
            createNotification("Login failed", 5)(dispatch, getState)

        }
    }
}

const logout = () => {
    return async dispatch => {
        console.log("Logout")
        blogService.setToken(null)
        window.localStorage.clear()
        dispatch({
            type: 'USER_LOGOUT',
            data: {}
        })
    }
}

const initUser = () => {

    return async (dispatch) => {

        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            console.log('FOund proper user', user)
            blogService.setToken(user.token)
            dispatch( {
                type: 'USER_LOGIN',
                data: user
            })
        }

        const users = await service.getAll()
        dispatch( {
            type: 'USERS_INIT',
            data: users
        })
    }
}

export default reducer
export { login, logout, initUser }