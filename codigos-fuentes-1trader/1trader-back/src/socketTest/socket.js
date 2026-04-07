const socket = io()
socket.on('notificatios-users', notifications =>{
    console.log(notifications)
})