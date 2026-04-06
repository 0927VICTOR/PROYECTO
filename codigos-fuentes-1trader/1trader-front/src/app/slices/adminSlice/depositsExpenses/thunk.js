import axios from "axios";
import { getDepositsExpenses, startLoadingDepositsExpenses, setError, depositsExpensesById } from "./depositsExpensesSilce"
import { gambatteApi } from "app/api/gambatteApi";

export const getAllDepositsExpensesById = (userId, callback) => {
    return async (dispatch, getState) => {
        // const resp = await axios.get('/api/customer/get-deposits');
        // const data = resp.data;
        // dispatch(getDeposits({ deposits: data }))
        try {
            dispatch(startLoadingDepositsExpenses())
            let { data: { data, status } } = await
                gambatteApi.get(`/account/deposit/expense/${userId}`)
            if (status === 'ok') {
                dispatch(getDepositsExpenses({ depositsExpenses: data }))
                return callback(false)
            }
        } catch (error) {
            console.log('Error ===> ', error.message);
            return callback(error)
        }
    }
}

export const getAllDepositsExpenses = (data) => {
    return async (dispatch, getState) => {
        // const resp = await axios.get('/api/customer/get-deposits');
        // dispatch(getDeposits({ deposits: data }))
        try {
            dispatch(startLoadingDepositsExpenses())
            // let { data: { data, status } } = await
            //     gambatteApi.get(`/account/deposit/expense`)
            // if (status === 'ok') {}
            dispatch(getDepositsExpenses({ depositsExpenses: data }))
        } catch (error) {
            console.log('Error ===> ', error.message);
        }
    }
}

export const updateDepositsExpensesById = (body, callback) => {
    return async (dispatch, getState) => {
        // const resp = await axios.get('/api/customer/get-deposits');
        // const data = resp.data;
        // dispatch(getDeposits({ deposits: data }))
        try {
            dispatch(startLoadingDepositsExpenses())
            let { data: { data, status } } = await
                gambatteApi.put(`/deposit/expense`, { data: body })
            return callback(false)
        } catch (error) {
            console.log('Error ===> ', error.message);
            return callback(error)
        }
    }
}