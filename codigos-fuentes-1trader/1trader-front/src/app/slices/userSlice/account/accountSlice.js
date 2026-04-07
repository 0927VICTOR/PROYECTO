const { createSlice } = require('@reduxjs/toolkit');

export const accountSlice = createSlice({
    name: 'account',
    initialState: {
        account:
        {
            id: '323sa680b32497dsfdsgga21rt',
            balance: 0
        },
        isLoading: false,
    },
    reducers: {
        startLoadingAccountBalance: (state, /*action*/) => {
            state.isLoading = true;
        },
        getaccountBalance: (state, action) => {
            state.account = action.payload.account;
        },
    }
});

export const { getaccountBalance, startLoadingAccountBalance } = accountSlice.actions;