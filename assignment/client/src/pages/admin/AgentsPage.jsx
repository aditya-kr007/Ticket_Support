import { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Table, Tag, Space, Avatar, Spin, Progress, message } from 'antd';
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { adminAPI } from '../../api';

const { Title, Text } = Typography;

const AgentsPage = () => {
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { fetchAgents(); }, []);

    const fetchAgents = async () => {
        setIsLoading(true);
        try {
            const response = await adminAPI.getAgents();
            setAgents(response.data.data);
        } catch (error) {
            message.error('Failed to fetch agents');
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleColor = (role) => ({
        admin: '#ef4444', supervisor: '#f59e0b', agent: '#6366f1'
    }[role] || '#6366f1');

    const getDepartmentColor = (dept) => ({
        technical: '#6366f1', billing: '#10b981', general: '#3b82f6', escalation: '#ef4444'
    }[dept] || '#94a3b8');

    if (isLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <Spin size="large" />
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ color: '#f1f5f9', marginBottom: 8 }}>Agents</Title>
                <Text style={{ color: '#94a3b8' }}>Manage support agents and their workload</Text>
            </div>

            <Row gutter={[24, 24]}>
                {agents.map((agent) => (
                    <Col xs={24} md={12} lg={8} key={agent._id}>
                        <Card className="stats-card"
                            style={{
                                background: 'rgba(30, 30, 46, 0.7)', backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(99, 102, 241, 0.15)', borderRadius: 16
                            }}
                            styles={{ body: { padding: 24 } }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                                <Avatar size={56} style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', fontSize: 24 }}>
                                    {agent.name?.charAt(0)}
                                </Avatar>
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ color: '#f1f5f9', fontSize: 16, display: 'block' }}>{agent.name}</Text>
                                    <Text style={{ color: '#64748b', fontSize: 13 }}>{agent.email}</Text>
                                </div>
                                <Tag style={{
                                    background: agent.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                                    color: agent.isActive ? '#10b981' : '#6b7280', border: 'none', borderRadius: 6
                                }}>
                                    {agent.isActive ? 'Active' : 'Inactive'}
                                </Tag>
                            </div>

                            <Space style={{ marginBottom: 16 }}>
                                <Tag style={{
                                    background: `${getRoleColor(agent.role)}20`, color: getRoleColor(agent.role),
                                    border: `1px solid ${getRoleColor(agent.role)}40`, borderRadius: 6, textTransform: 'capitalize'
                                }}>
                                    {agent.role}
                                </Tag>
                                <Tag style={{
                                    background: `${getDepartmentColor(agent.department)}20`, color: getDepartmentColor(agent.department),
                                    border: `1px solid ${getDepartmentColor(agent.department)}40`, borderRadius: 6, textTransform: 'capitalize'
                                }}>
                                    {agent.department}
                                </Tag>
                            </Space>

                            <Row gutter={12}>
                                <Col span={8}>
                                    <div style={{ background: 'rgba(15, 15, 35, 0.4)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                                        <Text style={{ color: '#f1f5f9', fontSize: 20, fontWeight: 700, display: 'block' }}>
                                            {agent.stats?.assignedTotal || 0}
                                        </Text>
                                        <Text style={{ color: '#64748b', fontSize: 11 }}>Total</Text>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                                        <Text style={{ color: '#3b82f6', fontSize: 20, fontWeight: 700, display: 'block' }}>
                                            {agent.stats?.assignedOpen || 0}
                                        </Text>
                                        <Text style={{ color: '#64748b', fontSize: 11 }}>Open</Text>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                                        <Text style={{ color: '#10b981', fontSize: 20, fontWeight: 700, display: 'block' }}>
                                            {agent.stats?.resolvedThisMonth || 0}
                                        </Text>
                                        <Text style={{ color: '#64748b', fontSize: 11 }}>Resolved</Text>
                                    </div>
                                </Col>
                            </Row>

                            {agent.lastLogin && (
                                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                    <Space size={4}>
                                        <ClockCircleOutlined style={{ color: '#64748b', fontSize: 12 }} />
                                        <Text style={{ color: '#64748b', fontSize: 12 }}>
                                            Last login: {new Date(agent.lastLogin).toLocaleDateString()}
                                        </Text>
                                    </Space>
                                </div>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AgentsPage;
