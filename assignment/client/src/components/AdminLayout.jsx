import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Typography, Space, Badge } from 'antd';
import {
    DashboardOutlined,
    CustomerServiceOutlined,
    InboxOutlined,
    TeamOutlined,
    LogoutOutlined,
    UserOutlined,
    BellOutlined,
    SettingOutlined
} from '@ant-design/icons';
import useAuthStore from '../store/authStore';

const { Sider, Content, Header } = Layout;
const { Text, Title } = Typography;

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const menuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard'
        },
        {
            key: '/admin/tickets',
            icon: <CustomerServiceOutlined />,
            label: 'Tickets'
        },
        {
            key: '/admin/queues',
            icon: <InboxOutlined />,
            label: 'Queues'
        },
        ...(user?.role === 'admin' || user?.role === 'supervisor' ? [{
            key: '/admin/agents',
            icon: <TeamOutlined />,
            label: 'Agents'
        }] : [])
    ];

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile'
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings'
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true
        }
    ];

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    const handleUserMenuClick = ({ key }) => {
        if (key === 'logout') {
            logout();
            navigate('/admin/login');
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        return parts.length > 1
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : name.substring(0, 2).toUpperCase();
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                width={260}
                style={{
                    background: 'rgba(30, 30, 46, 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderRight: '1px solid rgba(99, 102, 241, 0.15)',
                    position: 'fixed',
                    height: '100vh',
                    zIndex: 100
                }}
            >
                <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
                    <Space align="center">
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20
                        }}>
                            🎫
                        </div>
                        <div>
                            <Title level={5} style={{ margin: 0, color: '#f1f5f9' }}>SupportDesk</Title>
                            <Text style={{ color: '#94a3b8', fontSize: 12 }}>AI-Powered Help</Text>
                        </div>
                    </Space>
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        marginTop: 16,
                        padding: '0 8px'
                    }}
                    theme="dark"
                />

                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '16px 20px',
                    borderTop: '1px solid rgba(99, 102, 241, 0.1)',
                    background: 'rgba(30, 30, 46, 0.95)'
                }}>
                    <Dropdown
                        menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                        trigger={['click']}
                        placement="topRight"
                    >
                        <Space style={{ cursor: 'pointer', width: '100%' }}>
                            <Avatar
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                    fontWeight: 600
                                }}
                            >
                                {getInitials(user?.name)}
                            </Avatar>
                            <div>
                                <Text strong style={{ color: '#f1f5f9', display: 'block' }}>{user?.name}</Text>
                                <Text style={{ color: '#94a3b8', fontSize: 12, textTransform: 'capitalize' }}>
                                    {user?.role}
                                </Text>
                            </div>
                        </Space>
                    </Dropdown>
                </div>
            </Sider>

            <Layout style={{ marginLeft: 260, background: 'transparent' }}>
                <Header style={{
                    background: 'rgba(30, 30, 46, 0.8)',
                    backdropFilter: 'blur(12px)',
                    padding: '0 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 99
                }}>
                    <Space size="large">
                        <Badge count={5} size="small">
                            <BellOutlined style={{ fontSize: 20, color: '#94a3b8', cursor: 'pointer' }} />
                        </Badge>
                        <Text style={{ color: '#94a3b8' }}>
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </Space>
                </Header>

                <Content style={{
                    padding: 32,
                    minHeight: 'calc(100vh - 64px)',
                    background: 'linear-gradient(135deg, #0f0f23 0%, #1e1e2e 50%, #2a2a3e 100%)'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
