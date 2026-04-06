import { findIndex } from 'lodash';

const { createSlice, current } = require('@reduxjs/toolkit');
// Pendiente organizar el update cuando se crea un deposito o un registro
export const earningPaymentsSlice = createSlice({
    name: 'earningPayments',
    initialState: {
        earningPayments: [],
        isLoading: false,
        error: null
    },
    reducers: {
        startLoadingEarningPayments: (state, /*action*/) => {
            state.isLoading = true;
        },

        getEarningPayments: (state, action) => {
            state.isLoading = false;
            state.earningPayments = action.payload.earningPayments
        },

        setEarningPayments: (state, action) => {
            state.isLoading = false;
            state.earningPayments = [state.earningPayments, ...action.payload.earningPayment]
        },

        updateEarningPaymentsById: (state, action) => {
            state.isLoading = false;
            // console.log('state actual 1', current(state));
            // console.log('state actual action', action.payload.earningPayment);
            let index = findIndex(state.earningPayments, (e) => {
                return e.id == action.payload.earningPayment.id;
            }, 0);
            state.earningPayments[index] = action.payload.earningPayment
            // if (Object.keys(state.depositsExpenses[index].length > 0)) {
            //     state.depositsExpenses[index] = action.payload.depositExpense
            // }
            // else {
            //     state.depositsExpenses = [...state.depositsExpenses, action.payload.depositExpense]
            // }
            // console.log('state modificado', current(state));
            // state.depositsExpenses = action.payload.depositsExpenses
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload.errorName
        }
    }
});

export const { getEarningPayments, setEarningPayments, updateEarningPaymentsById, startLoadingEarningPayments, setError } = earningPaymentsSlice.actions;