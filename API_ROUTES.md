# Backend API Routes Documentation

This document provides a comprehensive overview of all available API endpoints in the chat application backend.

## Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Auth Routes](#auth-routes)
- [User Routes](#user-routes)
- [Friendship Routes](#friendship-routes)
- [Conversation Routes](#conversation-routes)
- [Message Routes](#message-routes)
- [Health Check](#health-check)
- [Error Handling](#error-handling)

---

## Base URL

```
http://localhost:3000/api
```

---

## Authentication

All routes marked with 🔒 require authentication via JWT token in the `Authorization` header or as a cookie.

**Header Format:**
```
Authorization: Bearer <jwt_token>
```

**Cookie:** JWT tokens are also accepted as cookies.

---

## Auth Routes

Base path: `/api/auth`

### Sign Up
Creates a new user account.

- **Method:** `POST`
- **Endpoint:** `/signup`
- **Authentication:** 🔓 Not required
- **Request Body:**
```typescript
{
  username: string;
  email: string;
  password: string;
}
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    status: "online" | "offline" | "away";
    createdAt: Date;
    updatedAt: Date;
  };
  errorMessage?: string;
}
```

---

### Log In
Authenticates a user and returns JWT token.

- **Method:** `POST`
- **Endpoint:** `/login`
- **Authentication:** 🔓 Not required
- **Request Body:**
```typescript
{
  email: string;
  password: string;
}
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    status: "online" | "offline" | "away";
    createdAt: Date;
    updatedAt: Date;
  };
  errorMessage?: string;
}
```
- **Note:** JWT token is returned in a secure cookie

---

### Get Current User
Retrieves the authenticated user's profile information.

- **Method:** `GET`
- **Endpoint:** `/me`
- **Authentication:** 🔒 Required
- **Response:**
```typescript
{
  success: boolean;
  data: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    status: "online" | "offline" | "away";
    createdAt: Date;
    updatedAt: Date;
  };
  errorMessage?: string;
}
```

---

## User Routes

Base path: `/api/user`
All routes in this section require authentication 🔒

### Get User Profile
Retrieves the authenticated user's profile.

- **Method:** `GET`
- **Endpoint:** `/me`
- **Authentication:** 🔒 Required
- **Response:**
```typescript
{
  success: boolean;
  data: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    status: "online" | "offline" | "away";
    createdAt: Date;
    updatedAt: Date;
  };
  errorMessage?: string;
}
```

---

### Update User Profile
Updates the authenticated user's profile information.

- **Method:** `PUT`
- **Endpoint:** `/me`
- **Authentication:** 🔒 Required
- **Request Body:**
```typescript
{
  username?: string;
  email?: string;
  avatar?: string;
  // Any other user fields to update
}
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    status: "online" | "offline" | "away";
    createdAt: Date;
    updatedAt: Date;
  };
  errorMessage?: string;
}
```

---

### Search Users
Searches for users by username or email.

- **Method:** `GET`
- **Endpoint:** `/search`
- **Authentication:** 🔒 Required
- **Query Parameters:**
```
query: string (search term for username or email)
limit?: number (default: 10)
skip?: number (default: 0)
```
- **Example:**
```
GET /api/user/search?query=john&limit=10&skip=0
```
- **Response:**
```typescript
{
  success: boolean;
  data: User[];
  errorMessage?: string;
}
```

---

## Friendship Routes

Base path: `/api/friendship`
All routes in this section require authentication 🔒

### Get Friends List
Retrieves all friends of the authenticated user.

- **Method:** `GET`
- **Endpoint:** `/friends`
- **Authentication:** 🔒 Required
- **Response:**
```typescript
{
  success: boolean;
  data: User[];
  errorMessage?: string;
}
```

---

### Get Friendship Status
Checks the friendship status between the authenticated user and another user.

- **Method:** `GET`
- **Endpoint:** `/status/:userId`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
userId: string (MongoDB ObjectId of the user to check)
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    status: "friends" | "pending" | "incoming" | "none" | "blocked";
    friendshipId?: string;
  };
  errorMessage?: string;
}
```

---

### Get Pending Friend Requests
Retrieves all pending friend requests received by the authenticated user.

- **Method:** `GET`
- **Endpoint:** `/pending`
- **Authentication:** 🔒 Required
- **Response:**
```typescript
{
  success: boolean;
  data: Array<{
    _id: string;
    requester: User;
    recipient: User;
    status: "pending" | "accepted" | "declined";
    createdAt: Date;
    updatedAt: Date;
  }>;
  errorMessage?: string;
}
```

---

### Get Sent Friend Requests
Retrieves all friend requests sent by the authenticated user.

- **Method:** `GET`
- **Endpoint:** `/sent`
- **Authentication:** 🔒 Required
- **Response:**
```typescript
{
  success: boolean;
  data: Array<{
    _id: string;
    requester: User;
    recipient: User;
    status: "pending" | "accepted" | "declined";
    createdAt: Date;
    updatedAt: Date;
  }>;
  errorMessage?: string;
}
```

---

### Send Friend Request
Sends a friend request to another user.

- **Method:** `POST`
- **Endpoint:** `/request/:userId`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
userId: string (MongoDB ObjectId of the user to send request to)
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    _id: string;
    requester: User;
    recipient: User;
    status: "pending";
    createdAt: Date;
    updatedAt: Date;
  };
  errorMessage?: string;
}
```
- **Socket Event:** Emits `friendship_request_received` to the recipient

---

### Accept Friend Request
Accepts a pending friend request.

- **Method:** `POST`
- **Endpoint:** `/accept/:friendshipId`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
friendshipId: string (MongoDB ObjectId of the friendship request)
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    _id: string;
    requester: User;
    recipient: User;
    status: "accepted";
    createdAt: Date;
    updatedAt: Date;
  };
  errorMessage?: string;
}
```
- **Socket Event:** Emits `friendship_request_accepted` to the requester

---

### Decline Friend Request
Declines a pending friend request.

- **Method:** `POST`
- **Endpoint:** `/decline/:friendshipId`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
friendshipId: string (MongoDB ObjectId of the friendship request)
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    _id: string;
    requester: User;
    recipient: User;
    status: "declined";
    createdAt: Date;
    updatedAt: Date;
  };
  errorMessage?: string;
}
```
- **Socket Event:** Emits `friendship_request_declined` to the requester

---

### Cancel Friend Request
Cancels a sent friend request (only the sender can cancel).

- **Method:** `DELETE`
- **Endpoint:** `/cancel/:friendshipId`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
friendshipId: string (MongoDB ObjectId of the friendship request)
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    message: string;
  };
  errorMessage?: string;
}
```
- **Socket Event:** Emits `friendship_request_cancelled` to the recipient

---

### Remove Friend
Removes an existing friend (unfriend).

- **Method:** `DELETE`
- **Endpoint:** `/remove/:friendId`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
friendId: string (MongoDB ObjectId of the friend to remove)
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    message: string;
  };
  errorMessage?: string;
}
```
- **Socket Event:** Emits `friendship_unfriend` to the other user

