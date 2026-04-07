import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

// const Account = Loadable(lazy(async () => (await import('./Account'))));
const Expenses = Loadable(lazy(async () => import('./Expenses')));

const expensesRoute = [{ path: '/customer/account/expenses', element: <Expenses /> }];

export default expensesRoute;