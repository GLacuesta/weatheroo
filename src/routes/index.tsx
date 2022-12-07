import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';

const Weather = lazy(() => import('../views/Weather'));
const NotFound = lazy(() => import('../views/NotFound'));

const RoutesHOC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/NotFound" element={<NotFound />} />
        <Route path="/" element={<Weather />} />
        <Route path="/*" element={<Navigate to="/NotFound" replace />} />
      </Routes>
    </Layout>
  );
}

export default RoutesHOC;

