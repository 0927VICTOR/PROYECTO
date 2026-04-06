import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

// const Account = Loadable(lazy(async () => (await import('./Account'))));
const UserSystem = Loadable(lazy(async () => import('./UserSystem')));

const UserSystemRoute = [{ path: '/admin/user-system', element: <UserSystem /> }];

export default UserSystemRoute;