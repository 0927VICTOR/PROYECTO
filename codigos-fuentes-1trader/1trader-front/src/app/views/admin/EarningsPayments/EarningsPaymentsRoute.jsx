import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

// const Account = Loadable(lazy(async () => (await import('./Account'))));
const EarningsPayments = Loadable(lazy(async () => import('./EarningsPayments')));

const EarningsPaymentsRoute = [{ path: '/admin/user/earning/payment/user/:id', element: <EarningsPayments /> }];

export default EarningsPaymentsRoute;