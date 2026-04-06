import AuthGuard from 'app/auth/AuthGuard';
// Rutas ----------- perfil User
import accountRoute from 'app/views/user/account/AccountRoute';
import balanceHistoryRoute from 'app/views/user/balance-history/BalanceHistoryRoute';
import depositsRoute from 'app/views/user/deposits/DepositsRoute';
import expensesRoute from 'app/views/user/expenses/ExpensesRoute';
import perfilUserRoute from 'app/views/user/perfil-user/PerfilUserRoute';
import paymentsUserRoute from 'app/views/user/EarningsPayments/EarningsPaymentsRoute';
// Rutas ----------- perfil Admin
import adminUserRoute from 'app/views/admin/user_client/UserAdminRoute';
import singOutRute from 'app/views/admin/singOut/SingOutRoute'
// Rutas ----------- Depositos-Retiros
import DepositsExpensesRoute from 'app/views/admin/depositsExpenses/DepositsExpensesRoute'
import NotificationsPaymentsRoute from 'app/views/admin/notificationsPayments/NotificationsPaymentsRoute'
import earningsPaymentsRoute from 'app/views/admin/EarningsPayments/EarningsPaymentsRoute'
import userAdminSystem from 'app/views/admin/security/userSystem/UserUserSystemRoute'
import userAdminSystemChangePassword from 'app/views/admin/security/chagePassword/UserChangePasswordRoute'

import chartsRoute from 'app/views/charts/ChartsRoute';
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import NotFound from 'app/views/sessions/NotFound';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';


const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...dashboardRoutes,
      ...chartsRoute,
      ...accountRoute,
      ...balanceHistoryRoute,
      ...materialRoutes,
      ...depositsRoute,
      ...expensesRoute,
      ...perfilUserRoute,
      ...adminUserRoute,
      ...DepositsExpensesRoute,
      ...NotificationsPaymentsRoute,
      ...singOutRute,
      ...earningsPaymentsRoute,
      ...userAdminSystem,
      ...userAdminSystemChangePassword,
      ...paymentsUserRoute
    ],
  },
  ...sessionRoutes,
  { path: '/', element: <Navigate to="dashboard/default" /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
