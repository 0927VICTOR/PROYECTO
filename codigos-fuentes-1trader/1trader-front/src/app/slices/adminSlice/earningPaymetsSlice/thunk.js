
import axios from "axios";
import { getEarningPayments, startLoadingEarningPayments, updateEarningPaymentsById } from "./earningPaymentsSilce"
import { gambatteApi } from "app/api/gambatteApi";

export const getEarningPaymentsThunk = (callback) => {
    return async (dispatch, getState) => {
        // const resp = await axios.get('/api/customer/get-deposits');
        // const data = resp.data;
        // dispatch(getDeposits({ deposits: data }))
        try {
            dispatch(startLoadingEarningPayments())
            let { data: { data, status } } = await
                gambatteApi.get(`/get-payments`)
            if (status === 'ok') {
                // console.log('Pagos usuario ', data);
                dispatch(getEarningPayments({ earningPayments: data }))
                return callback(false)
            }
        } catch (error) {
            console.log('Error ===> ', error.message);
            return callback(error)
        }
    }
}

export const setEarningPaymentsThunk = (payload, callback) => {
    return async (dispatch, getState) => {
        // const resp = await axios.get('/api/customer/get-deposits');
        // const data = resp.data;
        // dispatch(getDeposits({ deposits: data }))
        try {
            dispatch(startLoadingEarningPayments())
            let { data: { data: data, status } } = await
                gambatteApi.post(`/create-payment`, { data: { earningPayment: payload } })
            if (status === 'ok') {
                dispatch(updateEarningPaymentsById({ earningPayment: data }))
                return callback(false)
            }
        } catch (error) {
            console.log('Error ===> ', error.message);
            return callback(error)
        }
    }
}

export const updateEarningPaymentsThunk = (payload, id, callback) => {
    return async (dispatch, getState) => {
        // const resp = await axios.get('/api/customer/get-deposits');
        // const data = resp.data;
        // dispatch(getDeposits({ deposits: data }))
        try {
            dispatch(startLoadingEarningPayments())
            let { data: { data: data, status } } = await
                gambatteApi.put(`/update-payment/${id}`, payload)
            if (status === 'ok') {
                dispatch(updateEarningPaymentsById({ earningPayment: data }))
                return callback(false)
            }
        } catch (error) {
            console.log('Error ===> ', error.message);
            return callback(error)
        }
    }
}

export const setEarningPaymentsThunkTest = (payload, callback) => {
    return async (dispatch, getState) => {
        const resp = await axios.post('/user/earning/payment', { data: { earningPayment: payload } });
        const data = resp.data;
        dispatch(updateEarningPaymentsById({ earningPayment: data }))
    }
}