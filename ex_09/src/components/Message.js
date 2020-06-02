

import React from 'react'

const MessageView = ({ state }) => {

    console.log("State", state)
    if (state.type === null)
        return null

    console.log("ErrorMsg", state)

    const msgclass = state.type === "error"
        ? "msg-base msg-error"
        : "msg-base msg-info"


    return (
        <div className={msgclass}>
            {state.message}
        </div >)

}
export default MessageView
