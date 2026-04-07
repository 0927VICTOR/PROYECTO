import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const PerfilUser = Loadable(lazy(async () => import('./PerfilUser')));

const perfilUserRoute = [{ path: '/customer/perfil', element: <PerfilUser /> }];

export default perfilUserRoute;