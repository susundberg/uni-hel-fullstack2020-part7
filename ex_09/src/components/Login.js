import React from 'react'
import { connect } from 'react-redux'
import { login, logout } from '../reducers/user'


import { Button, Form } from 'react-bootstrap'

const LoginFormR = (props) => {

    const onSubmit = async (event) => {
        event.preventDefault()

        const username = event.target.username.value
        const password = event.target.password.value
        console.log("Login", username, password)
        props.login(username, password)
    }

    return (
        <div>
            <h2>Please Login</h2>
            <Form onSubmit={onSubmit}>
                <Form.Label>username</Form.Label>
                <Form.Control type="text" name="username" />

                <Form.Label> password </Form.Label>
                <Form.Control type="password" name="password" />

                <Button name="submit" type="submit">login</Button>
            </Form>
        </div>)

}

const LoginInfoR = (props) => {

    const padding = {
        paddingRight: 5,
        display: 'table-cell',
    }
    return (
        <div style={padding}> Logged in as: {props.user.name} ({props.username}) <Button name="logout" onClick={props.logout}>logout</Button> </div>
    )
}

const mapStateToProps = (state) => (state.user)

const LoginForm = connect(
    mapStateToProps,
    { login, }
)(LoginFormR)

const LoginInfo = connect(
    mapStateToProps,
    { logout }
)(LoginInfoR)



export { LoginInfo, LoginForm }