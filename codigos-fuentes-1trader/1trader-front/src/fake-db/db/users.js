import Mock from '../mock'

const users = [
    {
        id: 'ayponkee9cjshn',
        idUser: 'AARBC01',
        fullName: 'Alexander Pérez Acevedo',
        documentType: '1',
        docmuentNumber: '256475896584',
        phone: '1475824665',
        email: 'alexperez@hotmail.com',
        role: 'USER',
        termAndConditions: true
    },
    {
        id: 'ayponkee9cdajshn',
        idUser: 'AARBC01',
        fullName: 'Juan Madrigal',
        documentType: '1',
        docmuentNumber: '747886584',
        phone: '3259874665',
        email: 'juanma@gmail.com',
        role: 'USER',
        termAndConditions: true
    }
    ,
    {
        id: 'trfsponkee9cdajshn',
        idUser: 'ABABC03',
        fullName: 'Adelaida Gómez',
        documentType: '1',
        docmuentNumber: '652586584',
        phone: '3658485474',
        email: 'adelaida@gmail.com',
        role: 'USER',
        termAndConditions: true
    },
    {
        id: 'ayponkee9cdajshnn',
        idUser: 'ABABC03',
        role: 'User',
        fullName: 'Yirleison Palomeque Moreno',
        email: 'yppalomeque@gmail.com',
        phone: '3024561289',
        avatar: '',
        finishRegister: false,
        termAndConditions: true,
        age: 25,
    },
]


Mock.onGet('/api/customer/get-users').reply((config) => {
    const response = users;
    return [200, response]
})

Mock.onGet('/api/customer/get-user').reply((config) => {
    let { id } = config
    const response = users.filter(x => x.id === id);
    return [200, response]
})

// Mock.onPut('/api/customer/update-finish-register-user').reply((config) => {
//     let { id, finishRegister } = JSON.parse(config.data)
//     const response = users.map(x => {
//         if (x.id === id) {
//             x.finishRegister = finishRegister
//         }
//         return {
//             ...x
//         }
//     });
//     return [200, response]
// })

Mock.onPut('/api/customer/update-finish-register-user').reply((config) => {
    let { id, finishRegister } = JSON.parse(config.data)
    const response = users.filter((x => x.id === id)).map(el => {
        if (el.id === id) {
            el.finishRegister = finishRegister
        }
        return {
            ...el
        }
    })
    return [200, response[0]]
})