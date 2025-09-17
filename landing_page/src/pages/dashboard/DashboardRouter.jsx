import { Routes, Route } from 'react-router-dom';
import { PRIVATE_ROUTES } from '../../constant/publicRoutes';


const DashboardRouter = () => {
  return (
    <Routes>
      {PRIVATE_ROUTES.map((route, key) => (
        <Route key={key} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default DashboardRouter;