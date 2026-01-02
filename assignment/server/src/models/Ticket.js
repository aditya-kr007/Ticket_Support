const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Ticket title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Ticket description is required'],
        trim: true
    },
    customerEmail: {
        type: String,
        required: [true, 'Customer email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['technical', 'billing', 'general', 'feature-request', 'bug-report'],
        required: true
    },
    aiClassification: {
        suggestedPriority: String,
        suggestedCategory: String,
        suggestedQueue: String,
        confidence: Number,
        reasoning: String,
        classifiedAt: Date
    },
    queue: {
        type: String,
        enum: ['technical-support', 'billing-support', 'general-support', 'escalation', 'unassigned'],
        default: 'unassigned'
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'pending', 'resolved', 'closed'],
        default: 'open'
    },
    assignedTo: {
        type: String,
        default: null
    },
    comments: [{
        author: String,
        content: String,
        isInternal: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    resolvedAt: Date,
    closedAt: Date
}, {
    timestamps: true
});

ticketSchema.index({ status: 1, priority: 1 });
ticketSchema.index({ queue: 1, status: 1 });
ticketSchema.index({ customerEmail: 1 });
ticketSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);
