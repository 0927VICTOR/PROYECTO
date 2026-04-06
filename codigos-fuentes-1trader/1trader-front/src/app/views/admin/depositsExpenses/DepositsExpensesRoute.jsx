import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

// const Account = Loadable(lazy(async () => (await import('./Account'))));
const DepositsExpenses = Loadable(lazy(async () => import('./DepositsExpenses')));

const DepositsExpensesRoute = [{ path: '/admin/user/deposits-expenses', element: <DepositsExpenses /> }];

export default DepositsExpensesRoute;