import { createBrowserRouter } from 'react-router-dom';

import Homepage from './components/common/Homepage';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },

]);