---

### Block User
Blocks a user from sending friend requests and messaging.

- **Method:** `POST`
- **Endpoint:** `/block/:userId`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
userId: string (MongoDB ObjectId of the user to block)
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    _id: string;
    blockedUser: User;
    blockedAt: Date;
  };
  errorMessage?: string;
}
```

---

### Unblock User
Unblocks a previously blocked user.

- **Method:** `POST`
- **Endpoint:** `/unblock/:userId`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
userId: string (MongoDB ObjectId of the user to unblock)
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    message: string;
  };
  errorMessage?: string;
}
```

---

## Conversation Routes

Base path: `/api/conversations`
All routes in this section require authentication 🔒

### Create Conversation
Creates a new conversation between two users or retrieves existing one.

- **Method:** `POST`
- **Endpoint:** `/:otherUserId`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
otherUserId: string (MongoDB ObjectId of the other user)
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    _id: string;
    participantOne: User;
    participantTwo: User;
    lastMessage?: Message;
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
  };
  errorMessage?: string;
}
```
- **Socket Event:** Emits `conversation_created` to both participants

---

### Get All Conversations
Retrieves all conversations for the authenticated user.

- **Method:** `GET`
- **Endpoint:** `/`
- **Authentication:** 🔒 Required
- **Response:**
```typescript
{
  success: boolean;
  data: Array<{
    _id: string;
    participantOne: User;
    participantTwo: User;
    lastMessage?: Message;
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  errorMessage?: string;
}
```

---

### Get Conversation by ID
Retrieves a specific conversation by its ID.

- **Method:** `GET`
- **Endpoint:** `/:conversationId`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
conversationId: string (MongoDB ObjectId of the conversation)
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    _id: string;
    participantOne: User;
    participantTwo: User;
    lastMessage?: Message;
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
  };
  errorMessage?: string;
}
```

---

### Get Conversation with Another User
Retrieves the conversation between the authenticated user and another specific user.

- **Method:** `GET`
- **Endpoint:** `/with/:otherUserId`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
otherUserId: string (MongoDB ObjectId of the other user)
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    _id: string;
    participantOne: User;
    participantTwo: User;
    lastMessage?: Message;
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
  };
  errorMessage?: string;
}
```

---

### Delete Conversation
Deletes a conversation (removes it from user's conversation list).

- **Method:** `DELETE`
- **Endpoint:** `/:conversationId`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
conversationId: string (MongoDB ObjectId of the conversation)
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    message: string;
  };
  errorMessage?: string;
}
```

