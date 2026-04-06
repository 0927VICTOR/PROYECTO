import { gambatteApi } from "app/api/gambatteApi";

export const getCountries = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let { data: { data, status } } = await
                gambatteApi.get('/countries')
            if (status === 'ok') {
                return resolve(data)
            }
        } catch (e) {
            return reject(e)
        }
    })
}

export const getBanks = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let { data: { data, status } } = await
                gambatteApi.get('/bank')
            if (status === 'ok') {
                return resolve(data)
            }
        } catch (e) {
            return reject(e)
        }
    })
}

export const getFinancialActive = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let { data: { data, status } } = await
                gambatteApi.get('/get-google-fianancial-init')
            if (status === 'ok') {
                return resolve(data)
            }
        } catch (e) {
            return reject(e)
        }
    })
}