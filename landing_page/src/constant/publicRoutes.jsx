import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

export const PUBLIC_ROUTES = [
  {
    path: '/',
    element: <Dashboard />,
    isPrivate: false,
  },
  {
    path: '/*',
    element: <Login />,
    isPrivate: false,
  }
];