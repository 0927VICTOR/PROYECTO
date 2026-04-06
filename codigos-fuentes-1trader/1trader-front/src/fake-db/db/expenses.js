import Mock from '../mock'

const expenses = [
    {
        id: '323sa680b32497dsfdsgga21rt',
        expenseDate: '2023/13/06',
        ecommerce: 'Nequi',
        amount: '780',
        state: 'En proceso'
    },
    {
        id: '323sa680b32497dsdseegga21rt',
        expenseDate: '2023/13/06',
        ecommerce: 'DirectTv',
        amount: 2300,
        state: 'En proceso'
    }
    ,
    {
        id: '3erfesaa680b32497dsdseegga21rt',
        expenseDate: '2023/12/06',
        ecommerce: 'Ecopetrol',
        amount: "4500",
        state: 'Pagado'
    },
    {
        id: '32dsaa68qwqw2497dsdseegga21rt',
        expenseDate: '2023/11/05',
        ecommerce: 'Netflix',
        amount: "600",
        state: 'En proceso'
    }, {
        id: '32dsaa680bcd7dsdseegga21rt',
        expenseDate: '2023/12/01',
        ecommerce: 'Teleantioquia',
        amount: '258',
        state: 'Pagado'
    }
]


Mock.onGet('/api/customer/get-expenses').reply((config) => {
    const response = expenses
    return [200, response]
})