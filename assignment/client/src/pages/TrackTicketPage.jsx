import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Form,
    Input,
    Button,
    Card,
    Table,
    Tag,
    Space,
    Empty,
    Spin,
    message
} from 'antd';
import {
    SearchOutlined,
    ArrowLeftOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { ticketsAPI } from '../api';

const { Title, Text } = Typography;

const TrackTicketPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!email) {
            message.warning('Please enter your email address');
            return;
        }

        setIsLoading(true);
        try {
            const response = await ticketsAPI.getByEmail(email);
            setTickets(response.data.data);
            setHasSearched(true);
        } catch (error) {
            message.error('Failed to fetch tickets');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            'open': { color: '#3b82f6', icon: <ClockCircleOutlined />, bg: 'rgba(59, 130, 246, 0.15)' },
            'in-progress': { color: '#f59e0b', icon: <SyncOutlined spin />, bg: 'rgba(245, 158, 11, 0.15)' },
            'pending': { color: '#94a3b8', icon: <ExclamationCircleOutlined />, bg: 'rgba(148, 163, 184, 0.15)' },
            'resolved': { color: '#10b981', icon: <CheckCircleOutlined />, bg: 'rgba(16, 185, 129, 0.15)' },
            'closed': { color: '#64748b', icon: <CheckCircleOutlined />, bg: 'rgba(100, 116, 139, 0.15)' }
        };
        return configs[status] || configs['open'];
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'low': '#10b981',
            'medium': '#f59e0b',
            'high': '#f97316',
            'critical': '#ef4444'
        };
        return colors[priority] || colors['medium'];
    };

    const columns = [
        {
            title: 'Ticket',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    <Text strong style={{ color: '#f1f5f9', display: 'block', marginBottom: 4 }}>
                        {text}
                    </Text>
                    <Text style={{ color: '#64748b', fontSize: 12 }}>
                        ID: {record._id.substring(0, 8)}...
                    </Text>
                </div>
            )
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category) => (
                <Tag style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: 6,
                    textTransform: 'capitalize'
                }}>
                    {category?.replace('-', ' ')}
                </Tag>
            )
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => (
                <Tag style={{
                    background: `${getPriorityColor(priority)}20`,
                    color: getPriorityColor(priority),
                    border: `1px solid ${getPriorityColor(priority)}40`,
                    borderRadius: 6,
                    textTransform: 'capitalize',
                    fontWeight: 600
                }}>
                    {priority}
                </Tag>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const config = getStatusConfig(status);
                return (
                    <Tag style={{
                        background: config.bg,
                        color: config.color,
                        border: `1px solid ${config.color}40`,
                        borderRadius: 6,
                        textTransform: 'capitalize',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                    }}>
                        {config.icon}
                        {status?.replace('-', ' ')}
                    </Tag>
                );
            }
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                    {new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </Text>
            )
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1e1e2e 50%, #2a2a3e 100%)',
            padding: '40px 24px'
        }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/')}
                        style={{ color: '#94a3b8', marginBottom: 16 }}
                    >
                        Back to Home
                    </Button>
                    <Title level={2} style={{ color: '#f1f5f9', marginBottom: 8 }}>
                        Track Your Tickets
                    </Title>
                    <Text style={{ color: '#94a3b8', fontSize: 16 }}>
                        Enter your email to view all your submitted support tickets.
                    </Text>
                </div>

                {/* Search Card */}
                <Card
                    style={{
                        background: 'rgba(30, 30, 46, 0.7)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(99, 102, 241, 0.15)',
                        borderRadius: 16,
                        marginBottom: 24
                    }}
                    styles={{ body: { padding: 24 } }}
                >
                    <Form layout="inline" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <Form.Item style={{ flex: 1, minWidth: 280, marginBottom: 0 }}>
                            <Input
                                size="large"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onPressEnter={handleSearch}
                                prefix={<SearchOutlined style={{ color: '#64748b' }} />}
                                style={{
                                    background: 'rgba(30, 30, 46, 0.6)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    borderRadius: 10,
                                    color: '#f1f5f9'
                                }}
                            />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button
                                type="primary"
                                size="large"
                                loading={isLoading}
                                onClick={handleSearch}
                                style={{
                                    borderRadius: 10,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    border: 'none',
                                    paddingInline: 32
                                }}
                            >
                                Search Tickets
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                {/* Results */}
                {isLoading ? (
                    <Card
                        style={{
                            background: 'rgba(30, 30, 46, 0.7)',
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                            borderRadius: 16,
                            textAlign: 'center',
                            padding: 60
                        }}
                    >
                        <Spin size="large" />
                        <Text style={{ color: '#94a3b8', display: 'block', marginTop: 16 }}>
                            Searching for your tickets...
                        </Text>
                    </Card>
                ) : hasSearched && tickets.length === 0 ? (
                    <Card
                        style={{
                            background: 'rgba(30, 30, 46, 0.7)',
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                            borderRadius: 16
                        }}
                        styles={{ body: { padding: 60 } }}
                    >
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <Space direction="vertical" size={8}>
                                    <Text style={{ color: '#94a3b8', fontSize: 16 }}>
                                        No tickets found for this email
                                    </Text>
                                    <Text style={{ color: '#64748b' }}>
                                        Make sure you entered the correct email address
                                    </Text>
                                </Space>
                            }
                        >
                            <Button
                                type="primary"
                                onClick={() => navigate('/submit')}
                                style={{
                                    borderRadius: 8,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    border: 'none'
                                }}
                            >
                                Submit a New Ticket
                            </Button>
                        </Empty>
                    </Card>
                ) : tickets.length > 0 ? (
                    <Card
                        style={{
                            background: 'rgba(30, 30, 46, 0.7)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                            borderRadius: 16,
                            overflow: 'hidden'
                        }}
                        styles={{ body: { padding: 0 } }}
                    >
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
                            <Text style={{ color: '#94a3b8' }}>
                                Found <Text strong style={{ color: '#6366f1' }}>{tickets.length}</Text> ticket(s) for{' '}
                                <Text strong style={{ color: '#f1f5f9' }}>{email}</Text>
                            </Text>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={tickets}
                            rowKey="_id"
                            pagination={{
                                pageSize: 10,
                                showTotal: (total) => `Total ${total} tickets`
                            }}
                            style={{ background: 'transparent' }}
                        />
                    </Card>
                ) : null}
            </div>
        </div>
    );
};

export default TrackTicketPage;
