import { createBrowserRouter } from 'react-router-dom';

import Homepage from './components/common/Homepage';
import LoginPage from './components/common/loginpage';
import RegisterPage from './components/common/registerpage';
// import ServicePage from './components/common/servicepage';
// import OrderPage from './components/common/orderinformationpage';
// import OrderDetailPage from './components/common/orderdetailpage';
// import CheckoutPage from './components/common/checkout';
import ProfilePage from './components/common/profilepage';
import Records from './components/common/records';
import TrackOrderPage from './components/common/trackorder';
import PlaceOrderPage from './components/common/placeorderpage';
import DeliveryPage from './components/common/deliverypage';
import DeliveryDetail from './components/common/deliverydetail';
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
  //   path: "service",
  //   element: <ServicePage />,
  // },
  // {
  //   path: "orderinformation",
  //   element: <OrderPage />,
  // },
  // {
  //   path: "orderdetail",
  //   element: <OrderDetailPage />,
  // },
  // {
  //   path: "checkout",
  //   element: <CheckoutPage />,
  // },
  {
    path: "profile",
    element: <ProfilePage />,
  },
   {
    path: "records",
    element: <Records />,
  },
   {
    path: "trackorder",
    element: <TrackOrderPage />,
  },
  {
    path: "placeorder",
    element: <PlaceOrderPage />,
  },
  {
    path: "delivery",
    element: <DeliveryPage />,
  },
  {
    path: "deliverydetail/:orderId",
    element: <DeliveryDetail />,
  },
  
]);
