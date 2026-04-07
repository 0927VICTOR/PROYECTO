import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

// const Account = Loadable(lazy(async () => (await import('./Account'))));
const NotificationsPayments = Loadable(lazy(async () => import('./NotificationsPayments')));

const NotificationsPaymentsRoute = [{ path: '/admin/user/notifications-payments/:id', element: <NotificationsPayments /> }];

export default NotificationsPaymentsRoute;