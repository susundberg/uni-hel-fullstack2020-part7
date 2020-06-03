import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Link, useRouteMatch } from "react-router-dom"

import { Navbar, Nav } from 'react-bootstrap'


import { BlogSingleView, BlogView } from './components/Blog'
import { LoginInfo, LoginForm } from './components/Login'
import { UserView, UserViewSingle } from './components/User'
import Notification from './components/Notification'

import { initBlogs } from './reducers/blogs'
import { initUser } from './reducers/user'

import './App.css'

const Menu = () => {


    return (
        <Navbar >
            <Navbar.Brand > BLOGAPP </Navbar.Brand>
            <Nav.Link as="span" ><Link to='/' >Blogs</Link></Nav.Link>
            <Nav.Link as="span" ><Link to='/users' >Users</Link></Nav.Link>
            <Nav.Link as="span"><LoginInfo /></Nav.Link>
        </Navbar>
    )
}

const App = (props) => {

    useEffect(() => {
        props.initUser()
    })

    useEffect(() => {
        if (props.user) {
            props.initBlogs()
        }
    }, [props])

    console.log("Props is", props)


    let userMatch = useRouteMatch('/users/:id')
    let blogMatch = useRouteMatch('/blogs/:id')

    const makeMatch = (x) => (x ? x.params.id : null)

    userMatch = makeMatch(userMatch)
    blogMatch = makeMatch(blogMatch)

    if (props.user === null) {
        return (<div> <Notification /> <LoginForm /> </div>)
    }

    return (
        <div id="appmain" className="container" >
            <Menu />
            <Notification />
            <Switch>
                <Route path="/users/:id">
                    <UserViewSingle userId={userMatch} />
                </Route>
                <Route path="/users/">
                    <UserView />
                </Route>
                <Route path="/blogs/:id">
                    <BlogSingleView blogId={blogMatch} />
                </Route>
                <Route path="/">
                    <BlogView />
                </Route>
            </Switch>
        </div>

    )
}
const mapStateToProps = (state) => {

    const user = state.user

    return { user: user.username }
}
const mapDispatchToProps = { initBlogs, initUser }

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App)



/*
    const [blogs, setBlogs] = useState([])

    const [user, setUser] = useState(null)
    const [message, setMessage] = useState({ type: '' })



    const setErrorMessage = (message, timeout_s) => {
        setMessage({ 'type': 'error', message })
        setTimeout(() => {
            setMessage({ type: '' })
        }, timeout_s * 1000)
    }
    const setInfoMessage = (message, timeout_s) => {
        setMessage({ 'type': 'info', message })
        setTimeout(() => {
            setMessage({ type: '' })
        }, timeout_s * 1000)
    }

    const onBlogLike = async (blog) => {

        const index = blogs.findIndex((loop) => (loop.id === blog.id))
        if (index < 0)
            return

        await blogService.update({ id: blog.id, likes: (blog.likes + 1) })

        const newBlogs = [...blogs]
        newBlogs[index].likes += 1
        blogService.sort(newBlogs)
        console.log("SORTED", newBlogs)
        setBlogs(newBlogs)
    }

    const onBlogRemove = async (blog) => {

        if (window.confirm(`Really remove blog ${blog.title} by ${blog.author}?`) === false)
            return



        // find the item from current list
        const index = blogs.findIndex((loop) => (loop.id === blog.id))
        console.log("Remove index:", index)
        if (index < 0)
            return

        try {
            await blogService.remove(blog)
        }
        catch (error) {
            console.log("Resonse:", error.response)
            setErrorMessage(`Cannot delete: ${error.response.data.error}`, 5)
            return
        }

        const newBlogs = [...blogs]
        newBlogs.splice(index, 1)
        setBlogs(newBlogs)
        setInfoMessage(`Blog ${blog.title} by ${blog.author} removed!`, 2)
    }

    const onBlogSubmit = async (title, author, url) => {

        console.log("OnBlogSubmit", title, author, url)
        try {
            const newBlog = await blogService.create({ title, author, url })
            setBlogs(blogs.concat(newBlog))
            setInfoMessage(`Created: ${newBlog.title} by ${newBlog.author}`, 5)
        } catch (error) {
            console.log("Create error", error)
            console.log("Resonse:", error.response)
            setErrorMessage(`Cannot create: ${error.response.data.error}`, 5)
        }
    }

    const onLogout = async (event) => {
        console.log("Logout", event)
        setUser(null)
        blogService.setToken(null)
        window.localStorage.clear()
    }

    const onLogin = async (username, password) => {
        try {
            const user = await loginService.login({
                username, password,
            })
            setUser(user)
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            blogService.setToken(user.token)
            return true
        } catch (exception) {
            setErrorMessage('Wrong credentials', 5)
            return false
        }
    }

    useEffect(() => {
        blogService.getAll().then((blogs) => {
            blogService.sort(blogs)
            setBlogs(blogs)
        })
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])


    return (
        <div>
            {(message.type) && <MessageView state={message} />}
            {(user) && <UserView user={user} onLogout={onLogout} />}
            {user === null ?
                <LoginForm onLogin={onLogin} /> :
                <BlogView blogs={blogs} onSubmit={onBlogSubmit} onLike={onBlogLike} onRemove={onBlogRemove} user={user} />
            }
        </div>
    )
}
*/