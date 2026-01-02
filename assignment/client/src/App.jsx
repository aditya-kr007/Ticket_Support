import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import useAuthStore from './store/authStore';

// Pages
import HomePage from './pages/HomePage';
import SubmitTicketPage from './pages/SubmitTicketPage';
import TrackTicketPage from './pages/TrackTicketPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import TicketsPage from './pages/admin/TicketsPage';
import QueuesPage from './pages/admin/QueuesPage';
import AgentsPage from './pages/admin/AgentsPage';
import AdminLayout from './components/AdminLayout';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/submit" element={<SubmitTicketPage />} />
                    <Route path="/track" element={<TrackTicketPage />} />

                    {/* Auth Routes */}
                    <Route path="/admin/login" element={<LoginPage />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="tickets" element={<TicketsPage />} />
                        <Route path="queues" element={<QueuesPage />} />
                        <Route path="agents" element={
                            <ProtectedRoute allowedRoles={['admin', 'supervisor']}>
                                <AgentsPage />
                            </ProtectedRoute>
                        } />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