---

## Message Routes

Base path: `/api/messages`
All routes in this section require authentication 🔒

### Get Conversation Messages
Retrieves all messages in a specific conversation.

- **Method:** `GET`
- **Endpoint:** `/conversations/:id/messages`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
id: string (MongoDB ObjectId of the conversation)
```
- **Query Parameters:**
```
limit?: number (default: 50, max messages to retrieve)
skip?: number (default: 0, pagination offset)
```
- **Example:**
```
GET /api/messages/conversations/507f1f77bcf86cd799439011/messages?limit=50&skip=0
```
- **Response:**
```typescript
{
  success: boolean;
  data: Array<{
    _id: string;
    conversationId: string;
    sender: User;
    content: string;
    readBy: Array<{
      user: User;
      readAt: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }>;
  errorMessage?: string;
}
```

---

### Mark Messages as Read
Marks all messages in a conversation as read by the authenticated user.

- **Method:** `PATCH`
- **Endpoint:** `/conversations/:id/read`
- **Authentication:** 🔒 Required
- **Path Parameters:**
```
id: string (MongoDB ObjectId of the conversation)
```
- **Response:**
```typescript
{
  success: boolean;
  data: {
    message: string;
    unreadCount: number;
  };
  errorMessage?: string;
}
```
- **Socket Event:** Emits `messages_read` to all participants in the conversation

---

## Health Check

### Server Health
Checks if the server is running.

- **Method:** `GET`
- **Endpoint:** `/health`
- **Authentication:** 🔓 Not required
- **Response:**
```typescript
{
  message: "Server is healthy"
}
```

---

## Error Handling

All endpoints follow a consistent error response format:

```typescript
{
  success: false;
  errorMessage: string; // User-friendly error message
}
```

### Common HTTP Status Codes

- **200 OK:** Request successful
- **201 Created:** Resource created successfully
- **400 Bad Request:** Invalid request parameters
- **401 Unauthorized:** Missing or invalid authentication
- **403 Forbidden:** User doesn't have permission
- **404 Not Found:** Resource not found
- **409 Conflict:** Conflict (e.g., friendship already exists)
- **500 Internal Server Error:** Server error

### Example Error Response

```typescript
{
  success: false,
  errorMessage: "User not found"
}
```

---

## Request Examples

### Using cURL

**Sign Up:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Get User Profile (Authenticated):**
```bash
curl -X GET http://localhost:3000/api/user/me \
  -H "Authorization: Bearer <jwt_token>"
```

**Send Friend Request:**
```bash
curl -X POST http://localhost:3000/api/friendship/request/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <jwt_token>"
```

**Search Users:**
```bash
curl -X GET "http://localhost:3000/api/user/search?query=john&limit=10" \
  -H "Authorization: Bearer <jwt_token>"
```

### Using JavaScript/Fetch

```typescript
// Sign Up
const response = await fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securePassword123'
  })
});

const data = await response.json();
console.log(data);

// Get User Profile (Authenticated)
const userResponse = await fetch('http://localhost:3000/api/user/me', {
  method: 'GET',
  credentials: 'include', // Include cookies
  headers: {
    'Authorization': `Bearer ${jwt_token}`
  }
});

const user = await userResponse.json();
console.log(user);
```

---

## Notes

- All timestamps are in ISO 8601 format
- All IDs are MongoDB ObjectId strings
- Password fields are never included in User objects returned via API
- Authentication tokens should be stored securely (preferably in httpOnly cookies)
- For real-time events (messages, friend requests, etc.), use Socket.IO events documented in `SOCKET_EVENTS.md`
- All authenticated routes require either:
  - JWT token in `Authorization: Bearer <token>` header, OR
  - JWT token in cookies (httpOnly)
