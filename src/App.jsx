import {  useSelector } from 'react-redux';
import Navbar from './components/common/Navbar';
import Login from './screens/auth/Login';
import PrivateRoute from './components/common/PrivateRoute';
import {USER_ROLES} from './config/config'
import { Route, Routes } from 'react-router-dom';
import { adminRoutes, authRoutes, officialRoutes, studentRoutes } from './config/config';

const App = () => {

  const {token} = useSelector((state) => state.Auth);
  const {user} = useSelector((state) => state.Profile);

  console.log("TOKEN", token);

  return (
    <div className='w-[100vw] h-[100vh] overflow-hidden flex flex-col items-center bg-gray-100'>
      <Navbar />
      
      {
        !token && (
          <Routes>
            {
              authRoutes.map((route) => {
                if(!route.role) return <Route path={route.path} element={route.element} />
                else return (
                  <PrivateRoute allowedRoutes={route.role}>
                    <Route path={route.path} element={route.element} />
                  </PrivateRoute>
                )
              })
            }
          </Routes>
        )
      }

      {/* ADMIN ROUTES */}
      {
        token && user && user.accountType == USER_ROLES.ADMIN && (
          <Routes>
            {
              adminRoutes.map((route) => {
                if(!route.role) return <Route path={route.path} element={route.element} />
                else return (
                  <PrivateRoute allowedRoutes={route.role}>
                    <Route path={route.path} element={route.element} />
                  </PrivateRoute>
                )
              })
            }
          </Routes>
        )
      }

      {/* STUDENT ROUTES */}
      {
        token && user && user.accountType == USER_ROLES.STUDENT && (
          <Routes>
            {
              studentRoutes.map((route) => {
                if(!route.role) return <Route path={route.path} element={route.element} />
                else return (
                  <PrivateRoute allowedRoutes={route.role}>
                    <Route path={route.path} element={route.element} />
                  </PrivateRoute>
                )
              })
            }
          </Routes>
        )
      }

      {/* OFFICIAL ROUTES */}
      {
        token && user && user.accountType == USER_ROLES.OFFICIAL && (
          <Routes>
            {
              officialRoutes.map((route) => {
                if(!route.role) return <Route path={route.path} element={route.element} />
                else return (
                  <PrivateRoute allowedRoutes={route.role}>
                    <Route path={route.path} element={route.element} />
                  </PrivateRoute>
                )
              })
            }
          </Routes>
        )
      }
      
    </div>
  );
};

export default App;
