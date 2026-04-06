import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

// const Account = Loadable(lazy(async () => (await import('./Account'))));
const UserAdminSystemChangePassword = Loadable(lazy(async () => import('./UserChangePassword')));

const UserAdminSystemChangePasswordRoute = [{ path: '/admin/user-system-change-password', element: <UserAdminSystemChangePassword /> }];

export default UserAdminSystemChangePasswordRoute;