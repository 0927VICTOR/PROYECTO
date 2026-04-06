import { applyMiddleware, compose, createStore } from 'redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
// const thunk = require('redux-thunk');
// import RootReducer from './reducers/RootReducer';

// Sileces of User
import { historyBalanceSlice } from 'app/slices/userSlice/historyBalance';
import { accountSlice } from 'app/slices/userSlice/account';
import { depositsSlice } from 'app/slices/userSlice/deposits';
import { expensesSlice } from 'app/slices/userSlice/expenses';
import { usersSlice } from 'app/slices/userSlice/users';

// Slices of Admin
import { depositsExpensesSlice } from 'app/slices/adminSlice/depositsExpenses/depositsExpensesSilce'
import { earningPaymentsSlice } from 'app/slices/adminSlice/earningPaymetsSlice/earningPaymentsSilce'
import { userSystemSlice } from 'app/slices/adminSlice/userSystem/userSystemSlice'
import { activesSlice } from 'app/slices/adminSlice/actives/activesSilce'

import logger from 'redux-logger'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const initialState = {};

let devtools = (x) => x;

if (
  process &&
  process.env.NODE_ENV !== 'production' &&
  process.browser &&
  window.__REDUX_DEVTOOLS_EXTENSION__
) {
  devtools = window.__REDUX_DEVTOOLS_EXTENSION__();
}

// const middleware = process.env.NODE_ENV !== 'production' ?
//   [require('redux-immutable-state-invariant').default(), thunk] :
//   [thunk];


export const Store = configureStore({
  reducer: {
    historyBalance: historyBalanceSlice.reducer,
    account: accountSlice.reducer,
    deposits: depositsSlice.reducer,
    users: usersSlice.reducer,
    expenses: expensesSlice.reducer,
    depositsExpenses: depositsExpensesSlice.reducer,
    earningPayments: earningPaymentsSlice.reducer,
    userSystem: userSystemSlice.reducer,
    actives: activesSlice.reducer,
  }
})
