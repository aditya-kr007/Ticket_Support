import { useNavigate } from 'react-router-dom';
import { Typography, Button, Row, Col, Card, Space } from 'antd';
import {
    SendOutlined,
    SearchOutlined,
    RobotOutlined,
    ThunderboltOutlined,
    SafetyOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const HomePage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <RobotOutlined style={{ fontSize: 32, color: '#6366f1' }} />,
            title: 'AI-Powered Classification',
            description: 'Our intelligent system automatically categorizes and prioritizes your tickets for faster resolution.'
        },
        {
            icon: <ThunderboltOutlined style={{ fontSize: 32, color: '#f59e0b' }} />,
            title: 'Quick Response Time',
            description: 'Smart routing ensures your ticket reaches the right support team immediately.'
        },
        {
            icon: <SafetyOutlined style={{ fontSize: 32, color: '#10b981' }} />,
            title: 'Secure & Reliable',
            description: 'Enterprise-grade security protects your data while ensuring 99.9% uptime.'
        },
        {
            icon: <ClockCircleOutlined style={{ fontSize: 32, color: '#3b82f6' }} />,
            title: '24/7 Support',
            description: 'Round-the-clock assistance to help you whenever you need it most.'
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1e1e2e 50%, #2a2a3e 100%)'
        }}>
            {/* Hero Section */}
            <div style={{
                padding: '100px 24px 80px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background decoration */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '800px',
                    height: '800px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 20px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        borderRadius: 100,
                        marginBottom: 24,
                        border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}>
                        <RobotOutlined style={{ color: '#6366f1' }} />
                        <Text style={{ color: '#a5b4fc', fontSize: 14 }}>Powered by AI</Text>
                    </div>

                    <Title style={{
                        fontSize: 56,
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: 24,
                        lineHeight: 1.2
                    }}>
                        Smart Support Made
                        <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Simple & Fast
                        </span>
                    </Title>

                    <Paragraph style={{
                        fontSize: 18,
                        color: '#94a3b8',
                        maxWidth: 600,
                        margin: '0 auto 40px'
                    }}>
                        Submit your support tickets and let our AI-powered system automatically
                        classify, prioritize, and route them to the right team for faster resolution.
                    </Paragraph>

                    <Space size="large" wrap style={{ justifyContent: 'center' }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<SendOutlined />}
                            onClick={() => navigate('/submit')}
                            style={{
                                height: 56,
                                padding: '0 40px',
                                fontSize: 16,
                                fontWeight: 600,
                                borderRadius: 12,
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                border: 'none',
                                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
                            }}
                        >
                            Submit Ticket
                        </Button>
                        <Button
                            size="large"
                            icon={<SearchOutlined />}
                            onClick={() => navigate('/track')}
                            style={{
                                height: 56,
                                padding: '0 40px',
                                fontSize: 16,
                                fontWeight: 600,
                                borderRadius: 12,
                                background: 'rgba(30, 30, 46, 0.8)',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                color: '#f1f5f9'
                            }}
                        >
                            Track Ticket
                        </Button>
                    </Space>
                </div>
            </div>

            {/* Features Section */}
            <div style={{ padding: '60px 24px 100px', maxWidth: 1200, margin: '0 auto' }}>
                <Title level={2} style={{ textAlign: 'center', color: '#f1f5f9', marginBottom: 48 }}>
                    Why Choose SupportDesk AI?
                </Title>

                <Row gutter={[24, 24]}>
                    {features.map((feature, index) => (
                        <Col xs={24} sm={12} lg={6} key={index}>
                            <Card
                                style={{
                                    height: '100%',
                                    background: 'rgba(30, 30, 46, 0.7)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(99, 102, 241, 0.15)',
                                    borderRadius: 16,
                                    transition: 'all 0.3s ease'
                                }}
                                styles={{ body: { padding: 28 } }}
                                hoverable
                            >
                                <div style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 16,
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 20
                                }}>
                                    {feature.icon}
                                </div>
                                <Title level={4} style={{ color: '#f1f5f9', marginBottom: 12 }}>
                                    {feature.title}
                                </Title>
                                <Text style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                                    {feature.description}
                                </Text>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Admin Link */}
            <div style={{
                textAlign: 'center',
                padding: '40px 24px',
                borderTop: '1px solid rgba(99, 102, 241, 0.1)'
            }}>
                <Text style={{ color: '#64748b' }}>
                    Support Team?{' '}
                    <a
                        onClick={() => navigate('/admin/login')}
                        style={{ color: '#6366f1', cursor: 'pointer' }}
                    >
                        Login to Admin Dashboard
                    </a>
                </Text>
            </div>
        </div>
    );
};

export default HomePage;
