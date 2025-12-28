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
- [Request Examples](#request-examples)

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

**Cookie:** JWT tokens are also accepted as httpOnly cookies.

---

## Auth Routes

**Base path:** `/api/auth`

| Method | Endpoint  | Auth | Description                     |
| ------ | --------- | ---- | ------------------------------- |
| POST   | `/signup` | 🔓   | Create a new user account       |
| POST   | `/login`  | 🔓   | Authenticate and receive token  |
| GET    | `/me`     | 🔒   | Get current authenticated user  |

### Sign Up

Creates a new user account.

- **Method:** `POST`
- **Endpoint:** `/signup`
- **Authentication:** 🔓 Not required

**Request Body:**

```typescript
{
  username: string;
  email: string;
  password: string;
}
```

**Response:**

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

Authenticates a user and returns JWT token in a secure httpOnly cookie.

- **Method:** `POST`
- **Endpoint:** `/login`
- **Authentication:** 🔓 Not required

**Request Body:**

```typescript
{
  email: string;
  password: string;
}
```

**Response:**

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

> **Note:** JWT token is returned in a secure httpOnly cookie.

---

### Get Current User

Retrieves the authenticated user's profile information.

- **Method:** `GET`
- **Endpoint:** `/me`
- **Authentication:** 🔒 Required

**Response:**

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

**Base path:** `/api/user`  
**Authentication:** 🔒 All routes require authentication

| Method | Endpoint  | Description                    |
| ------ | --------- | ------------------------------ |
| GET    | `/me`     | Get authenticated user profile |
| PUT    | `/me`     | Update user profile            |
| GET    | `/search` | Search users by query          |

### Get User Profile

Retrieves the authenticated user's profile.

- **Method:** `GET`
- **Endpoint:** `/me`
- **Authentication:** 🔒 Required

**Response:**

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

**Request Body:**

```typescript
{
  username?: string;
  email?: string;
  avatar?: string;
}
```

**Response:**

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

**Query Parameters:**

| Parameter | Type   | Required | Default | Description                        |
| --------- | ------ | -------- | ------- | ---------------------------------- |
| `query`   | string | Yes      | -       | Search term for username or email  |
| `limit`   | number | No       | 10      | Maximum number of results          |
| `skip`    | number | No       | 0       | Number of results to skip          |

**Example:**

```
GET /api/user/search?query=john&limit=10&skip=0
```

**Response:**

```typescript
{
  success: boolean;
  data: User[];
  errorMessage?: string;
}
```

---

## Friendship Routes

**Base path:** `/api/friendship`  
**Authentication:** 🔒 All routes require authentication

| Method | Endpoint                 | Description                    |
| ------ | ------------------------ | ------------------------------ |
| GET    | `/friends`               | Get all friends                |
| GET    | `/status/:userId`        | Check friendship status        |
| GET    | `/pending`               | Get pending friend requests    |
| GET    | `/sent`                  | Get sent friend requests       |
| POST   | `/request/:userId`       | Send a friend request          |
| POST   | `/accept/:friendshipId`  | Accept a friend request        |
| POST   | `/decline/:friendshipId` | Decline a friend request       |
| DELETE | `/cancel/:friendshipId`  | Cancel a sent friend request   |
| DELETE | `/remove/:friendId`      | Remove a friend                |
| POST   | `/block/:userId`         | Block a user                   |
| POST   | `/unblock/:userId`       | Unblock a user                 |

### Get Friends List

Retrieves all friends of the authenticated user.

- **Method:** `GET`
- **Endpoint:** `/friends`
- **Authentication:** 🔒 Required

**Response:**

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

**Path Parameters:**

| Parameter | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| `userId`  | string | MongoDB ObjectId of the user to check |

**Response:**

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

**Response:**

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

**Response:**

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

**Path Parameters:**

| Parameter | Type   | Description                                  |
| --------- | ------ | -------------------------------------------- |
| `userId`  | string | MongoDB ObjectId of the user to send request |

**Response:**

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

**Socket Event:** Emits `friendship_request_received` to the recipient.

---

### Accept Friend Request

Accepts a pending friend request.

- **Method:** `POST`
- **Endpoint:** `/accept/:friendshipId`
- **Authentication:** 🔒 Required

**Path Parameters:**

| Parameter      | Type   | Description                                |
| -------------- | ------ | ------------------------------------------ |
| `friendshipId` | string | MongoDB ObjectId of the friendship request |

**Response:**

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

**Socket Event:** Emits `friendship_request_accepted` to the requester.

---

### Decline Friend Request

Declines a pending friend request.

- **Method:** `POST`
- **Endpoint:** `/decline/:friendshipId`
- **Authentication:** 🔒 Required

**Path Parameters:**

| Parameter      | Type   | Description                                |
| -------------- | ------ | ------------------------------------------ |
| `friendshipId` | string | MongoDB ObjectId of the friendship request |

**Response:**

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

**Socket Event:** Emits `friendship_request_declined` to the requester.

---

### Cancel Friend Request

Cancels a sent friend request (only the sender can cancel).

- **Method:** `DELETE`
- **Endpoint:** `/cancel/:friendshipId`
- **Authentication:** 🔒 Required

**Path Parameters:**

| Parameter      | Type   | Description                                |
| -------------- | ------ | ------------------------------------------ |
| `friendshipId` | string | MongoDB ObjectId of the friendship request |

**Response:**

```typescript
{
  success: boolean;
  data: {
    message: string;
  };
  errorMessage?: string;
}
```

**Socket Event:** Emits `friendship_request_cancelled` to the recipient.

---

### Remove Friend

Removes an existing friend (unfriend).

- **Method:** `DELETE`
- **Endpoint:** `/remove/:friendId`
- **Authentication:** 🔒 Required

**Path Parameters:**

| Parameter  | Type   | Description                           |
| ---------- | ------ | ------------------------------------- |
| `friendId` | string | MongoDB ObjectId of the friend to remove |

**Response:**

```typescript
{
  success: boolean;
  data: {
    message: string;
  };
  errorMessage?: string;
}
```

**Socket Event:** Emits `friendship_unfriend` to the other user.

---

### Block User

Blocks a user from sending friend requests and messaging.

- **Method:** `POST`
- **Endpoint:** `/block/:userId`
- **Authentication:** 🔒 Required

**Path Parameters:**

| Parameter | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| `userId`  | string | MongoDB ObjectId of user to block |

**Response:**

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

**Path Parameters:**

| Parameter | Type   | Description                         |
| --------- | ------ | ----------------------------------- |
| `userId`  | string | MongoDB ObjectId of user to unblock |

**Response:**

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

**Base path:** `/api/conversations`  
**Authentication:** 🔒 All routes require authentication

| Method | Endpoint            | Description                              |
| ------ | ------------------- | ---------------------------------------- |
| POST   | `/:otherUserId`     | Create or get conversation with user     |
| GET    | `/`                 | Get all conversations                    |
| GET    | `/:conversationId`  | Get conversation by ID                   |
| GET    | `/with/:otherUserId`| Get conversation with specific user      |
| DELETE | `/:conversationId`  | Delete a conversation                    |

### Create Conversation

Creates a new conversation between two users or retrieves an existing one.

- **Method:** `POST`
- **Endpoint:** `/:otherUserId`
- **Authentication:** 🔒 Required

**Path Parameters:**

| Parameter     | Type   | Description                        |
| ------------- | ------ | ---------------------------------- |
| `otherUserId` | string | MongoDB ObjectId of the other user |

**Response:**

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

**Socket Event:** Emits `conversation_created` to both participants (if newly created).

---

### Get All Conversations

Retrieves all conversations for the authenticated user.

- **Method:** `GET`
- **Endpoint:** `/`
- **Authentication:** 🔒 Required

**Response:**

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

**Path Parameters:**

| Parameter        | Type   | Description                         |
| ---------------- | ------ | ----------------------------------- |
| `conversationId` | string | MongoDB ObjectId of the conversation |

**Response:**

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

**Path Parameters:**

| Parameter     | Type   | Description                        |
| ------------- | ------ | ---------------------------------- |
| `otherUserId` | string | MongoDB ObjectId of the other user |

**Response:**

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

**Path Parameters:**

| Parameter        | Type   | Description                         |
| ---------------- | ------ | ----------------------------------- |
| `conversationId` | string | MongoDB ObjectId of the conversation |

**Response:**

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

**Base path:** `/api/messages`  
**Authentication:** 🔒 All routes require authentication

| Method | Endpoint                                        | Description                    |
| ------ | ----------------------------------------------- | ------------------------------ |
| GET    | `/conversations/:conversationId/messages`       | Get messages (cursor-based)    |
| GET    | `/conversations/:conversationId/initaialMessages` | Load initial messages        |
| PATCH  | `/conversations/:conversationId/read`           | Mark messages as read          |

### Get Conversation Messages

Retrieves messages in a conversation with cursor-based pagination.

- **Method:** `GET`
- **Endpoint:** `/conversations/:conversationId/messages`
- **Authentication:** 🔒 Required

**Path Parameters:**

| Parameter        | Type   | Description                         |
| ---------------- | ------ | ----------------------------------- |
| `conversationId` | string | MongoDB ObjectId of the conversation |

**Query Parameters:**

| Parameter | Type   | Required | Default | Description                              |
| --------- | ------ | -------- | ------- | ---------------------------------------- |
| `cursor`  | string | No       | -       | Message ID to start from (for pagination) |
| `limit`   | number | No       | 30      | Maximum messages to retrieve             |

**Example:**

```
GET /api/messages/conversations/507f1f77bcf86cd799439011/messages?limit=30
GET /api/messages/conversations/507f1f77bcf86cd799439011/messages?cursor=507f1f77bcf86cd799439012&limit=30
```

**Response:**

```typescript
{
  success: boolean;
  data: {
    messages: Array<{
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
    hasMore: boolean;
    nextCursor: string | null;
  };
  errorMessage?: string;
}
```

---

### Load Initial Messages

Loads the initial set of messages for a conversation. Useful for initial page load.

- **Method:** `GET`
- **Endpoint:** `/conversations/:conversationId/initaialMessages`
- **Authentication:** 🔒 Required

> **Note:** The endpoint contains a typo (`initaialMessages` instead of `initialMessages`).

**Path Parameters:**

| Parameter        | Type   | Description                         |
| ---------------- | ------ | ----------------------------------- |
| `conversationId` | string | MongoDB ObjectId of the conversation |

**Example:**

```
GET /api/messages/conversations/507f1f77bcf86cd799439011/initaialMessages
```

**Response:**

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
- **Endpoint:** `/conversations/:conversationId/read`
- **Authentication:** 🔒 Required

**Path Parameters:**

| Parameter        | Type   | Description                         |
| ---------------- | ------ | ----------------------------------- |
| `conversationId` | string | MongoDB ObjectId of the conversation |

**Response:**

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

**Socket Event:** Emits `messages_read` to all participants in the conversation.

---

## Health Check

### Server Health

Checks if the server is running.

- **Method:** `GET`
- **Endpoint:** `/health`
- **Authentication:** 🔓 Not required

**Response:**

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
  errorMessage: string;
}
```

### HTTP Status Codes

| Code | Status                | Description                              |
| ---- | --------------------- | ---------------------------------------- |
| 200  | OK                    | Request successful                       |
| 201  | Created               | Resource created successfully            |
| 400  | Bad Request           | Invalid request parameters               |
| 401  | Unauthorized          | Missing or invalid authentication        |
| 403  | Forbidden             | User doesn't have permission             |
| 404  | Not Found             | Resource not found                       |
| 409  | Conflict              | Conflict (e.g., friendship already exists) |
| 500  | Internal Server Error | Server error                             |

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

**Get Messages with Cursor Pagination:**

```bash
curl -X GET "http://localhost:3000/api/messages/conversations/507f1f77bcf86cd799439011/messages?limit=30" \
  -H "Authorization: Bearer <jwt_token>"

