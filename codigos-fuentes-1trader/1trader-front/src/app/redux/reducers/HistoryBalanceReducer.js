import {
    GET_HISTORY_BALANCE,
    GET_HISTORY_BALANCE_BY_DATE
} from '../actions/BalanceHistoryActions';


const initialState = {
    historyBalance: [],
};

const HistoryBalanceReducer = function (state = initialState, action) {
    switch (action.type) {
        case GET_HISTORY_BALANCE: {
            console.log('mostrando action payload GET_HISTORY_BALANCE', action.payload);
            return {
                ...state,
                historyBalance: [...action.payload],
            };
        }

        case GET_HISTORY_BALANCE_BY_DATE: {
            console.log('mostrando action payload GET_HISTORY_BALANCE_BY_DATE', action.payload);
            return {
                ...state,
                historyBalance: initialState.historyBalance.push(action.payload)
            };
        }

        default: {
            return {
                ...state,
            };
        }
    }
};

export default HistoryBalanceReducer;