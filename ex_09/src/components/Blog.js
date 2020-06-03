import React from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"

import { Table, Button, Form } from 'react-bootstrap'


import Togglable from './Toggable'
import { createBlog, likeBlog, removeBlog, commentBlog } from '../reducers/blogs'



const CommentViewR = (props) => {

    const onSubmitRaw = (event) => {
        event.preventDefault()
        const comment = event.target.comment.value
        console.log("Comment;", comment)
        props.onComment(props.blog, comment)
    }

    return (
        <div id="comments">
            <ul>
                {props.blog.comments.map((x, i) => (<li key={i}> {x} </li>))}
            </ul>
            <Form onSubmit={onSubmitRaw} >
                <Form.Control type="text" name="comment" />
                < Button type="submit" > Comment </Button>
            </Form>


        </div>)

}

const CommentView = connect(
    () => ({}),
    { onComment: commentBlog }
)(CommentViewR)

const BlogDetail = ({ blog, user, onLike, onRemove, onHide }) => (
    <div className="blog blog-extended">
        <Table striped>
            <tr><td> Title: </td><td> {blog.title} </td></tr>
            <tr><td> Author: </td><td>{blog.author} </td></tr>
            <tr><td> Url: </td><td>{blog.url}</td></tr>
            <tr><td> Likes: </td><td>{blog.likes} </td></tr>
            <tr><td> Added by: </td><td>{blog.user ? blog.user.name : "?"} </td></tr >
        </Table >
        {onHide ? <Button onClick={() => { onHide(false) }}>hide</Button> : <div />}
        <Button onClick={() => { onLike(blog) }}>like</Button>
        {onRemove && (user.username === blog.user.username) && <Button onClick={() => { onRemove(blog) }}>remove</Button>}
        <h3> Comments </h3>
        <CommentView blog={blog} />
    </div >
)


const Blog = ({ blog }) => {
    return (
        <tr>
            <td> <Link to={'/blogs/' + blog.id}> {blog.title} </Link> </td>
            <td> {blog.author} </td>
        </tr>
    )

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
        <Form onSubmit={onSubmitRaw} >
            {
                ["btitle", "author", "url"].map((x) => (
                    <div key={x}> <Form.Label> {x} </Form.Label> <Form.Control type="text" name={x} /></div>
                ))
            }
            < Button type="submit" > Submit</Button>
        </Form >)

}
const BlogSingleViewR = (props) => {
    console.log("Blogs single Props", props)
    return (<BlogDetail user={props.user} blog={props.blog} onLike={props.likeBlog} />)
}

const BlogViewR = (props) => {
    const blogFormRef = React.createRef()

    const onSubmitWithHide = (title, author, url) => {
        blogFormRef.current.toggleVisibility()
        props.createBlog({ title, author, url })

    }

    const onRemoveWithConfirm = (blog) => {

        if (window.confirm(`Really remove blog ${blog.title} by ${blog.author}?`) === false)
            return

        props.removeBlog(blog)
    }

    return (
        < div >
            <Togglable buttonLabel='new blog' ref={blogFormRef}>
                <BlogForm onSubmit={onSubmitWithHide} />
            </Togglable>

            <h2> Existing Blogs </h2>
            <div id="blogs">
                <Table striped>
                    <tbody>
                        {props.blogs.map((b) => (<Blog blog={b} key={b.id} onRemove={onRemoveWithConfirm} onLike={props.likeBlog} user={props.user} />))}
                    </tbody>
                </Table>
            </div>
        </div >

    )
}

const mapStateToProps = (state) => {
    return { user: state.user, blogs: state.blogs }
}

const BlogView = connect(
    mapStateToProps,
    { createBlog, likeBlog, removeBlog }
)(BlogViewR)

const BlogSingleView = connect(
    (state, props) => ({ user: state.user, blog: state.blogs.find(x => (x.id === props.blogId)) }),
    { likeBlog }
)(BlogSingleViewR)


export { BlogView, BlogSingleView }