import { useState, useEffect } from 'react';
import {
    Typography,
    Table,
    Card,
    Tag,
    Space,
    Button,
    Select,
    Input,
    Drawer,
    Descriptions,
    Divider,
    Form,
    message,
    Spin,
    Row,
    Col,
    Badge,
    Timeline,
    Avatar
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ReloadOutlined,
    EyeOutlined,
    RobotOutlined,
    EditOutlined,
    MessageOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { ticketsAPI, adminAPI } from '../../api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const TicketsPage = () => {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [agents, setAgents] = useState([]);
    const [filters, setFilters] = useState({
        status: undefined,
        priority: undefined,
        queue: undefined
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0
    });

    useEffect(() => {
        fetchTickets();
        fetchAgents();
    }, [filters, pagination.current]);

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const response = await ticketsAPI.getAll({
                ...filters,
                page: pagination.current,
                limit: pagination.pageSize
            });
            setTickets(response.data.data);
            setPagination(prev => ({
                ...prev,
                total: response.data.pagination.total
            }));
        } catch (error) {
            message.error('Failed to fetch tickets');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAgents = async () => {
        try {
            const response = await adminAPI.getAgents();
            setAgents(response.data.data);
        } catch (error) {
            console.error('Failed to fetch agents:', error);
        }
    };

    const handleUpdateTicket = async (id, data) => {
        try {
            await ticketsAPI.update(id, data);
            message.success('Ticket updated successfully');
            fetchTickets();
            if (selectedTicket?._id === id) {
                setSelectedTicket(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            message.error('Failed to update ticket');
        }
    };

    const getPriorityConfig = (priority) => {
        const configs = {
            critical: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
            high: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' },
            medium: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
            low: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' }
        };
        return configs[priority] || configs.medium;
    };

    const getStatusConfig = (status) => {
        const configs = {
            open: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
            'in-progress': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
            pending: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
            resolved: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
            closed: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.15)' }
        };
        return configs[status] || configs.open;
    };

    const columns = [
        {
            title: 'Ticket',
            key: 'ticket',
            width: 300,
            render: (_, record) => (
                <div>
                    <Text strong style={{ color: '#f1f5f9', display: 'block', marginBottom: 4 }}>
                        {record.title}
                    </Text>
                    <Space size={4}>
                        <Text style={{ color: '#64748b', fontSize: 12 }}>
                            {record._id.substring(0, 8)}
                        </Text>
                        <Text style={{ color: '#4b5563' }}>•</Text>
                        <Text style={{ color: '#64748b', fontSize: 12 }}>
                            {record.customerName}
                        </Text>
                    </Space>
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
            render: (priority) => {
                const config = getPriorityConfig(priority);
                return (
                    <Tag style={{
                        background: config.bg,
                        color: config.color,
                        border: `1px solid ${config.color}40`,
                        borderRadius: 6,
                        textTransform: 'capitalize',
                        fontWeight: 600
                    }}>
                        {priority}
                    </Tag>
                );
            }
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
                        textTransform: 'capitalize'
                    }}>
                        {status?.replace('-', ' ')}
                    </Tag>
                );
            }
        },
        {
            title: 'Queue',
            dataIndex: 'queue',
            key: 'queue',
            render: (queue) => (
                <Text style={{ color: '#94a3b8', textTransform: 'capitalize', fontSize: 13 }}>
                    {queue?.replace('-', ' ')}
                </Text>
            )
        },
        {
            title: 'Assigned',
            dataIndex: 'assignedTo',
            key: 'assignedTo',
            render: (assignedTo) => (
                assignedTo ? (
                    <Space>
                        <Avatar size="small" style={{ background: '#6366f1' }}>
                            {assignedTo.name?.charAt(0)}
                        </Avatar>
                        <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                            {assignedTo.name}
                        </Text>
                    </Space>
                ) : (
                    <Text style={{ color: '#4b5563', fontSize: 13 }}>Unassigned</Text>
                )
            )
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <Space size={4}>
                    <ClockCircleOutlined style={{ color: '#64748b', fontSize: 12 }} />
                    <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                        {new Date(date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </Text>
                </Space>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<EyeOutlined style={{ color: '#6366f1' }} />}
                    onClick={() => {
                        setSelectedTicket(record);
                        setDrawerOpen(true);
                    }}
                />
            )
        }
    ];

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ color: '#f1f5f9', marginBottom: 8 }}>
                    Tickets
                </Title>
                <Text style={{ color: '#94a3b8' }}>
                    Manage and respond to support tickets
                </Text>
            </div>

            {/* Filters Card */}
            <Card
                style={{
                    background: 'rgba(30, 30, 46, 0.7)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                    borderRadius: 16,
                    marginBottom: 24
                }}
                styles={{ body: { padding: 20 } }}
            >
                <Row gutter={16} align="middle">
                    <Col flex="auto">
                        <Space wrap>
                            <Select
                                placeholder="Status"
                                allowClear
                                style={{ width: 140 }}
                                value={filters.status}
                                onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                                options={[
                                    { value: 'open', label: 'Open' },
                                    { value: 'in-progress', label: 'In Progress' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'resolved', label: 'Resolved' },
                                    { value: 'closed', label: 'Closed' }
                                ]}
                            />
                            <Select
                                placeholder="Priority"
                                allowClear
                                style={{ width: 140 }}
                                value={filters.priority}
                                onChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
                                options={[
                                    { value: 'critical', label: 'Critical' },
                                    { value: 'high', label: 'High' },
                                    { value: 'medium', label: 'Medium' },
                                    { value: 'low', label: 'Low' }
                                ]}
                            />
                            <Select
                                placeholder="Queue"
                                allowClear
                                style={{ width: 160 }}
                                value={filters.queue}
                                onChange={(value) => setFilters(prev => ({ ...prev, queue: value }))}
                                options={[
                                    { value: 'technical-support', label: 'Technical Support' },
                                    { value: 'billing-support', label: 'Billing Support' },
                                    { value: 'general-support', label: 'General Support' },
                                    { value: 'escalation', label: 'Escalation' },
                                    { value: 'unassigned', label: 'Unassigned' }
                                ]}
                            />
                        </Space>
                    </Col>
                    <Col>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={fetchTickets}
                            style={{
                                background: 'rgba(99, 102, 241, 0.15)',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                color: '#a5b4fc'
                            }}
                        >
                            Refresh
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Tickets Table */}
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
                <Table
                    columns={columns}
                    dataSource={tickets}
                    rowKey="_id"
                    loading={isLoading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} tickets`,
                        onChange: (page, pageSize) => {
                            setPagination(prev => ({ ...prev, current: page, pageSize }));
                        }
                    }}
                    style={{ background: 'transparent' }}
                />
            </Card>

            {/* Ticket Detail Drawer */}
            <Drawer
                title={
                    <div>
                        <Text style={{ color: '#f1f5f9', display: 'block', marginBottom: 4 }}>
                            Ticket Details
                        </Text>
                        <Text style={{ color: '#64748b', fontSize: 12 }}>
                            {selectedTicket?._id}
                        </Text>
                    </div>
                }
                width={600}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                styles={{
                    header: {
                        background: 'rgba(30, 30, 46, 0.95)',
                        borderBottom: '1px solid rgba(99, 102, 241, 0.15)'
                    },
                    body: {
                        background: 'rgba(30, 30, 46, 0.95)',
                        padding: 24
                    }
                }}
            >
                {selectedTicket && (
                    <>
                        <Card
                            style={{
                                background: 'rgba(15, 15, 35, 0.5)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                borderRadius: 12,
                                marginBottom: 24
                            }}
                            styles={{ body: { padding: 20 } }}
                        >
                            <Title level={4} style={{ color: '#f1f5f9', marginBottom: 12 }}>
                                {selectedTicket.title}
                            </Title>
                            <Paragraph style={{ color: '#94a3b8', marginBottom: 0 }}>
                                {selectedTicket.description}
                            </Paragraph>
                        </Card>

                        <Descriptions
                            column={2}
                            size="small"
                            style={{ marginBottom: 24 }}
                            labelStyle={{ color: '#64748b' }}
                            contentStyle={{ color: '#f1f5f9' }}
                        >
                            <Descriptions.Item label="Customer">
                                {selectedTicket.customerName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {selectedTicket.customerEmail}
                            </Descriptions.Item>
                            <Descriptions.Item label="Created">
                                {new Date(selectedTicket.createdAt).toLocaleString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Updated">
                                {new Date(selectedTicket.updatedAt).toLocaleString()}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider style={{ borderColor: 'rgba(99, 102, 241, 0.1)' }} />

                        {/* Quick Actions */}
                        <Title level={5} style={{ color: '#f1f5f9', marginBottom: 16 }}>
                            <EditOutlined style={{ marginRight: 8 }} />
                            Quick Actions
                        </Title>

                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            <Col span={12}>
                                <Text style={{ color: '#64748b', display: 'block', marginBottom: 8 }}>Status</Text>
                                <Select
                                    value={selectedTicket.status}
                                    style={{ width: '100%' }}
                                    onChange={(value) => handleUpdateTicket(selectedTicket._id, { status: value })}
                                    options={[
                                        { value: 'open', label: 'Open' },
                                        { value: 'in-progress', label: 'In Progress' },
                                        { value: 'pending', label: 'Pending' },
                                        { value: 'resolved', label: 'Resolved' },
                                        { value: 'closed', label: 'Closed' }
                                    ]}
                                />
                            </Col>
                            <Col span={12}>
                                <Text style={{ color: '#64748b', display: 'block', marginBottom: 8 }}>Priority</Text>
                                <Select
                                    value={selectedTicket.priority}
                                    style={{ width: '100%' }}
                                    onChange={(value) => handleUpdateTicket(selectedTicket._id, { priority: value })}
                                    options={[
                                        { value: 'critical', label: 'Critical' },
                                        { value: 'high', label: 'High' },
                                        { value: 'medium', label: 'Medium' },
                                        { value: 'low', label: 'Low' }
                                    ]}
                                />
                            </Col>
                            <Col span={12}>
                                <Text style={{ color: '#64748b', display: 'block', marginBottom: 8 }}>Queue</Text>
                                <Select
                                    value={selectedTicket.queue}
                                    style={{ width: '100%' }}
                                    onChange={(value) => handleUpdateTicket(selectedTicket._id, { queue: value })}
                                    options={[
                                        { value: 'technical-support', label: 'Technical Support' },
                                        { value: 'billing-support', label: 'Billing Support' },
                                        { value: 'general-support', label: 'General Support' },
                                        { value: 'escalation', label: 'Escalation' }
                                    ]}
                                />
                            </Col>
                            <Col span={12}>
                                <Text style={{ color: '#64748b', display: 'block', marginBottom: 8 }}>Assign To</Text>
                                <Select
                                    value={selectedTicket.assignedTo?._id}
                                    placeholder="Select agent"
                                    allowClear
                                    style={{ width: '100%' }}
                                    onChange={(value) => handleUpdateTicket(selectedTicket._id, { assignedTo: value })}
                                    options={agents.map(agent => ({
                                        value: agent._id,
                                        label: agent.name
                                    }))}
                                />
                            </Col>
                        </Row>

                        {/* AI Classification */}
                        {selectedTicket.aiClassification && (
                            <>
                                <Divider style={{ borderColor: 'rgba(99, 102, 241, 0.1)' }} />
                                <Card
                                    style={{
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                        borderRadius: 12
                                    }}
                                    styles={{ body: { padding: 16 } }}
                                >
                                    <Space align="start" style={{ marginBottom: 12 }}>
                                        <RobotOutlined style={{ fontSize: 20, color: '#6366f1' }} />
                                        <div>
                                            <Text strong style={{ color: '#a5b4fc', display: 'block' }}>
                                                AI Classification
                                            </Text>
                                            <Text style={{ color: '#64748b', fontSize: 12 }}>
                                                Confidence: {Math.round((selectedTicket.aiClassification.confidence || 0) * 100)}%
                                            </Text>
                                        </div>
                                    </Space>
                                    <Paragraph style={{ color: '#94a3b8', marginBottom: 0, fontSize: 13 }}>
                                        {selectedTicket.aiClassification.reasoning}
                                    </Paragraph>
                                </Card>
                            </>
                        )}
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default TicketsPage;
