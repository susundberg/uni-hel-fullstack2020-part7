
const initialState = { 'msg': null, 'timer': undefined }

const ACTION_TYPE_NOTIFICATION_CREATE = "NOTIFICATION_CREATE"
const ACTION_TYPE_NOTIFICATION_HIDE = "NOTIFICATION_HIDE"


const reducer = (state = initialState, action) => {
    console.log("notification state", state)
    console.log("notification action", action)
    switch (action.type) {
        case ACTION_TYPE_NOTIFICATION_CREATE:
            return { timer: action.data.timer, msg: action.data.msg }
        case ACTION_TYPE_NOTIFICATION_HIDE:
            return { timer: null, 'msg': null }
        default:
            return state
    }

}


const createNotification = (msg, timeout_s) => {
    const createTimeout = () => {

        let timer = null
        let promise_reject = null

        const promise = new Promise((res, reject) => {
            timer = setTimeout(() => { res("Timer done") }, timeout_s * 1000)
            promise_reject = reject
        })


        const cancel = () => {
            console.log("Timer clear called!", timer)
            clearTimeout(timer.clearTimeout)
            promise_reject("Cancelled")
        }
        return { promise, cancel }
    }

    return async (dispatch, getState) => {

        // first cancel possible previous timer
        const oldTimer = getState().notification.timer
        console.log("Old timer", oldTimer)
        if (oldTimer) {
            oldTimer.cancel()
        }

        const timer = createTimeout()

        dispatch({ type: ACTION_TYPE_NOTIFICATION_CREATE, data: { msg, timer } })
        try {
            const done = await timer.promise
            console.log("Timer wait done:", done)
            dispatch({ type: ACTION_TYPE_NOTIFICATION_HIDE })
        }
        catch (error) {
            console.log("Timer wait error:", error)
        }

    }
}



export default reducer
export { createNotification }