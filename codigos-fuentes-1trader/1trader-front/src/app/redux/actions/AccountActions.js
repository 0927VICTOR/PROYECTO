import axios from 'axios';
export const GET_ACCOUNT = 'GET_ACCOUNT';

export const getAccount = () => {
    return function (dispatch) {
        return axios.get('/api/customer/get-account').then((res) => {
            dispatch({
                type: GET_ACCOUNT,
                payload: res.data,
            })
        });
    }

};

