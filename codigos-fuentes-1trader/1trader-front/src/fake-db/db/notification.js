import Mock from '../mock'
import shortId from 'shortid'

const NotificationDB = {
    list: [
        {
            id: 1,
            heading: 'Samuel Moreno',
            icon: {
                name: 'monetization_on',
                color: 'monetization_on',
            },
            timestamp: 1570702802573,
            title: 'New message from Devid',
            deposits: {
                title: 'Solicitud Depositos',
                quantity: 5
            },
            expenses: {
                title: 'Solicitud Retiros',
                quantity: 15
            },
            subtitle: 'Hello, Any progress...',
            path: 'chat',
        },
        {
            id: 3,
            heading: 'Cristian Morales',
            icon: {
                name: 'monetization_on',
                color: 'monetization_on',
            },
            timestamp: 1570702802573,
            title: 'New message from Devid',
            deposits: {
                title: 'Solicitud Depositos',
                quantity: 5
            },
            expenses: {
                title: 'Solicitud Retiros',
                quantity: 15
            },
            subtitle: 'Hello, Any progress...',
            path: 'chat',
        },
        {
            id: shortId.generate(),
            heading: 'Jazmin Vanegas',
            icon: {
                name: 'monetization_on',
                color: 'monetization_on',
            },
            timestamp: 1570702802573,
            title: 'New message from Devid',
            deposits: {
                title: 'Solicitud Depositos',
                quantity: 5
            },
            expenses: {
                title: 'Solicitud Retiros',
                quantity: 15
            },
            subtitle: 'Hello, Any progress...',
            path: 'chat',
        },
    ],
}

Mock.onGet('/api/notification').reply((config) => {
    const response = NotificationDB.list
    return [200, response]
})

Mock.onPost('/api/notification/add').reply((config) => {
    const response = NotificationDB.list
    return [200, response]
})

Mock.onPost('/api/notification/delete').reply((config) => {
    let { id } = JSON.parse(config.data)
    console.log(config.data)

    const response = NotificationDB.list.filter(
        (notification) => notification.id !== id
    )
    NotificationDB.list = [...response]
    return [200, response]
})

Mock.onPost('/api/notification/delete-all').reply((config) => {
    NotificationDB.list = []
    const response = NotificationDB.list
    return [200, response]
})
