import useAuth from 'app/hooks/useAuth';
// import { flat } from 'app/utils/utils';
import { Navigate, useLocation } from 'react-router-dom';
import { Message } from 'app/components/Notification/Notification';
import { useState } from 'react';
// import AllPages from '../routes';

// const userHasPermission = (pathname, user, routes) => {
//   if (!user) {
//     return false;
//   }
//   const matched = routes.find((r) => r.path === pathname);

//   const authenticated =
//     matched && matched.auth && matched.auth.length ? matched.auth.includes(user.role) : true;
//   return authenticated;
// };

const AuthGuard = ({ children }) => {

  let [flag, setFlag] = useState(false)
  let {
    isAuthenticated,
    // user
  } = useAuth();
  const { pathname } = useLocation();

  //   const routes = flat(AllPages);

  //   const hasPermission = userHasPermission(pathname, user, routes);
  //   let authenticated = isAuthenticated && hasPermission;

  // // IF YOU NEED ROLE BASED AUTHENTICATION,
  // // UNCOMMENT ABOVE LINES
  // // AND COMMENT OUT BELOW authenticated VARIABLE

  const validSesionCurrentUser = () => {
    if (isAuthenticated) {
      // setTimeout(() => {
      //   Message('warning', 'Sesión finalizada', 'Se sesion a caducado por favor ingresa nuevamente.')
      // }, 3000)
      return children
    } else {
      // programamos el mensaje y retornamos al login

      // Message('warning', 'Sesión finalizada', 'Su sesión a caducado por favor ingresa nuevamente.')
      return (<Navigate replace to="/session/signin" state={{ from: pathname }} />)
    }
  }

  return (
    <>
      {validSesionCurrentUser()}
    </>
  );


};


export default AuthGuard;
