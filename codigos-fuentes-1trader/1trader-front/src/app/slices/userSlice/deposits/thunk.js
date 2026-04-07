import axios from "axios";
import { getDeposits, startLoadingDeposits, deposit, setError } from "./depositsSilce"
import { gambatteApi } from "app/api/gambatteApi";
import { updateUserById } from "../users";


export const getDeposit = (userId, callback) => {
    return async (dispatch, getState) => {
        // const resp = await axios.get('/api/customer/get-deposits');
        // const data = resp.data;
        // dispatch(getDeposits({ deposits: data }))
        try {
            dispatch(startLoadingDeposits())
            let { data: { data, status } } = await
                gambatteApi.get(`/deposit/${userId}`)
            if (status === 'ok') {
                dispatch(getDeposits({ deposits: data }))
                return callback(false)
            }
        } catch (error) {
            console.log('Error ===> ', error.message);
            return callback(error)
        }
    }
}

export const getAllDeposits = (callback) => {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoadingDeposits())
            let { data: { data, status } } = await
                gambatteApi.get(`/deposits`)
            if (status === 'ok') {
                dispatch(getDeposits({ deposits: data }))
                return callback(false)
            }
        } catch (error) {
            console.log('Error ===> ', error.message);
            return callback(error)
        }
    }
}

export const createDeposit = (payload, callback) => {
    return async (dispatch, getState) => {
        dispatch(startLoadingDeposits())
        try {
            let { data: { data: { deposit: depositUser, user }, status } } = await
                gambatteApi.post('/deposit', { data: payload })
            // dispatch(AddProjectsToStorange(projects));
            console.log('createDeposit ', deposit);
            dispatch(updateUserById({ user: user }))
            dispatch(deposit({ deposit: depositUser }))
            return callback(false)
        } catch (e) {
            dispatch(setError({ errorName: e.message }))
            console.log('Mostrando el error ', e);
            return callback(e)
        }
    }
}

