import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

// const Account = Loadable(lazy(async () => (await import('./Account'))));
const EarningsPayments = Loadable(lazy(async () => import('./EarningsPayments')));

const PaymentsUserRoute = [{ path: '/customer/payments', element: <EarningsPayments /> }];

export default PaymentsUserRoute;