import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Form,
    Input,
    Select,
    Button,
    Card,
    Alert,
    Space,
    Tag,
    Divider,
    Row,
    Col,
    Steps,
    message
} from 'antd';
import {
    SendOutlined,
    ArrowLeftOutlined,
    RobotOutlined,
    CheckCircleOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { ticketsAPI } from '../api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const SubmitTicketPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedTicket, setSubmittedTicket] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    const categories = [
        { value: 'technical', label: '🔧 Technical Issue', description: 'Software bugs, errors, or performance issues' },
        { value: 'billing', label: '💳 Billing', description: 'Payment, invoices, or subscription queries' },
        { value: 'general', label: '💬 General Inquiry', description: 'Questions about our services' },
        { value: 'feature-request', label: '💡 Feature Request', description: 'Suggest new features or improvements' },
        { value: 'bug-report', label: '🐛 Bug Report', description: 'Report a specific bug with details' }
    ];

    const priorities = [
        { value: 'low', label: 'Low', color: '#10b981', description: 'Minor issue, no rush' },
        { value: 'medium', label: 'Medium', color: '#f59e0b', description: 'Standard priority' },
        { value: 'high', label: 'High', color: '#f97316', description: 'Urgent, needs attention' },
        { value: 'critical', label: 'Critical', color: '#ef4444', description: 'System down, blocking work' }
    ];

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const response = await ticketsAPI.create(values);
            setSubmittedTicket(response.data.data);
            setCurrentStep(2);
            message.success('Ticket submitted successfully!');
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to submit ticket');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPriorityTag = (priority) => {
        const colors = {
            low: '#10b981',
            medium: '#f59e0b',
            high: '#f97316',
            critical: '#ef4444'
        };
        return (
            <Tag
                style={{
                    background: `${colors[priority]}20`,
                    color: colors[priority],
                    border: `1px solid ${colors[priority]}40`,
                    borderRadius: 6,
                    textTransform: 'capitalize',
                    fontWeight: 600
                }}
            >
                {priority}
            </Tag>
        );
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1e1e2e 50%, #2a2a3e 100%)',
            padding: '40px 24px'
        }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
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
                        Submit a Support Ticket
                    </Title>
                    <Text style={{ color: '#94a3b8', fontSize: 16 }}>
                        Describe your issue and our AI will automatically route it to the right team.
                    </Text>
                </div>

                {/* Progress Steps */}
                <Steps
                    current={currentStep}
                    style={{ marginBottom: 40 }}
                    items={[
                        { title: 'Your Details', icon: currentStep > 0 ? <CheckCircleOutlined /> : null },
                        { title: 'Issue Details', icon: currentStep > 1 ? <CheckCircleOutlined /> : null },
                        { title: 'Submitted', icon: currentStep === 2 ? <CheckCircleOutlined /> : null }
                    ]}
                />

                {!submittedTicket ? (
                    <Card
                        style={{
                            background: 'rgba(30, 30, 46, 0.7)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                            borderRadius: 16
                        }}
                        styles={{ body: { padding: 32 } }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 16px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: 10,
                            marginBottom: 24,
                            border: '1px solid rgba(99, 102, 241, 0.2)'
                        }}>
                            <RobotOutlined style={{ fontSize: 20, color: '#6366f1' }} />
                            <Text style={{ color: '#a5b4fc' }}>
                                Our AI will analyze your ticket and suggest the best category and priority.
                            </Text>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            onValuesChange={(_, values) => {
                                if (values.customerName && values.customerEmail && currentStep === 0) {
                                    setCurrentStep(1);
                                }
                            }}
                            requiredMark={false}
                        >
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label={<Text style={{ color: '#94a3b8', fontWeight: 500 }}>Your Name</Text>}
                                        name="customerName"
                                        rules={[{ required: true, message: 'Please enter your name' }]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="John Doe"
                                            style={{
                                                background: 'rgba(30, 30, 46, 0.6)',
                                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                                borderRadius: 10,
                                                color: '#f1f5f9'
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label={<Text style={{ color: '#94a3b8', fontWeight: 500 }}>Email Address</Text>}
                                        name="customerEmail"
                                        rules={[
                                            { required: true, message: 'Please enter your email' },
                                            { type: 'email', message: 'Please enter a valid email' }
                                        ]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="john@example.com"
                                            style={{
                                                background: 'rgba(30, 30, 46, 0.6)',
                                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                                borderRadius: 10,
                                                color: '#f1f5f9'
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label={<Text style={{ color: '#94a3b8', fontWeight: 500 }}>Ticket Title</Text>}
                                name="title"
                                rules={[{ required: true, message: 'Please enter a title' }]}
                            >
                                <Input
                                    size="large"
                                    placeholder="Brief description of your issue"
                                    maxLength={200}
                                    showCount
                                    style={{
                                        background: 'rgba(30, 30, 46, 0.6)',
                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                        borderRadius: 10,
                                        color: '#f1f5f9'
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label={<Text style={{ color: '#94a3b8', fontWeight: 500 }}>Description</Text>}
                                name="description"
                                rules={[{ required: true, message: 'Please describe your issue' }]}
                            >
                                <TextArea
                                    rows={5}
                                    placeholder="Provide as much detail as possible about your issue..."
                                    style={{
                                        background: 'rgba(30, 30, 46, 0.6)',
                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                        borderRadius: 10,
                                        color: '#f1f5f9',
                                        resize: 'none'
                                    }}
                                />
                            </Form.Item>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label={<Text style={{ color: '#94a3b8', fontWeight: 500 }}>Category (Optional)</Text>}
                                        name="category"
                                        extra={<Text style={{ color: '#64748b', fontSize: 12 }}>Leave empty for AI suggestion</Text>}
                                    >
                                        <Select
                                            size="large"
                                            placeholder="Select category"
                                            allowClear
                                            options={categories.map(c => ({ value: c.value, label: c.label }))}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label={<Text style={{ color: '#94a3b8', fontWeight: 500 }}>Priority (Optional)</Text>}
                                        name="priority"
                                        extra={<Text style={{ color: '#64748b', fontSize: 12 }}>Leave empty for AI suggestion</Text>}
                                    >
                                        <Select
                                            size="large"
                                            placeholder="Select priority"
                                            allowClear
                                            options={priorities.map(p => ({
                                                value: p.value,
                                                label: (
                                                    <Space>
                                                        <span style={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            background: p.color,
                                                            display: 'inline-block'
                                                        }} />
                                                        {p.label}
                                                    </Space>
                                                )
                                            }))}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider style={{ borderColor: 'rgba(99, 102, 241, 0.1)' }} />

                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={isSubmitting}
                                    icon={isSubmitting ? <LoadingOutlined /> : <SendOutlined />}
                                    style={{
                                        width: '100%',
                                        height: 52,
                                        borderRadius: 10,
                                        fontWeight: 600,
                                        fontSize: 16,
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        border: 'none'
                                    }}
                                >
                                    {isSubmitting ? 'Analyzing & Submitting...' : 'Submit Ticket'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                ) : (
                    <Card
                        style={{
                            background: 'rgba(30, 30, 46, 0.7)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: 16
                        }}
                        styles={{ body: { padding: 40 } }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: 32 }}>
                            <div style={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'rgba(16, 185, 129, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px'
                            }}>
                                <CheckCircleOutlined style={{ fontSize: 40, color: '#10b981' }} />
                            </div>
                            <Title level={3} style={{ color: '#f1f5f9', marginBottom: 8 }}>
                                Ticket Submitted Successfully!
                            </Title>
                            <Text style={{ color: '#94a3b8' }}>
                                Your ticket has been created and routed to the appropriate team.
                            </Text>
                        </div>

                        <Card
                            style={{
                                background: 'rgba(15, 15, 35, 0.5)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                borderRadius: 12,
                                marginBottom: 24
                            }}
                            styles={{ body: { padding: 24 } }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Text style={{ color: '#64748b', fontSize: 12, display: 'block', marginBottom: 4 }}>
                                        TICKET ID
                                    </Text>
                                    <Text style={{ color: '#f1f5f9', fontSize: 14, fontFamily: 'monospace' }}>
                                        {submittedTicket._id}
                                    </Text>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Text style={{ color: '#64748b', fontSize: 12, display: 'block', marginBottom: 4 }}>
                                        CATEGORY
                                    </Text>
                                    <Text style={{ color: '#f1f5f9', textTransform: 'capitalize' }}>
                                        {submittedTicket.category?.replace('-', ' ')}
                                    </Text>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Text style={{ color: '#64748b', fontSize: 12, display: 'block', marginBottom: 4 }}>
                                        PRIORITY
                                    </Text>
                                    {getPriorityTag(submittedTicket.priority)}
                                </Col>
                                <Col span={24}>
                                    <Text style={{ color: '#64748b', fontSize: 12, display: 'block', marginBottom: 4 }}>
                                        ASSIGNED QUEUE
                                    </Text>
                                    <Tag style={{
                                        background: 'rgba(99, 102, 241, 0.2)',
                                        color: '#a5b4fc',
                                        border: '1px solid rgba(99, 102, 241, 0.4)',
                                        borderRadius: 6,
                                        textTransform: 'capitalize'
                                    }}>
                                        {submittedTicket.queue?.replace('-', ' ')}
                                    </Tag>
                                </Col>
                            </Row>

                            {submittedTicket.aiClassification?.reasoning && (
                                <Alert
                                    type="info"
                                    showIcon
                                    icon={<RobotOutlined />}
                                    message="AI Classification"
                                    description={submittedTicket.aiClassification.reasoning}
                                    style={{
                                        marginTop: 16,
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                        borderRadius: 8
                                    }}
                                />
                            )}
                        </Card>

                        <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                            <Button
                                size="large"
                                onClick={() => navigate('/track')}
                                style={{
                                    borderRadius: 10,
                                    background: 'rgba(30, 30, 46, 0.8)',
                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                    color: '#f1f5f9'
                                }}
                            >
                                Track Your Tickets
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => {
                                    setSubmittedTicket(null);
                                    setCurrentStep(0);
                                    form.resetFields();
                                }}
                                style={{
                                    borderRadius: 10,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    border: 'none'
                                }}
                            >
                                Submit Another Ticket
                            </Button>
                        </Space>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default SubmitTicketPage;
