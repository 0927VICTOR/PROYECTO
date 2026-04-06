import { gambatteApi } from "app/api/gambatteApi"
import { getUserSystem, setError, setUserSystem, startLoadingUserSystem, updateUserSystemById } from "./userSystemSlice"


export const getAllUserSystemThunk = (role = '') => {
    return async (dispatch, getState) => {
        dispatch(startLoadingUserSystem())
        let { data: { data, status } } = await gambatteApi.get('/user', {
            headers: {
                'x-rapidapi-host': 'famous-quotes4.p.rapidapi.com',
                'x-rapidapi-key': 'API_KEY',
                'role': 'admin'
            }
        })
        if (status === 'ok') {
            dispatch(getUserSystem({ userSystem: data }))
        }
    }
}

export const createUserSystemThunk = (payload, callback) => {
    return async (dispatch, getState) => {
        dispatch(startLoadingUserSystem())
        try {
            let { data: { data, status } } = await
                gambatteApi.post('/user', payload)
            if (status == 'ok') {
                dispatch(setUserSystem({ userSystem: data[0] }))
                return callback(false)
            }
        } catch (e) {
            dispatch(setError({ errorName: e.message }))
            console.log('Mostrando el error ', e);
            return callback(e)
        }
    }
}

export const updateUserSystemThunk = (id, payload, callback) => {
    return async (dispatch, getState) => {
        dispatch(startLoadingUserSystem())
        try {
            let { data: { data, status } } = await
                gambatteApi.put(`/user/update/${id}`, payload)
            if (status == 'ok') {
                dispatch(updateUserSystemById({ userSystem: data }))
                return callback(false)
            }
        } catch (e) {
            dispatch(setError({ errorName: e.message }))
            console.log('Mostrando el error ', e);
            return callback(e)
        }
    }
}

export const changePasswordUserSystemThunk = (payload, callback) => {
    return async (dispatch, getState) => {
        dispatch(startLoadingUserSystem())
        try {
            let { data: { data, status } } = await
                gambatteApi.put(`/user/updatePassword`, payload)
            if (status == 'ok') {
                return callback(false)
            }
        } catch (e) {
            dispatch(setError({ errorName: e.message }))
            console.log('Mostrando el error ', e);
            return callback(e)
        }
    }
}