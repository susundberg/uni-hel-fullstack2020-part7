import thunk from 'redux-thunk'

import { createStore, combineReducers, applyMiddleware } from 'redux'


import reducerBlo from './reducers/blogs'
import reducerNot from './reducers/notification'
import reducerUser from './reducers/user'

const reducer = combineReducers({
    notification: reducerNot,
    blogs: reducerBlo,
    user: reducerUser,
})

const store = createStore(reducer,
    applyMiddleware(thunk)
)


export default store