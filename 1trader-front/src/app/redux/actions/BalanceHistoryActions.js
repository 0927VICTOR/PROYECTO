import axios from 'axios';
export const GET_HISTORY_BALANCE = 'GET_HISTORY_BALANCE';
export const GET_HISTORY_BALANCE_BY_DATE = 'GET_HISTORY_BALANCE_BY_DATE';

export const getHistoryBalance = (id) => {
    return function (dispatch) {
        return axios.get('/api/customer/history/balance').then((res) => {
            console.log('mostrando el dispatch : ', res.data);
            dispatch({
                type: GET_HISTORY_BALANCE,
                payload: res.data,
            })
        });
    }
};

export const getHistoryBalanceByDate = (date_) => (dispatch) => {
    // return axios.get('/api/customer/history-balance-by-date', { data: date_ }).then((res) => {
    return axios.get('/api/customer/history/balance').then((res) => {
        console.log('mostrando el dispatch : ', res.data);
        dispatch({
            type: GET_HISTORY_BALANCE,
            payload: res.data,
        })
    });
};
