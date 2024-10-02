import { createBrowserRouter } from 'react-router-dom';

import Homepage from './components/common/homepage';
import LoginPage from './components/common/loginpage';
import RegisterPage from './components/common/registerpage';
// import ProfilePage from './page/profile';


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
  // {
  //   path: "profile",
  //   element: <ProfilePage />,
  // },
]);
