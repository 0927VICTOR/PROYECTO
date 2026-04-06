
import { gambatteApi } from "app/api/gambatteApi";
import { getActives } from "./activesSilce";

export const getAllActivesThunk = (callback) => {
    return async (dispatch, getState) => {
        try {
            let { data: { data, status } } = await
                gambatteApi.get(`/get-actives`)
            if (status === 'ok') {
                dispatch(getActives({ actives: data }))
                return callback(false)
            }
        } catch (error) {
            console.log('Error ===> ', error.message);
            return callback(error)
        }
    }
}