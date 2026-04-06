const { createSlice } = require("@reduxjs/toolkit");

export const historyBalanceSlice = createSlice({
    name: 'historyBalance',
    initialState: {
        historyBalance: [],
        isLoading: false,
    },
    reducers: {
        startLoadingHistoryBalance: (state, /*action*/) => {
            state.isLoading = true;
        },

        getHistoryBalance: (state, action) => {
            state.isLoading = false;
            state.historyBalance = Object.values(action.payload.historyBalance)
        },

        getHistoryBalanceByDate: (state, action) => {
            state.isLoading = false;
            state.historyBalance = action.payload.historyBalance
        },
    }
});

export const { getHistoryBalance, getHistoryBalanceByDate, startLoadingHistoryBalance } = historyBalanceSlice.actions; 