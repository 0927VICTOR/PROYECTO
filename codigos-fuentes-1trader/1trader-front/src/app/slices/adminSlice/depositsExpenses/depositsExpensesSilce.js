import { findIndex } from 'lodash';

const { createSlice, current } = require('@reduxjs/toolkit');
// Pendiente organizar el update cuando se crea un deposito o un registro
export const depositsExpensesSlice = createSlice({
    name: 'depopsits',
    initialState: {
        depositsExpenses: [],
        isLoading: false,
        error: null
    },
    reducers: {
        startLoadingDepositsExpenses: (state, /*action*/) => {
            state.isLoading = true;
        },
        getDepositsExpenses: (state, action) => {
            state.isLoading = false;
            state.depositsExpenses = action.payload.depositsExpenses
        },
        getDepositsExpensesById: (state, action) => {
            state.isLoading = false;
            state.depositsExpenses = action.payload.depositsExpenses
        },
        depositsExpensesById: (state, action) => {
            state.isLoading = false;
            console.log('state actual 1', current(state));
            console.log('state actual action', action.payload.depositExpense);
            // let index = findIndex(state.depositsExpenses, (e) => {
            //     return e.id == action.payload.depositExpense.id;
            // }, 0);

            // if (Object.keys(state.depositsExpenses[index].length > 0)) {
            //     state.depositsExpenses[index] = action.payload.depositExpense
            // }
            // else {
            //     state.depositsExpenses = [...state.depositsExpenses, action.payload.depositExpense]
            // }
            console.log('state modificado', current(state));
            // state.depositsExpenses = action.payload.depositsExpenses
        },
        setDepositsExpenses: (state, action) => {
            state.isLoading = false;
            state.depositsExpenses = action.payload.depositsExpenses
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload.errorName
        }
    }
});

export const { getDepositsExpensesById, getDepositsExpenses, startLoadingDepositsExpenses, depositsExpensesById, setError } = depositsExpensesSlice.actions;