import axios from "axios";
import { getUsers, getUser, startLoadingUsers, updateFinishRegisterUser, updateUserById } from "./usersSlice"
import { gambatteApi } from "app/api/gambatteApi";
import { BASE_URL_PROD } from "app/utils/constant";

export const getAllUsersTest = () => {
    return async (dispatch, getState) => {
        dispatch(startLoadingUsers())
        const resp = await axios.get('/api/customer/get-users');
        const data = resp.data;
        dispatch(getUsers({ users: data }))
    }
}

export const getAllUsers = (role = '') => {
    return async (dispatch, getState) => {
        dispatch(startLoadingUsers())
        let { data: { data, status } } = await gambatteApi.get('/user', {
            headers: {
                'x-rapidapi-host': 'famous-quotes4.p.rapidapi.com',
                'x-rapidapi-key': 'API_KEY',
                'role': 'admin'
            }
        })
        if (status === 'ok') {
            dispatch(getUsers({ users: data }))
        }
    }
}

export const getUserById = (id) => {
    return async (dispatch, getState) => {
        // dispatch(startLoadingUsers())
        // const resp = await axios.get('/api/customer/get-user', { id: id });
        // const data = resp.data;
        // dispatch(getUser({ user: data }))

        try {
            dispatch(startLoadingUsers())
            let { data: { data, status } } = await
                gambatteApi.get(`/user/id/${id}`)
            if (status === 'ok') {
                dispatch(getUser({ user: data }))
            }
        } catch (error) {
            throw error
        }
    }
}

export const updateFinishRegistertTest = ({ ...datos }) => {
    return async (dispatch, getState) => {
        dispatch(startLoadingUsers())
        const resp = await axios.put('/api/customer/update-finish-register-user', { id: datos['id'], finishRegister: datos['finishRegister'] });
        const data = resp.data;
        dispatch(updateFinishRegisterUser({ user: data }))
    }
}

export const updateUser = (userId, payload, callback) => {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoadingUsers())
            let { data: { data, status } } = await
                gambatteApi.put(`/user/update/${userId}`, { data: payload })
            if (status === 'ok') {
                dispatch(updateUserById({ user: data }))
                return callback(false)
            }
        } catch (error) {
            return callback(error)
        }
    }
}

export const updateAcountVerify = (payload, callback) => {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoadingUsers())
            let { data: { data, status } } = await
                gambatteApi.post(`/update/acount/verify`, { data: payload })
            if (status === 'ok') {
                dispatch(updateUserById({ user: data }))
                return callback(false)
            }
        } catch (error) {
            return callback(error)
        }
    }
}

export const updateFinishRegister = (userId, callback) => {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoadingUsers())
            let { data: { data, status } } = await
                gambatteApi.put(`/user/finishRegister/${userId}`)
            if (status === 'ok') {
                dispatch(updateUserById({ user: data }))
                return callback(false)
            }
        } catch (error) {
            return callback(error)
        }
    }
}

export const deleteUser = (userId, callback) => {
    return async (dispatch, getState) => {
        try {
            let { data: { data, status } } = await
                gambatteApi.delete(`/user/?id=${userId}`)
            if (status === 'ok') {
                return callback(false)
            }
        } catch (error) {
            return callback(error)
        }
    }
}

export const updateUserFile = (userId, payload, callback) => {
    console.log('updateUserFile ', payload);
    return async (dispatch, getState) => {
        try {
            dispatch(startLoadingUsers())
            let { data: { data, status } } = await
                gambatteApi.put(`/user/photo-update/${userId}`, { fileName: payload })
            if (status === 'ok') {
                dispatch(updateUserById({ user: data }))
                return callback(false)
            }
        } catch (error) {
            return callback(error)
        }
    }
}

export const updateUserFileDocuments = (userId, payload, callback) => {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoadingUsers())
            let { data: { data, status } } = await
                gambatteApi.put(`/user/update-file-documents/${userId}`, { documents: payload })
            if (status === 'ok') {
                dispatch(updateUserById({ user: data }))
                return callback(false)
            }
        } catch (error) {
            return callback(error)
        }
    }
}