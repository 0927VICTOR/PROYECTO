const { createSlice, current } = require('@reduxjs/toolkit');
// Pendiente organizar el update cuando se crea un deposito o un registro
export const activesSlice = createSlice({
    name: 'actives',
    initialState: {
        actives: [],
        isLoading: false,
        error: null
    },
    reducers: {
        startLoadingActives: (state, /*action*/) => {
            state.isLoading = true;
        },
        getActives: (state, action) => {
            state.isLoading = false;
            state.actives = action.payload.actives
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload.errorName
        }
    }
});

export const { getActives, setError } = activesSlice.actions;