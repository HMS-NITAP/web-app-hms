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


  return (
    <div className='w-[100vw] h-[100vh] overflow-hidden flex flex-col items-center'>
      <Navbar />
      
      <div className="w-full full-minus-header">
        {
          (!token || !user) && (
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
                adminRoutes.map((route, index) => {
                  const element = !route.role
                    ? route.element
                    : <PrivateRoute allowedRoutes={route.role}>{route.element}</PrivateRoute>;

                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={element}
                    />
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
                studentRoutes.map((route, index) => {
                  const element = !route.role
                    ? route.element
                    : <PrivateRoute allowedRoutes={route.role}>{route.element}</PrivateRoute>;

                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={element}
                    />
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
                officialRoutes.map((route, index) => {
                  const element = !route.role
                    ? route.element
                    : <PrivateRoute allowedRoutes={route.role}>{route.element}</PrivateRoute>;

                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={element}
                    />
                  )
                })
              }
            </Routes>
          )
        }
      </div>
      
    </div>
  );
};

export default App;
