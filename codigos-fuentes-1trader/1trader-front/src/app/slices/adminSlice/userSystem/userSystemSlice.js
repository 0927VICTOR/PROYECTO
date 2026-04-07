import { findIndex } from 'lodash';

const { createSlice, current } = require('@reduxjs/toolkit');
// Pendiente organizar el update cuando se crea un deposito o un registro
export const userSystemSlice = createSlice({
    name: 'userSystem',
    initialState: {
        userSystem: [],
        isLoading: false,
        error: null
    },
    reducers: {
        startLoadingUserSystem: (state, /*action*/) => {
            state.isLoading = true;
        },

        getUserSystem: (state, action) => {
            state.isLoading = false;
            state.userSystem = action.payload.userSystem
        },

        setUserSystem: (state, action) => {
            // console.log('state actual 1', current(state), action.payload.userSystem);
            state.isLoading = false;
            state.userSystem = [...state.userSystem, action.payload.userSystem]
            // console.log('state actual 2', current(state));
        },

        updateUserSystemById: (state, action) => {
            state.isLoading = false;
            // console.log('state actual 1', current(state));
            // console.log('state actual action', action.payload.userSystem);
            let index = findIndex(state.userSystem, (e) => {
                return e.id == action.payload.userSystem.id;
            }, 0);
            state.userSystem[index] = action.payload.userSystem
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

export const { getUserSystem, setUserSystem, updateUserSystemById, startLoadingUserSystem, setError } = userSystemSlice.actions;