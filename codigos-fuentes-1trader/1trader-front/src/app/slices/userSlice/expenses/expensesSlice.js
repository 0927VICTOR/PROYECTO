const { createSlice } = require('@reduxjs/toolkit');
const { findIndex } = require('lodash')

export const expensesSlice = createSlice({
    name: 'expenses',
    initialState: {
        expenses: [],
        isLoading: false,
        error: null
    },
    reducers: {
        startLoadingExpenses: (state, /*action*/) => {
            state.isLoading = true;
        },
        expense: (state, action) => {
            state.isLoading = false
            state.expenses = [...state.expenses, action.payload.expense]
        },
        getExpenses: (state, action) => {
            state.isLoading = false
            state.expenses = action.payload.expenses ? action.payload.expenses : []
        },
        getExpensesById: (state, action) => {
            state.isLoading = false
            state.expenses = action.payload.expenses;
        },
        updateExpense: (state, action) => {
            state.isLoading = false
            let index = findIndex(state.expenses, (e) => {
                return e.id == action.payload.expense.id;
            }, 0);
            state.deposits[index] = action.payload.deposit
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload.errorName
        }
    }
});

export const { expense, getExpenses, getExpensesById, updateExpense, startLoadingExpenses } = expensesSlice.actions;