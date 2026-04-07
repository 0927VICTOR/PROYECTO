import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

// const Account = Loadable(lazy(async () => (await import('./Account'))));
const Account = Loadable(lazy(async () => import('./Account')));

const accountRoute = [{ path: '/customer/account', element: <Account /> }];

export default accountRoute;