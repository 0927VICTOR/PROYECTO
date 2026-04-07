const socket =io();
const deposits = document.querySelector('#deposits')

let data = {
   
            cardInfo:{
                cardNumber:"4894 4542 2316",
                ccv:"343",
                expYear:"28",
                month:"05",
                termAndConditions:true
            },
            deposit:{
                amount:600,
                depositDate:"2023-06-06",
                ecommerce:"",
                state:1
            },
            user:{
                email:"yirleison@bancolombia.com.co",
                fullName:"Yirleison Palomeque Moreno",
                id:2
            }
        
}

deposits.addEventListener('submit', e=>{
    e.preventDefault()
    console.log("enviando...")
    socket.emit('conectado','conectando desde el cliente')

    socket.emit('new-deposit',{data: data})
    socket.on('notificatios-users', data =>{
        console.log("notificactions users", data)
    })

})

