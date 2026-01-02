const express = require('express');
const Ticket = require('../models/Ticket');
const { protect, authorize, ADMIN_USER } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin/supervisor role
router.use(protect);
router.use(authorize('admin', 'supervisor'));

router.get('/metrics', async (req, res) => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const statusCounts = await Ticket.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const priorityCounts = await Ticket.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        const queueCounts = await Ticket.aggregate([
            { $group: { _id: '$queue', count: { $sum: 1 } } }
        ]);

        const categoryCounts = await Ticket.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        const todayTickets = await Ticket.countDocuments({
            createdAt: { $gte: startOfDay }
        });

        const weekTickets = await Ticket.countDocuments({
            createdAt: { $gte: startOfWeek }
        });

        const monthTickets = await Ticket.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        const totalTickets = await Ticket.countDocuments();
        const openTickets = await Ticket.countDocuments({ status: 'open' });
        const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });

        const resolutionTimeData = await Ticket.aggregate([
            { $match: { status: { $in: ['resolved', 'closed'] }, resolvedAt: { $exists: true } } },
            { $project: { resolutionTime: { $subtract: ['$resolvedAt', '$createdAt'] } } },
            { $group: { _id: null, avgResolutionTime: { $avg: '$resolutionTime' } } }
        ]);

        const avgResolutionTime = resolutionTimeData[0]?.avgResolutionTime || 0;
        const avgResolutionHours = Math.round(avgResolutionTime / (1000 * 60 * 60) * 10) / 10;

        const classifiedTickets = await Ticket.countDocuments({
            'aiClassification.suggestedCategory': { $exists: true }
        });

        const accurateClassifications = await Ticket.countDocuments({
            $expr: { $eq: ['$category', '$aiClassification.suggestedCategory'] }
        });

        const aiAccuracy = classifiedTickets > 0
            ? Math.round((accurateClassifications / classifiedTickets) * 100) : 0;

        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const hourlyData = await Ticket.aggregate([
            { $match: { createdAt: { $gte: last24Hours } } },
            { $group: { _id: { $hour: '$createdAt' }, count: { $sum: 1 } } },
            { $sort: { '_id': 1 } }
        ]);

        res.json({
            success: true,
            data: {
                overview: { total: totalTickets, open: openTickets, resolved: resolvedTickets, todayTickets, weekTickets, monthTickets },
                byStatus: statusCounts.reduce((acc, item) => { acc[item._id] = item.count; return acc; }, {}),
                byPriority: priorityCounts.reduce((acc, item) => { acc[item._id] = item.count; return acc; }, {}),
                byQueue: queueCounts.reduce((acc, item) => { acc[item._id] = item.count; return acc; }, {}),
                byCategory: categoryCounts.reduce((acc, item) => { acc[item._id] = item.count; return acc; }, {}),
                performance: { avgResolutionHours, aiAccuracy },
                hourlyTrend: hourlyData
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/queues', async (req, res) => {
    try {
        const queues = ['technical-support', 'billing-support', 'general-support', 'escalation', 'unassigned'];

        const queueData = await Promise.all(
            queues.map(async (queue) => {
                const total = await Ticket.countDocuments({ queue });
                const open = await Ticket.countDocuments({ queue, status: 'open' });
                const inProgress = await Ticket.countDocuments({ queue, status: 'in-progress' });
                const critical = await Ticket.countDocuments({ queue, priority: 'critical', status: { $ne: 'closed' } });
                const high = await Ticket.countDocuments({ queue, priority: 'high', status: { $ne: 'closed' } });

                return {
                    name: queue,
                    displayName: queue.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                    total, open, inProgress, critical, high,
                    agents: [ADMIN_USER] // Static admin as the only agent
                };
            })
        );

        res.json({ success: true, data: queueData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/agents', async (req, res) => {
    try {
        // Return static admin user with stats
        const assignedTotal = await Ticket.countDocuments({ assignedTo: ADMIN_USER.id });
        const assignedOpen = await Ticket.countDocuments({ assignedTo: ADMIN_USER.id, status: { $in: ['open', 'in-progress'] } });
        const resolvedThisMonth = await Ticket.countDocuments({
            assignedTo: ADMIN_USER.id,
            status: 'resolved',
            resolvedAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        });

        res.json({
            success: true,
            data: [{
                _id: ADMIN_USER.id,
                name: ADMIN_USER.name,
                email: ADMIN_USER.email,
                role: ADMIN_USER.role,
                department: ADMIN_USER.department,
                isActive: true,
                lastLogin: new Date(),
                stats: { assignedTotal, assignedOpen, resolvedThisMonth }
            }]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/assign', async (req, res) => {
    try {
        const { ticketIds } = req.body;
        await Ticket.updateMany(
            { _id: { $in: ticketIds } },
            { assignedTo: ADMIN_USER.id, status: 'in-progress' }
        );
        res.json({ success: true, message: `${ticketIds.length} tickets assigned successfully` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/transfer', async (req, res) => {
    try {
        const { ticketIds, queue } = req.body;
        await Ticket.updateMany(
            { _id: { $in: ticketIds } },
            { queue, assignedTo: null }
        );
        res.json({ success: true, message: `${ticketIds.length} tickets transferred to ${queue}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
