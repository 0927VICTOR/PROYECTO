import axios from "axios";
import { getaccountBalance, startLoadingAccountBalance } from "./accountSlice"
import { gambatteApi } from '../../../api/gambatteApi'
export const getAccount = (userId) => {
    return async (dispatch, getState) => {
        dispatch(startLoadingAccountBalance())
        // const resp = await axios.get('/api/customer/get-account');
        try {
            let { data: { data: { account_: { idAccount, balance } }, status } } = await
                gambatteApi.get(`/account/${userId}`, {
                    headers: {
                        'ngrok-skip-browser-warning': true
                    },
                })
            if (status === 'ok') {
                dispatch(getaccountBalance({ account: { id: idAccount, balance } }))
            }
        } catch (error) {
            throw error
        }
    }
}
