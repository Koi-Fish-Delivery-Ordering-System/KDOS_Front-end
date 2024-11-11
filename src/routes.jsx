import { createBrowserRouter, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import Homepage from './components/common/Homepage';
import LoginPage from './components/common/loginpage';
import RegisterPage from './components/common/registerpage';
import ProfilePage from './components/common/profilepage';
import Records from './components/common/orderhistory';
import TrackOrderPage from './components/common/trackorder';
import PlaceOrderPage from './components/common/placeorderpage';
import DeliveryPage from './components/common/delivery/deliverypickup';
import DeliveryDetail from './components/common/delivery/deliverydetail';
import AccountManagement from './components/common/accountmanagement';
import TransportService from './components/common/manager/transportservice';
import OrderConfirmation from './components/common/orderconfirmation';
import Delivery from './components/common/delivery/delivery';
import HealChecker from './components/common/healchecker/healchecker';
import Manager from './components/common/manager/manager';
import FAQ from './components/common/FAQ';
import NewsPage from './components/common/NEWS';
import PaymentStatus from './components/common/paymentstatus';
import RegisterDriverPage from './components/common/registerdriver';
import Unauthorized from './components/common/unauthorized';
import OrderHistory from './components/common/orderhistory';


const ProtectedRoute = ({ element, roles }) => {
  const isAuthenticated = sessionStorage.getItem('accessToken');
  const userRole = sessionStorage.getItem('role'); // Retrieve the role directly as a string

  const hasRequiredRole = userRole === roles; // Check if the user's role matches the required role

  return isAuthenticated && hasRequiredRole ? element : <Navigate to="/login" />;
}

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  roles: PropTypes.string, // Validate 'roles' prop
};

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
    element: <ProtectedRoute element={<ProfilePage />} roles={['customer', 'manager', 'delivery']} />,
  },
  {
    path: "records",
    element: <OrderHistory />
  },
  {
    path: "trackorder",
    element: <ProtectedRoute element={<TrackOrderPage />} roles={['customer']} />,
  },
  {
    path: "placeorder",
    element: <ProtectedRoute element={<PlaceOrderPage />} roles={['customer']} />,
  },
  {
    path: "deliverypage",
    element: <ProtectedRoute element={<DeliveryPage />} roles={['customer']} />,
  },
  {
    path: "deliverydetail/:orderId",
    element: <ProtectedRoute element={<DeliveryDetail />} roles={['customer']} />,
  },
  {
    path: "account-management",
    element: <ProtectedRoute element={<AccountManagement />} roles="customer" />,
  },
  {
    path: "order-confirmation",
    element: <ProtectedRoute element={<OrderConfirmation />} roles={['customer']} />,
  },
  {
    path: "delivery",
    element: <ProtectedRoute element={<Delivery />} roles={['delivery', 'customer']} />,
  },
  {
    path: "healchecker",
    element: <ProtectedRoute element={<HealChecker />} roles={['healchecker']} />,
  },
  {
    path: "manager",
    element: <ProtectedRoute element={<Manager />} roles={['manager']} />,
  },
  {
    path: "faq",
    element: <FAQ />,
  },
  {
    path: "news",
    element: <NewsPage />,
  },
  {
    path: "paymentstatus",
    element: <ProtectedRoute element={<PaymentStatus />} roles={['customer']} />,
  },
  {
    path: "register-driver",
    element: <RegisterDriverPage />,
  },
  {
    path: "unauthorized",
    element: <Unauthorized />,
  }
]);
