const { createSlice } = require('@reduxjs/toolkit');
const { findIndex } = require('lodash')

export const depositsSlice = createSlice({
    name: 'depopsits',
    initialState: {
        deposits: [],
        isLoading: false,
        error: null
    },
    reducers: {
        startLoadingDeposits: (state, /*action*/) => {
            state.isLoading = true;
        },
        getDeposits: (state, action) => {
            state.isLoading = false;
            state.deposits = action.payload.deposits ? action.payload.deposits : []
        },
        deposit: (state, action) => {
            state.isLoading = false
            state.deposits = [...state.deposits, action.payload.deposit]
        },
        updateDeposit: (state, action) => {
            state.isLoading = false
            let index = findIndex(state.deposits, (e) => {
                return e.id == action.payload.deposit.id;
            }, 0);
            state.deposits[index] = action.payload.deposit
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload.errorName
        }
    }
});

export const { getDeposits, startLoadingDeposits, deposit, updateDeposit, setError } = depositsSlice.actions;