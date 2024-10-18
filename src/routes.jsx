import { createBrowserRouter } from 'react-router-dom';

import Homepage from './components/common/Homepage';
import LoginPage from './components/common/loginpage';
import RegisterPage from './components/common/registerpage';
import ProfilePage from './components/common/profilepage';
import Records from './components/common/records';
import TrackOrderPage from './components/common/trackorder';
import PlaceOrderPage from './components/common/placeorderpage';
import DeliveryPage from './components/common/deliverypage';
import DeliveryDetail from './components/common/deliverydetail';
import AccountManagement from './components/common/AccountManagement';
import DeliveryMap from './components/common/Map';
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
  {
    path: "account",
    element: <AccountManagement />,
  },
  {
    path: "map",
    element: <DeliveryMap />,
  }
]);
