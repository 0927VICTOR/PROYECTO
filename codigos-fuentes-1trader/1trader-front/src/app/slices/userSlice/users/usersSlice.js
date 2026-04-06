const { createSlice, current } = require('@reduxjs/toolkit');
const { findIndex } = require('lodash')

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        isLoading: false,
    },
    reducers: {
        startLoadingUsers: (state, /*action*/) => {
            state.isLoading = true;
        },
        getUsers: (state, action) => {
            state.isLoading = false
            state.users = action.payload.users;
        },
        getUser: (state, action) => {
            state.isLoading = false
            // console.log(current(state));
            state.users = [action.payload.user];
        },
        updateFinishRegisterUser: (state, action) => {
            state.isLoading = false
            let index = findIndex(state.users, (e) => {
                return e.id == action.payload.user.id;
            }, 0);
            state.users[index] = action.payload.user
        },
        updateUserById: (state, action) => {
            state.isLoading = false
            let index = findIndex(state.users, (e) => {
                return e.id == action.payload.user.id;
            });
            state.users[index] = action.payload.user
            // console.log(current(state));
        }
    }
});

export const { getUsers, getUser, startLoadingUsers, updateFinishRegisterUser, updateUserById } = usersSlice.actions;