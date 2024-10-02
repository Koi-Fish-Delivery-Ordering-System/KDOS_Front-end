import { createBrowserRouter } from 'react-router-dom';

import Homepage from './components/common/Homepage';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
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
]);
