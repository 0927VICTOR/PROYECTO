import {
    GET_ACCOUNT
} from '../actions/AccountActions';


const initialState = {
    account: [
        {

        }
    ],
};

const AccountReducer = function (state = initialState, action) {
    switch (action.type) {
        case GET_ACCOUNT: {
            return {
                ...state,
                account: [...action.payload],
            };
        }

        default: {
            return {
                ...state,
            };
        }
    }
};

export default AccountReducer;