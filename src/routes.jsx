import { createBrowserRouter } from 'react-router-dom';

import Homepage from './components/common/Homepage';
import LoginPage from './components/common/loginpage';
import RegisterPage from './components/common/registerpage';
// import ProfilePage from './page/profile';
import ServicePage from './components/common/servicepage';

export const router = createBrowserRouter([

  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "service",
    element: <ServicePage />,
  },
  // {
  //   path: "profile",
  //   element: <ProfilePage />,
  // },
]);
