const express = require('express');
const Ticket = require('../models/Ticket');
const OpenAIService = require('../services/openaiService');
const { protect, ADMIN_USER } = require('../middleware/auth');

const router = express.Router();
const openaiService = new OpenAIService(process.env.OPENAI_API_KEY);

router.post('/', async (req, res) => {
    try {
        const { title, description, customerEmail, customerName, category, priority } = req.body;

        const classificationResult = await openaiService.classifyTicket(title, description);
        const aiClassification = classificationResult.data;

        const ticket = await Ticket.create({
            title, description, customerEmail, customerName,
            category: category || aiClassification.suggestedCategory,
            priority: priority || aiClassification.suggestedPriority,
            queue: aiClassification.suggestedQueue,
            aiClassification,
            status: 'open'
        });

        res.status(201).json({ success: true, data: ticket, message: 'Ticket created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/', protect, async (req, res) => {
    try {
        const { status, priority, category, queue, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (category) query.category = category;
        if (queue) query.queue = queue;

        const tickets = await Ticket.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Ticket.countDocuments(query);

        // Map assignedTo to admin user object
        const ticketsWithAgent = tickets.map(t => {
            const ticket = t.toObject();
            if (ticket.assignedTo === ADMIN_USER.id) {
                ticket.assignedTo = { _id: ADMIN_USER.id, name: ADMIN_USER.name, email: ADMIN_USER.email };
            }
            return ticket;
        });

        res.json({
            success: true,
            data: ticketsWithAgent,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/customer/:email', async (req, res) => {
    try {
        const tickets = await Ticket.find({ customerEmail: req.params.email })
            .select('title status priority category createdAt updatedAt')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', protect, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        const ticketObj = ticket.toObject();
        if (ticketObj.assignedTo === ADMIN_USER.id) {
            ticketObj.assignedTo = { _id: ADMIN_USER.id, name: ADMIN_USER.name, email: ADMIN_USER.email };
        }

        res.json({ success: true, data: ticketObj });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const { status, priority, category, queue, assignedTo } = req.body;

        const updateData = {};
        if (status) {
            updateData.status = status;
            if (status === 'resolved') updateData.resolvedAt = new Date();
            if (status === 'closed') updateData.closedAt = new Date();
        }
        if (priority) updateData.priority = priority;
        if (category) updateData.category = category;
        if (queue) updateData.queue = queue;
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

        const ticket = await Ticket.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        const ticketObj = ticket.toObject();
        if (ticketObj.assignedTo === ADMIN_USER.id) {
            ticketObj.assignedTo = { _id: ADMIN_USER.id, name: ADMIN_USER.name, email: ADMIN_USER.email };
        }

        res.json({ success: true, data: ticketObj });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/:id/comments', protect, async (req, res) => {
    try {
        const { content, isInternal } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        ticket.comments.push({
            author: ADMIN_USER.name,
            content,
            isInternal: isInternal || false
        });

        await ticket.save();
        res.json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/:id/reclassify', protect, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        const classificationResult = await openaiService.classifyTicket(ticket.title, ticket.description);
        ticket.aiClassification = classificationResult.data;
        await ticket.save();

        res.json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
