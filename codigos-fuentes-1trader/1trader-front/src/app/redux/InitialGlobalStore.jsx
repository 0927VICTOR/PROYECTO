import { getAllDeposits } from "app/slices/userSlice/deposits";
import { getAllExpenses } from "app/slices/userSlice/expenses";
import { getAllUsers } from "app/slices/userSlice/users";
import { getEarningPaymentsThunk } from "app/slices/adminSlice/earningPaymetsSlice/thunk";
import { getAllUserSystemThunk } from "app/slices/adminSlice/userSystem";
import { getAllActivesThunk } from "app/slices/adminSlice/actives/thunk";


export const initalGlobalStore = {
    getAllDeposits,
    getAllExpenses,
    getAllUsers,
    getEarningPaymentsThunk,
    getAllUserSystemThunk,
    getAllActivesThunk,
    // Store para administradores
}