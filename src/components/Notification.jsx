const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }

    const style = {
        color: type === 'error' ? 'red' : 'green',
        border: '1px solid',
        padding: '5px',
        marginBottom: '5px'
    }


    return <div style={style}>{message}</div>
}

export default Notification