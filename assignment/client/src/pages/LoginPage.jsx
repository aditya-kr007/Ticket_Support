import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Form,
    Input,
    Button,
    Card,
    message,
    Divider
} from 'antd';
import {
    UserOutlined,
    LockOutlined,
    LoginOutlined
} from '@ant-design/icons';
import useAuthStore from '../store/authStore';

const { Title, Text } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        clearError();
        const result = await login(values);

        if (result.success) {
            message.success('Login successful!');
            navigate('/admin/dashboard');
        } else {
            message.error(result.message);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1e1e2e 50%, #2a2a3e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
        }}>
            {/* Background decorations */}
            <div style={{
                position: 'fixed',
                top: '20%',
                left: '10%',
                width: 400,
                height: 400,
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'fixed',
                bottom: '10%',
                right: '15%',
                width: 300,
                height: 300,
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            <Card
                style={{
                    width: '100%',
                    maxWidth: 440,
                    background: 'rgba(30, 30, 46, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 20,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
                }}
                styles={{ body: { padding: 40 } }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        fontSize: 28
                    }}>
                        🎫
                    </div>
                    <Title level={2} style={{ color: '#f1f5f9', marginBottom: 8 }}>
                        Welcome Back
                    </Title>
                    <Text style={{ color: '#94a3b8' }}>
                        Sign in to access the admin dashboard
                    </Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    requiredMark={false}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input
                            size="large"
                            prefix={<UserOutlined style={{ color: '#64748b' }} />}
                            placeholder="Email address"
                            style={{
                                background: 'rgba(30, 30, 46, 0.6)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                borderRadius: 10,
                                color: '#f1f5f9',
                                height: 52
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined style={{ color: '#64748b' }} />}
                            placeholder="Password"
                            style={{
                                background: 'rgba(30, 30, 46, 0.6)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                borderRadius: 10,
                                color: '#f1f5f9',
                                height: 52
                            }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 16 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={isLoading}
                            icon={<LoginOutlined />}
                            style={{
                                width: '100%',
                                height: 52,
                                borderRadius: 10,
                                fontWeight: 600,
                                fontSize: 16,
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                border: 'none',
                                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
                            }}
                        >
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>

                <Divider style={{ borderColor: 'rgba(99, 102, 241, 0.1)' }}>
                    <Text style={{ color: '#64748b', fontSize: 12 }}>OR</Text>
                </Divider>

                <div style={{ textAlign: 'center' }}>
                    <Text style={{ color: '#94a3b8' }}>
                        Need help?{' '}
                        <a
                            onClick={() => navigate('/')}
                            style={{ color: '#6366f1', cursor: 'pointer' }}
                        >
                            Submit a ticket
                        </a>
                    </Text>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
