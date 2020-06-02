import React, { useState } from 'react'
import Togglable from './Toggable'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLike, onRemove, user }) => {
    const [expanded, setExpand] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }



    const blogUser = blog.user ? blog.user.name : "?"
    // console.log("blog", blogUser, blog.title)
    if (expanded) {
        return (
            <div style={blogStyle} className="blog blog-extended">
                <ul>
                    <li> Title: {blog.title} </li>
                    <li> Author: {blog.author} </li>
                    <li> Url: {blog.url} </li>
                    <li> Likes: {blog.likes} </li>
                    <li> Added by: {blogUser} </li>
                </ul>
                <button onClick={() => { setExpand(false) }}>hide</button>
                <button onClick={() => { onLike(blog) }}>like</button>
                {user.username === blog.user.username && <button onClick={() => { onRemove(blog) }}>remove</button>}

            </div>
        )

    } else {
        return (
            <div style={blogStyle} className="blog blog-small">
                {blog.title} by {blog.author} <button onClick={() => { setExpand(true) }}>show</button>
            </div>
        )
    }
}

const BlogForm = ({ onSubmit }) => {
    const onSubmitRaw = (event) => {
        event.preventDefault()
        const title = event.target.btitle.value
        const author = event.target.author.value
        const url = event.target.url.value

        onSubmit(title, author, url)
    }

    return (
        <form onSubmit={onSubmitRaw} >
            {
                ["btitle", "author", "url"].map((x) => (
                    <div key={x}> {x} <input type="text" name={x} /></div>
                ))
            }

            < button type="submit" > Submit</button>
        </form >)

}

const BlogView = ({ blogs, onSubmit, onLike, onRemove, user }) => {
    const blogFormRef = React.createRef()

    const onSubmitWithHide = (title, author, url) => {
        blogFormRef.current.toggleVisibility()
        return onSubmit(title, author, url)
    }

    return (
        < div >
            <Togglable buttonLabel='new blog' ref={blogFormRef}>
                <BlogForm onSubmit={onSubmitWithHide} />
            </Togglable>

            <h2> Existing Blogs </h2>
            <div id="blogs">
                {blogs.map((b) => (<Blog blog={b} key={b.id} onRemove={onRemove} onLike={onLike} user={user} />))}
            </div>
        </div >

    )
}

BlogView.propTypes = {
    blogs: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onLike: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
}

export default BlogView
export { Blog, BlogForm }
