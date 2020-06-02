import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = async (event) => {
        event.preventDefault()
        setUsername('')
        setPassword('')
        onLogin(username, password)

    }

    return (
        <div>
            <h2>Please Login</h2>
            <form onSubmit={onSubmit}>
                <div> username
                    <input type="text" value={username} name="username" onChange={({ target }) => setUsername(target.value)} />
                </div>
                <div> password
                    <input type="password" value={password} name="password" onChange={({ target }) => setPassword(target.value)} />
                </div>
                <button name="submit" type="submit">login</button>
            </form>
        </div>)

}

const UserView = ({ user, onLogout }) => (
    <div> Logged in as: {user.name} ({user.username}) <button name="logout" onClick={onLogout}>logout</button> </div>
)

LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired
}

export { UserView, LoginForm }