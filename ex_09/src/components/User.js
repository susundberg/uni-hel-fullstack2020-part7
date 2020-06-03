import React from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"



const UserViewSingleR = (props) => {



    console.log("User single", props)
    return (
        <div id="userSingle">
            <h3> {props.user.name} </h3>
            <h4> Added blogs: </h4>
            <ul>
                {props.user.blogs.map((x) => (<li key={x.id}> {x.title} </li>))}
            </ul>
        </div>
    )
}



const UserViewList = ({ user }) =>
    (<tr>
        <td> <Link to={'/users/' + user.id} >Blogs{user.name} </Link>  </td>
        <td> {user.blogs.length} </td>
    </tr>)


const UserViewR = (props) => {
    return (
        <table id="users">
            <thead>
                <tr><th>Name</th><th>Blogs</th></tr>
            </thead>
            <tbody>
                {props.users.map((x) => (<UserViewList key={x.id} user={x} />))}
            </tbody>
        </table>)
}


const mapStateToProps = (state) => ({ user: state.user.users.find((x) => (x.username === state.user.username)), users: state.user.users })


const UserViewSingle = connect(
    (state, props) => ({ user: state.user.users.find((x) => x.id === props.userId) }),
    {}
)(UserViewSingleR)

const UserView = connect(
    mapStateToProps,
    {}
)(UserViewR)


export { UserView, UserViewSingle }