# Load more messages using cursor
curl -X GET "http://localhost:3000/api/messages/conversations/507f1f77bcf86cd799439011/messages?cursor=507f1f77bcf86cd799439012&limit=30" \
  -H "Authorization: Bearer <jwt_token>"
```

### Using JavaScript/Fetch

```typescript
// Sign Up
const signUpResponse = await fetch("http://localhost:3000/api/auth/signup", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: "john_doe",
    email: "john@example.com",
    password: "securePassword123",
  }),
});

const signUpData = await signUpResponse.json();
console.log(signUpData);

// Get User Profile (Authenticated)
const userResponse = await fetch("http://localhost:3000/api/user/me", {
  method: "GET",
  credentials: "include",
  headers: {
    Authorization: `Bearer ${jwt_token}`,
  },
});

const userData = await userResponse.json();
console.log(userData);

// Get Messages with Cursor-based Pagination
const getMessages = async (conversationId: string, cursor?: string) => {
  const params = new URLSearchParams({ limit: "30" });
  if (cursor) params.append("cursor", cursor);

  const response = await fetch(
    `http://localhost:3000/api/messages/conversations/${conversationId}/messages?${params}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    }
  );

  return response.json();
};

// Initial load
const { data } = await getMessages("507f1f77bcf86cd799439011");
console.log(data.messages);

// Load more if available
if (data.hasMore && data.nextCursor) {
  const moreMessages = await getMessages("507f1f77bcf86cd799439011", data.nextCursor);
  console.log(moreMessages.data.messages);
}
```

---

## Notes

- All timestamps are in ISO 8601 format
- All IDs are MongoDB ObjectId strings
- Password fields are never included in User objects returned via API
- Authentication tokens should be stored securely (preferably in httpOnly cookies)
- For real-time events (messages, friend requests, etc.), see `SOCKET_EVENTS.md`
- All authenticated routes require either:
  - JWT token in `Authorization: Bearer <token>` header, **OR**
  - JWT token in cookies (httpOnly)
- Messages use **cursor-based pagination** for better performance with real-time data