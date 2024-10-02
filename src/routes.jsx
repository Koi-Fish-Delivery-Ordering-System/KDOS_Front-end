import { createBrowserRouter } from 'react-router-dom';

import Homepage from './components/common/Homepage';
import LoginPage from './components/common/loginpage';
import RegisterPage from './components/common/registerpage';
// import ProfilePage from './page/profile';
import ServicePage from './components/common/servicepage';
import OrderPage from './components/common/orderinformationpage';
import OrderDetailPage from './components/common/orderdetailpage';
import CheckoutPage from './components/common/checkout';
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
  {
    path: "orderinformation",
    element: <OrderPage />,
  },
  {
    path: "orderdetail",
    element: <OrderDetailPage />,
  },
  {
    path: "checkout",
    element: <CheckoutPage />,
  },
  // {
  //   path: "profile",
  //   element: <ProfilePage />,
  // },
]);
