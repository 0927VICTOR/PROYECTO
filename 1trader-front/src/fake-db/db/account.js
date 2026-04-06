import Mock from '../mock'

const customerAccount = [
    {
        id: '323sa680b32497dsfdsgga21rt47',
        balance: 450
    }
]


Mock.onGet('/api/customer/get-account').reply((config) => {
    const response = customerAccount
    return [200, response]
})