import Login from "../pages/auth/Login";
import Registration from "../pages/auth/Registration";
import Dashboard from "../pages/dashboard/Dashboard";
import Onboarding from "../pages/onboarding/Onboarding";

export const PUBLIC_ROUTES = [
  {
    path: '/',
    element: <Onboarding />,
    isPrivate: false,
  },
  {
    path: '/*',
    element: <Login />,
    isPrivate: false,
  },
    {
    path: '/register',
    element: <Registration />,
    isPrivate: false,
  }
];