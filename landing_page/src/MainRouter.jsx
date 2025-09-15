import { Routes, Route } from 'react-router-dom';
import { PUBLIC_ROUTES } from './constant/publicRoutes';


const MainRouter = () => {
  return (
    <Routes>
      {PUBLIC_ROUTES.map((route, key) => (
        <Route key={key} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default MainRouter;