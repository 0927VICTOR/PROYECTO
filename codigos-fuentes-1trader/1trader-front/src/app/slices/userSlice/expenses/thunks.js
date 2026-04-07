import axios from "axios";
import { expense, getExpenses, getExpensesById, startLoadingExpenses } from "./expensesSlice"
import { gambatteApi } from "app/api/gambatteApi";
import { setError } from "../deposits";
import { depositsExpensesById } from "app/slices/adminSlice/depositsExpenses/depositsExpensesSilce";


export const getAllExpenses = (callback) => {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoadingExpenses())
            let { data: { data, status } } = await
                gambatteApi.get(`/expenses`)
            if (status === 'ok') {
                dispatch(getExpenses({ expenses: data }))
                return callback(false)
            }
        } catch (error) {
            console.log('error ', error);
            return callback(error)
        }
    }
}

export const getExpenseById = (userId, callback) => {
    return async (dispatch, getState) => {
        try {
            dispatch(startLoadingExpenses())
            let { data: { data, status } } = await
                gambatteApi.get(`/expenses/${userId}`)
            if (status === 'ok') {
                dispatch(getExpenses({ expenses: data.account_.expenses }))
                return callback(false)
            }
        } catch (error) {
            console.log('error ', error);
            return callback(error)
        }
    }
}

export const getExpenseByIdTest = (id) => {
    return async (dispatch, getState) => {
        dispatch(startLoadingExpenses())
        const resp = await axios.get('/api/customer/get-expense');
        const data = resp.data;
        dispatch(getExpensesById({ expense: data }))
    }
}

export const createExpense = (payload, callback) => {
    return async (dispatch, getState) => {
        dispatch(startLoadingExpenses())
        try {
            let { data: { data: dataResponseExpense, status } } = await
                gambatteApi.post('/expenses', { data: payload })
            if (status === 'ok') {
                dispatch(expense({ expense: dataResponseExpense }))
                return callback(false)
            }
        } catch (e) {
            // console.log('Error expenses', e);
            dispatch(setError({ errorName: e.message }))
            return callback(e)
        }
    }
}


export const upDateUser = (idUser, data) => {
    return async (dispatch, getState) => {
        dispatch(startLoadingExpenses())
        const resp = await axios.get('/api/customer/get-expense');
        const data = resp.data;
        dispatch(getExpensesById({ expense: data }))
    }
}