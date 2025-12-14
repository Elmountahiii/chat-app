# Chat Application

A full-stack real-time chat application built with Next.js, Express, Socket.IO, and MongoDB. Features include real-time messaging, typing indicators, friend requests, and user presence tracking.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using Socket.IO
- **User Authentication**: Secure JWT-based authentication
- **Friend System**: Send, accept, and decline friend requests
- **Typing Indicators**: See when others are typing
- **Read Receipts**: Track message read status
- **User Presence**: Online/offline status tracking
- **Responsive UI**: Modern, mobile-friendly interface built with Radix UI and Tailwind CSS
- **Emoji Support**: Integrated emoji picker for messages
- **Conversation Management**: Create and manage private conversations

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Local Development](#local-development)
  - [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Socket Events](#socket-events)
- [Contributing](#contributing)

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Socket.IO Client** - Real-time communication
- **Zustand** - State management
- **React Hook Form + Zod** - Form handling and validation
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI components
- **Framer Motion** - Animations
- **date-fns** - Date manipulation

### Backend
- **Express 5** - Web framework
- **Socket.IO** - WebSocket implementation
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Winston** - Logging
- **TypeScript** - Type safety
- **Zod** - Runtime validation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancing
- **Certbot** - SSL/TLS certificates

## 📁 Project Structure

```
chat_app/
├── backend/              # Express + Socket.IO server
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── middlewares/ # Express middlewares
│   │   ├── repository/  # Data access layer
│   │   ├── routes/      # API routes
│   │   ├── schema/      # Mongoose schemas
│   │   ├── services/    # Business logic
│   │   ├── types/       # TypeScript types
│   │   ├── utils/       # Utility functions
│   │   ├── validators/  # Request validators
│   │   └── server.ts    # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/            # Next.js application
│   ├── src/
│   │   ├── app/        # Next.js App Router pages
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utilities and configs
│   │   └── store/      # Zustand stores
│   ├── Dockerfile
│   └── package.json
├── mongodb/             # MongoDB initialization
├── nginx/               # Nginx configuration
├── deployment/          # Docker Compose setup
│   ├── docker-compose.yml
│   └── deploy.sh
├── SOCKET_EVENTS.md     # Socket.IO events documentation
└── README.md
```

## 📦 Prerequisites

### For Local Development
- Node.js 20+ or Bun
- MongoDB 8+
- npm, pnpm, or bun

### For Docker Deployment
- Docker 20+
- Docker Compose 2+

## 🚀 Getting Started

### Local Development

#### 1. Clone the repository
```bash
git clone <repository-url>
cd chat_app
```

#### 2. Set up the Backend

```bash
cd backend

# Install dependencies
npm install
# or
bun install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
# or
bun run dev
```

The backend will start on `http://localhost:3001`

#### 3. Set up the Frontend

```bash
cd frontend

# Install dependencies
npm install
# or
bun install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
# or
bun run dev
```

The frontend will start on `http://localhost:3000`

#### 4. Set up MongoDB

Make sure MongoDB is running locally on `mongodb://localhost:27017` or update the connection string in your backend `.env` file.

### Docker Deployment

#### 1. Create environment file

```bash
cd deployment
cp .env.example .env
# Edit .env with your production configuration
```

#### 2. Build and run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

#### 3. Access the application

- Frontend: `http://localhost:80`
- Backend API: `http://localhost:3001`
- MongoDB: `localhost:27017`

#### 4. SSL/TLS Configuration (Optional)

For production with SSL:

```bash
# Initialize SSL certificates
docker-compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  -d your-domain.com

# Auto-renewal is configured in docker-compose.yml
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/chatapp

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# CORS
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
# API Endpoints
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# For SSR API calls
BACKEND_ENDPOINT=http://backend:3001
```

### Docker Deployment (.env in deployment/)

```env
# MongoDB
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=secure_password_here
MONGO_DB=chatapp

# Backend
BACKEND_PORT=3001
JWT_SECRET=your_production_jwt_secret

# Frontend URLs
NEXT_PUBLIC_FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_BACKEND_URL=https://your-domain.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-domain.com/socket
BACKEND_ENDPOINT=http://backend:3001
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### User Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/search?q=query` - Search users

### Conversation Endpoints

- `GET /api/conversations` - Get user's conversations
- `GET /api/conversations/:id` - Get conversation by ID
- `POST /api/conversations` - Create new conversation

### Message Endpoints

- `GET /api/messages/:conversationId` - Get messages for conversation
- `POST /api/messages` - Send message (prefer Socket.IO)

### Friendship Endpoints

- `GET /api/friendships` - Get user's friendships
- `POST /api/friendships/request` - Send friend request
- `PUT /api/friendships/:id/accept` - Accept friend request
- `PUT /api/friendships/:id/decline` - Decline friend request

All protected endpoints require `Authorization: Bearer <token>` header.

## 🔌 Socket Events

For detailed Socket.IO events documentation, see [SOCKET_EVENTS.md](./SOCKET_EVENTS.md).

### Quick Reference

**Client → Server Events:**
- `create_conversation`
- `join_conversation`
- `send_message`
- `typing_conversation`
- `read_all_messages`
- `send_friendship_request`
- `accept_friendship_request`
- `decline_friendship_request`

**Server → Client Events:**
- `conversation_created`
- `new_message`
- `conversation_typing`
- `messages_read`
- `user:statusChanged`
- `friendship_request_received`
- `friendship_request_accepted`
- `error`

## 🏗 Architecture

### Frontend Architecture
- **App Router**: Next.js 15 App Router for file-based routing
- **State Management**: Zustand for global state (user, conversations, etc.)
- **Real-time**: Socket.IO client with custom hooks
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Modular, reusable components with Radix UI primitives

### Backend Architecture
- **Layered Architecture**:
  - Routes → Controllers → Services → Repository
- **Socket.IO**: Separate namespace with JWT authentication middleware
- **Database**: MongoDB with Mongoose ODM
- **Logging**: Winston for structured logging
- **Error Handling**: Centralized error middleware

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues

- None at the moment

## 📮 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Express, and Socket.IO