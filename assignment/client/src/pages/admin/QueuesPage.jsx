import { useState, useEffect } from 'react';
import {
    Typography, Row, Col, Card, Tag, Space, Button, Table,
    Avatar, Spin, Modal, Select, message
} from 'antd';
import {
    InboxOutlined, ExclamationCircleOutlined, TeamOutlined
} from '@ant-design/icons';
import { adminAPI } from '../../api';

const { Title, Text } = Typography;

const QueuesPage = () => {
    const [queues, setQueues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedQueue, setSelectedQueue] = useState(null);

    useEffect(() => { fetchQueues(); }, []);

    const fetchQueues = async () => {
        setIsLoading(true);
        try {
            const response = await adminAPI.getQueues();
            setQueues(response.data.data);
        } catch (error) {
            message.error('Failed to fetch queues');
        } finally {
            setIsLoading(false);
        }
    };

    const getQueueColor = (name) => ({
        'technical-support': '#6366f1', 'billing-support': '#10b981',
        'general-support': '#3b82f6', 'escalation': '#ef4444', 'unassigned': '#94a3b8'
    }[name] || '#6366f1');

    const getQueueIcon = (name) => ({
        'technical-support': '🔧', 'billing-support': '💳',
        'general-support': '💬', 'escalation': '🚨', 'unassigned': '📥'
    }[name] || '📋');

    if (isLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <Spin size="large" />
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ color: '#f1f5f9', marginBottom: 8 }}>Queue Management</Title>
                <Text style={{ color: '#94a3b8' }}>Monitor and manage support ticket queues</Text>
            </div>

            <Row gutter={[24, 24]}>
                {queues.map((queue) => (
                    <Col xs={24} md={12} xl={8} key={queue.name}>
                        <Card className="stats-card" onClick={() => setSelectedQueue(queue)}
                            style={{
                                background: 'rgba(30, 30, 46, 0.7)', backdropFilter: 'blur(12px)',
                                border: `1px solid ${getQueueColor(queue.name)}30`, borderRadius: 16,
                                cursor: 'pointer', transition: 'all 0.3s ease'
                            }}
                            styles={{ body: { padding: 24 } }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                <div style={{
                                    width: 56, height: 56, borderRadius: 14,
                                    background: `${getQueueColor(queue.name)}20`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
                                }}>{getQueueIcon(queue.name)}</div>
                                {queue.critical > 0 && (
                                    <Tag style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 6 }}>
                                        <ExclamationCircleOutlined /> {queue.critical} Critical
                                    </Tag>
                                )}
                            </div>
                            <Title level={4} style={{ color: '#f1f5f9', marginBottom: 16 }}>{queue.displayName}</Title>
                            <Row gutter={16}>
                                {[{ val: queue.total, label: 'Total', color: '#f1f5f9' },
                                { val: queue.open, label: 'Open', color: '#3b82f6' },
                                { val: queue.inProgress, label: 'Active', color: '#f59e0b' }].map((s, i) => (
                                    <Col span={8} key={i}>
                                        <div style={{ padding: 12, background: 'rgba(15, 15, 35, 0.4)', borderRadius: 10, textAlign: 'center' }}>
                                            <Text style={{ color: s.color, fontSize: 24, fontWeight: 700, display: 'block' }}>{s.val}</Text>
                                            <Text style={{ color: '#64748b', fontSize: 11 }}>{s.label}</Text>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                            {queue.agents?.length > 0 && (
                                <div style={{ marginTop: 16 }}>
                                    <Text style={{ color: '#64748b', fontSize: 12 }}><TeamOutlined /> {queue.agents.length} Agents</Text>
                                </div>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal title={selectedQueue?.displayName} open={!!selectedQueue} onCancel={() => setSelectedQueue(null)} footer={null} width={500}
                styles={{ header: { background: 'rgba(30, 30, 46, 0.95)' }, body: { background: 'rgba(30, 30, 46, 0.95)', padding: 24 }, content: { background: 'rgba(30, 30, 46, 0.95)' } }}>
                {selectedQueue && (
                    <Row gutter={16}>
                        {[{ val: selectedQueue.total, label: 'Total' }, { val: selectedQueue.open, label: 'Open' },
                        { val: selectedQueue.inProgress, label: 'Active' }, { val: selectedQueue.critical, label: 'Critical' }].map((s, i) => (
                            <Col span={6} key={i}>
                                <Card size="small" style={{ background: 'rgba(15, 15, 35, 0.5)', textAlign: 'center' }}>
                                    <Text style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, display: 'block' }}>{s.val}</Text>
                                    <Text style={{ color: '#64748b', fontSize: 12 }}>{s.label}</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Modal>
        </div>
    );
};

export default QueuesPage;
