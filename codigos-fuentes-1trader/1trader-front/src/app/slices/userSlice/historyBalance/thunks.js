import axios from "axios";
import { getHistoryBalance, startLoadingHistoryBalance, getHistoryBalanceByDate } from "./HistoryBalanceSlice"

export const getHistoryBalanceCustomer = () => {
    return async (dispatch, getState) => {
        dispatch(startLoadingHistoryBalance())
        const resp = await axios.get('/api/customer/history/balance');
        const data = resp.data;
        dispatch(getHistoryBalance({ historyBalance: data }))
    }
}

export const getHistoryBalanceCustomerByDate = (date_) => {
    return async (dispatch, getState) => {
        dispatch(startLoadingHistoryBalance())
        const resp = await axios.get('/api/customer/history-balance-by-date', { date_: date_ });
        const data = resp.data;
        dispatch(getHistoryBalanceByDate({ historyBalance: data }))
    }
}