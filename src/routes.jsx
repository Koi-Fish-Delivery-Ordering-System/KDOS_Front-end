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
import OurServices from './components/common/ourservices';

const ProtectedRoute = ({ element, roles }) => {
  const isAuthenticated = sessionStorage.getItem('accessToken');
  const userRole = sessionStorage.getItem('role'); // Retrieve the role directly as a string

  // If authenticated, check the role
  if (isAuthenticated) {
    // Redirect customers trying to access the delivery page
    if (userRole === "customer" && roles === "delivery") {
      return <Navigate to="/" />;
    } else if (userRole === "customer" && roles === "manager") {
      return <Navigate to="/" />;
    } else if (userRole === "delivery" && roles === "manager") {
      return <Navigate to="/delivery" />;
    } else if (userRole === "manager" && roles === "delivery") {
      return <Navigate to="/manager" />;
    } else if (userRole === "manager" && roles === "customer") {
      return <Navigate to="/manager" />;
    } else if (userRole === "delivery" && roles === "customer") {
      return <Navigate to="/delivery" />;
    }

    // If the role matches, render the element
    if (userRole === roles) {
      return element;
    }

    // If the role does not match, you can choose to render the element or redirect
    return <Navigate to="/" />; // Redirect to homepage or another page
  }

  // If not authenticated, navigate to login
  return <Navigate to="/unauthorized" />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  roles: PropTypes.string.isRequired, // Validate 'roles' prop as a string
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
    path: "ourservices",
    element: <OurServices />,
  },
  {
    path: "profile",
    element: <ProfilePage />,
  },
  {
    path: "records",
    element: <ProtectedRoute element={<OrderHistory />} roles="customer" />,
  },
  {
    path: "trackorder",
    element: <ProtectedRoute element={<TrackOrderPage />} roles="customer" />,
  },
  {
    path: "placeorder",
    element: <ProtectedRoute element={<PlaceOrderPage />} roles="customer" />,
  },
  {
    path: "deliverypage",
    element: <ProtectedRoute element={<DeliveryPage />} roles="customer" />,
  },
  {
    path: "deliverydetail/:orderId",
    element: <ProtectedRoute element={<DeliveryDetail />} roles="customer" />,
  },
  {
    path: "account-management",
    element: <ProtectedRoute element={<AccountManagement />} roles="customer" />,
  },
  {
    path: "order-confirmation",
    element: <ProtectedRoute element={<OrderConfirmation />} roles="customer" />,
  },
  {
    path: "delivery",
    element: <ProtectedRoute element={<Delivery />} roles="delivery" />,
  },
  {
    path: "healchecker",
    element: <ProtectedRoute element={<HealChecker />} roles="healchecker" />,
  },
  {
    path: "manager",
    element: <ProtectedRoute element={<Manager />} roles="manager" />,
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
    element: <ProtectedRoute element={<PaymentStatus />} roles="customer" />,
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
