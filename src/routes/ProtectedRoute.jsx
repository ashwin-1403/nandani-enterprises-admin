// // import { Navigate, Outlet, useLocation } from 'react-router-dom';
// // import { getUserDataFromStore } from 'shared/helper/token.helper';
// // import { roleStatusChecker } from './shared/services/role.service';

// export default function ProtectedRoute(props) {
//   // const { redirectPath, allowedRoles } = props;
//   // const location = useLocation();

//   // const userInfo= getUserDataFromStore();

//   // if (userInfo == null) {
//   //   const previousState = location.pathname;
//   //   sessionStorage.setItem('previousUrl', previousState);
//   //   return (
//   //     <Navigate
//   //       to={redirectPath}
//   //       replace
//   //     />
//   //   );
//   // }

//   // if (sessionStorage.getItem('previousUrl')) {
//   //   sessionStorage.removeItem('previousUrl');
//   // }

//   // if (
//   //   userInfo &&
//   //   userInfo['userRoles'] &&
//   //   (userInfo['userRoles'].length === 0 ||
//   //     !roleStatusChecker(allowedRoles, userInfo['userRoles']))
//   // ) {
//   //   return (
//   //     <Navigate
//   //       to="/access-denied"
//   //       replace
//   //     />
//   //   );
//   // }

//   return <Outlet />;
// }
