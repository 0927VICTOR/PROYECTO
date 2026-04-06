import Mock from '../mock'

const historyBalance = [
    {
        id: '323sa680b32497dsfdsgga21rt47',
        date_: '2023/04/11',
        ecommerce: 'INDRIVER',
        operationType: 'Inversión',
        investment: '6000'
    },
    {
        id: '323sa680b32497dsfdsgga21rt47',
        date_: '2023/12/11',
        ecommerce: 'INDRIVER',
        operationType: 'Inversión',
        investment: '8500'
    },
    {
        id: '323sa680b32497dsfdsgga21rt47',
        date_: '2023/02/16',
        ecommerce: 'NEQUI',
        operationType: 'Retiro',
        investment: '455'
    },
    {
        id: '323sa680b32497dsfdsgga21rt47',
        date_: '2023/02/16',
        ecommerce: 'NEQUI',
        operationType: 'Deposito',
        investment: '554'
    },
    {
        id: '323sa680b32497dsfdsgga21rt47',
        date_: '2023/06/07',
        ecommerce: 'NEQUI',
        operationType: 'Deposito',
        investment: '200'
    },
    {
        id: '323sa680b32497dsfdsgga21rt47',
        date_: '2023/07/15',
        ecommerce: 'ECOPETROL',
        operationType: 'Deposito',
        investment: '150'
    },
    {
        id: '323sa680b32497dsfdsgga21rt47',
        date_: '2023/06/10',
        ecommerce: 'NETFLIX',
        operationType: 'Deposito',
        investment: '225'
    },
    {
        id: '323sa680b32497dsfdsgga21rt47',
        date_: '2023/06/10',
        ecommerce: 'INDRIVER',
        operationType: 'Retiro',
        investment: '6000'
    }

]


Mock.onGet('/api/customer/history/balance').reply((config) => {
    const response = historyBalance
    return [200, response]
})

Mock.onGet('/api/customer/history-balance-by-date').reply((config) => {
    let { date_ } = config
    const response = historyBalance.filter(x => x.date_ === date_);
    return [200, response]
})