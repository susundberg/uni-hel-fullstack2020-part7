import React from 'react'
import { useSelector } from 'react-redux'


const Notification = () => {
    const notification = useSelector(state => state.notification.msg)
    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1
    }

    if (notification === null)
        return (<div id="notification"></div>)

    return (
        <div id="notification" style={style}>
            {notification}
        </div>
    )
}
export default Notification