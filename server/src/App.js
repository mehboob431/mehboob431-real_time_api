import { Routes, Route } from 'react-router-dom';
import Login from './pages/Users/Login';
import {
  OrderList,
  DeliveredOrder,
  CanceledOrder,
  ConfirmedOrder,
  RejectedOrder,
  PendingOrder,
} from './pages/Order';
import User from './pages/Users/User';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { authState } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Admin only */}
        <Route
          path="user"
          element={
            <PrivateRoute roles={['Admin', 'Superadmin']}>
              <User />
            </PrivateRoute>
          }
        />

        {/* Tasks (Admin + User) */}
        <Route path="all" element={<OrderList />} />
        <Route path="pending" element={<PendingOrder />} />
        <Route path="confirmed" element={<ConfirmedOrder />} />
        <Route path="delivered" element={<DeliveredOrder />} />
        <Route path="canceled" element={<CanceledOrder />} />
        <Route path="rejected" element={<RejectedOrder />} />
      </Route>
    </Routes>
  );
};

export default App;
