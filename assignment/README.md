# SupportDesk AI - Intelligent Support Ticket Management

An AI-powered support ticket management system that automatically classifies, prioritizes, and routes tickets to the right support queues.

## Features

### Customer-Facing
- **Submit Support Tickets** - Easy-to-use form for customers to submit issues
- **AI-Powered Classification** - Automatic categorization and priority assignment using OpenAI
- **Track Tickets** - Customers can check status by email

### Admin Dashboard
- **Real-time Metrics** - Overview of ticket volume, resolution times, and AI accuracy
- **Queue Management** - Monitor and manage support queues
- **Ticket Management** - View, filter, assign, and update tickets
- **Agent Management** - Track agent workload and performance

## Tech Stack

- **Frontend**: React.js, Ant Design, Recharts, Zustand
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI**: OpenAI GPT-4o-mini for ticket classification

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin dashboard pages
│   │   │   └── ...        # Public pages
│   │   └── store/         # Zustand state management
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── config/        # Database & app config
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── services/      # OpenAI service
│   │   └── index.js       # App entry point
│   └── package.json
│
└── package.json            # Root package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- OpenAI API Key

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure environment variables:**
   
   Create `server/.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/support-tickets
   OPENAI_API_KEY=your_openai_api_key_here
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

3. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

4. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This starts both:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

### Admin Login

Use the following static credentials to login:

- **Email**: `admin@support.com`
- **Password**: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tickets
- `POST /api/tickets` - Create ticket (public)
- `GET /api/tickets` - Get all tickets (protected)
- `GET /api/tickets/:id` - Get single ticket
- `PUT /api/tickets/:id` - Update ticket
- `POST /api/tickets/:id/comments` - Add comment
- `POST /api/tickets/:id/reclassify` - Re-run AI classification
- `GET /api/tickets/customer/:email` - Get tickets by email (public)

### Admin
- `GET /api/admin/metrics` - Dashboard metrics
- `GET /api/admin/queues` - Queue overview
- `GET /api/admin/agents` - Agent list with stats
- `POST /api/admin/assign` - Bulk assign tickets
- `POST /api/admin/transfer` - Transfer tickets to queue

## AI Classification

The system uses OpenAI to automatically classify tickets:

- **Priority**: low, medium, high, critical
- **Category**: technical, billing, general, feature-request, bug-report
- **Queue**: technical-support, billing-support, general-support, escalation

The AI analyzes the ticket title and description to provide intelligent routing.

## Screenshots

The application features a modern dark theme with:
- Glassmorphic UI elements
- Gradient accents
- Smooth animations
- Responsive design

## License

MIT
