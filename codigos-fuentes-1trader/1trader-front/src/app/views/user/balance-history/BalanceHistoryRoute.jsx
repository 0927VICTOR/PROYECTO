import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const BalanceHistory = Loadable(lazy(async () => import('./BalanceHistory')));

const BalanceHistoryRoute = [{ path: '/customer/account/balance/:id', element: <BalanceHistory /> }];

export default BalanceHistoryRoute;