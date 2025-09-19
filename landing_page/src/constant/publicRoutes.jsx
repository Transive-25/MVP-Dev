import DashboardLayout from "../layout/DashboardLayout";
import Login from "../pages/auth/Login";
import Registration from "../pages/auth/Registration";
import Dashboard from "../pages/dashboard/Dashboard";
import TransportWizard from "../pages/dashboard/TransportWizard";
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
  },
    {
    path: '/dashboard/*',
    element: <DashboardLayout />,
    isPrivate: true,
  },
];

export const PRIVATE_ROUTES = [
  {
    path: '*',
    element: <Dashboard />,
  },
    {
    path: 'wizard',
    element: <TransportWizard />,
  },
];