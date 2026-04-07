import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

// const Account = Loadable(lazy(async () => (await import('./Account'))));
const Deposits = Loadable(lazy(async () => import('./Deposits')));

const depositsRoute = [{ path: '/customer/account/deposits', element: <Deposits /> }];

export default depositsRoute;