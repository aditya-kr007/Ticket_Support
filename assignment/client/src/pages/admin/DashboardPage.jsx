import { useState, useEffect } from 'react';
import {
    Typography,
    Row,
    Col,
    Card,
    Statistic,
    Spin,
    Progress,
    Tag,
    Space
} from 'antd';
import {
    CustomerServiceOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ThunderboltOutlined,
    RobotOutlined,
    RiseOutlined,
    FallOutlined,
    FireOutlined
} from '@ant-design/icons';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts';
import { adminAPI } from '../../api';

const { Title, Text } = Typography;

const DashboardPage = () => {
    const [metrics, setMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const response = await adminAPI.getMetrics();
            setMetrics(response.data.data);
        } catch (error) {
            console.error('Failed to fetch metrics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 400
            }}>
                <Spin size="large" />
            </div>
        );
    }

    const overviewStats = [
        {
            title: 'Total Tickets',
            value: metrics?.overview?.total || 0,
            icon: <CustomerServiceOutlined style={{ fontSize: 24, color: '#6366f1' }} />,
            color: '#6366f1',
            trend: '+12%',
            trendUp: true
        },
        {
            title: 'Open Tickets',
            value: metrics?.overview?.open || 0,
            icon: <ClockCircleOutlined style={{ fontSize: 24, color: '#3b82f6' }} />,
            color: '#3b82f6',
            trend: '-5%',
            trendUp: false
        },
        {
            title: 'Resolved Today',
            value: metrics?.byStatus?.resolved || 0,
            icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#10b981' }} />,
            color: '#10b981',
            trend: '+18%',
            trendUp: true
        },
        {
            title: 'Avg. Resolution',
            value: `${metrics?.performance?.avgResolutionHours || 0}h`,
            icon: <ThunderboltOutlined style={{ fontSize: 24, color: '#f59e0b' }} />,
            color: '#f59e0b',
            trend: '-2h',
            trendUp: true
        }
    ];

    const priorityData = [
        { name: 'Critical', value: metrics?.byPriority?.critical || 0, color: '#ef4444' },
        { name: 'High', value: metrics?.byPriority?.high || 0, color: '#f97316' },
        { name: 'Medium', value: metrics?.byPriority?.medium || 0, color: '#f59e0b' },
        { name: 'Low', value: metrics?.byPriority?.low || 0, color: '#10b981' }
    ];

    const categoryData = Object.entries(metrics?.byCategory || {}).map(([name, value]) => ({
        name: name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        value
    }));

    const queueData = Object.entries(metrics?.byQueue || {}).map(([name, value]) => ({
        name: name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        count: value
    }));

    const hourlyData = Array.from({ length: 24 }, (_, i) => {
        const found = metrics?.hourlyTrend?.find(h => h._id === i);
        return {
            hour: `${i}:00`,
            tickets: found?.count || 0
        };
    });

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ color: '#f1f5f9', marginBottom: 8 }}>
                    Dashboard
                </Title>
                <Text style={{ color: '#94a3b8' }}>
                    Real-time overview of your support ticket metrics
                </Text>
            </div>

            {/* Overview Stats */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                {overviewStats.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card
                            className="stats-card"
                            style={{
                                background: 'rgba(30, 30, 46, 0.7)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(99, 102, 241, 0.15)',
                                borderRadius: 16,
                                height: '100%'
                            }}
                            styles={{ body: { padding: 24 } }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: 16
                            }}>
                                <div style={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 12,
                                    background: `${stat.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {stat.icon}
                                </div>
                                <Tag style={{
                                    background: stat.trendUp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                    color: stat.trendUp ? '#10b981' : '#ef4444',
                                    border: 'none',
                                    borderRadius: 6,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                }}>
                                    {stat.trendUp ? <RiseOutlined /> : <FallOutlined />}
                                    {stat.trend}
                                </Tag>
                            </div>
                            <Text style={{ color: '#94a3b8', fontSize: 14, display: 'block', marginBottom: 4 }}>
                                {stat.title}
                            </Text>
                            <Text style={{
                                fontSize: 32,
                                fontWeight: 700,
                                color: '#f1f5f9',
                                lineHeight: 1.2
                            }}>
                                {stat.value}
                            </Text>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Charts Row */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                {/* Hourly Trend */}
                <Col xs={24} lg={16}>
                    <Card
                        style={{
                            background: 'rgba(30, 30, 46, 0.7)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                            borderRadius: 16,
                            height: '100%'
                        }}
                        styles={{ body: { padding: 24 } }}
                    >
                        <Title level={5} style={{ color: '#f1f5f9', marginBottom: 24 }}>
                            Ticket Volume (Last 24 Hours)
                        </Title>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={hourlyData}>
                                <defs>
                                    <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                                <XAxis
                                    dataKey="hour"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(30, 30, 46, 0.95)',
                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                        borderRadius: 8
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="tickets"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorTickets)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Priority Distribution */}
                <Col xs={24} lg={8}>
                    <Card
                        style={{
                            background: 'rgba(30, 30, 46, 0.7)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                            borderRadius: 16,
                            height: '100%'
                        }}
                        styles={{ body: { padding: 24 } }}
                    >
                        <Title level={5} style={{ color: '#f1f5f9', marginBottom: 24 }}>
                            Priority Distribution
                        </Title>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={priorityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(30, 30, 46, 0.95)',
                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                        borderRadius: 8
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                            {priorityData.map((item, index) => (
                                <Space key={index} size={4}>
                                    <span style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        background: item.color,
                                        display: 'inline-block'
                                    }} />
                                    <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                                        {item.name} ({item.value})
                                    </Text>
                                </Space>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Bottom Row */}
            <Row gutter={[24, 24]}>
                {/* Queue Overview */}
                <Col xs={24} lg={12}>
                    <Card
                        style={{
                            background: 'rgba(30, 30, 46, 0.7)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                            borderRadius: 16
                        }}
                        styles={{ body: { padding: 24 } }}
                    >
                        <Title level={5} style={{ color: '#f1f5f9', marginBottom: 24 }}>
                            Tickets by Queue
                        </Title>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={queueData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" horizontal={false} />
                                <XAxis type="number" stroke="#64748b" fontSize={12} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    stroke="#64748b"
                                    fontSize={12}
                                    width={120}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(30, 30, 46, 0.95)',
                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                        borderRadius: 8
                                    }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#6366f1"
                                    radius={[0, 6, 6, 0]}
                                    background={{ fill: 'rgba(99, 102, 241, 0.1)', radius: [0, 6, 6, 0] }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* AI Performance & Quick Stats */}
                <Col xs={24} lg={12}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <Card
                                style={{
                                    background: 'rgba(30, 30, 46, 0.7)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(99, 102, 241, 0.15)',
                                    borderRadius: 16
                                }}
                                styles={{ body: { padding: 24 } }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                                    <div style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        background: 'rgba(99, 102, 241, 0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <RobotOutlined style={{ fontSize: 24, color: '#6366f1' }} />
                                    </div>
                                    <div>
                                        <Text style={{ color: '#94a3b8', display: 'block' }}>AI Classification Accuracy</Text>
                                        <Title level={3} style={{ color: '#f1f5f9', margin: 0 }}>
                                            {metrics?.performance?.aiAccuracy || 0}%
                                        </Title>
                                    </div>
                                </div>
                                <Progress
                                    percent={metrics?.performance?.aiAccuracy || 0}
                                    showInfo={false}
                                    strokeColor={{
                                        '0%': '#6366f1',
                                        '100%': '#a855f7'
                                    }}
                                    trailColor="rgba(99, 102, 241, 0.15)"
                                    strokeWidth={12}
                                    style={{ borderRadius: 6 }}
                                />
                            </Card>
                        </Col>

                        <Col xs={12}>
                            <Card
                                style={{
                                    background: 'rgba(30, 30, 46, 0.7)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(99, 102, 241, 0.15)',
                                    borderRadius: 16
                                }}
                                styles={{ body: { padding: 20 } }}
                            >
                                <Statistic
                                    title={<Text style={{ color: '#94a3b8' }}>This Week</Text>}
                                    value={metrics?.overview?.weekTickets || 0}
                                    valueStyle={{ color: '#f1f5f9', fontSize: 28 }}
                                    prefix={<FireOutlined style={{ color: '#f97316' }} />}
                                />
                            </Card>
                        </Col>

                        <Col xs={12}>
                            <Card
                                style={{
                                    background: 'rgba(30, 30, 46, 0.7)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(99, 102, 241, 0.15)',
                                    borderRadius: 16
                                }}
                                styles={{ body: { padding: 20 } }}
                            >
                                <Statistic
                                    title={<Text style={{ color: '#94a3b8' }}>This Month</Text>}
                                    value={metrics?.overview?.monthTickets || 0}
                                    valueStyle={{ color: '#f1f5f9', fontSize: 28 }}
                                    prefix={<RiseOutlined style={{ color: '#10b981' }} />}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;
