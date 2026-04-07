import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

// const Account = Loadable(lazy(async () => (await import('./Account'))));
const UserAdmin = Loadable(lazy(async () => import('./UserAdmin')));

const UserAdminRoute = [{ path: '/admin/user', element: <UserAdmin /> }];

export default UserAdminRoute;