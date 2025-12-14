# Socket.IO Events Documentation

This document describes all Socket.IO events used in the chat application, including events that the server listens to and events that the server emits.

## Table of Contents
- [Client → Server Events](#client--server-events)
- [Server → Client Events](#server--client-events)
- [Type Definitions](#type-definitions)

---

## Client → Server Events

These are events that clients emit and the server listens to.

### Connection Events

#### `connection`
Automatically emitted when a client connects. Requires authentication via Authorization header.

**Authentication:**
```typescript
{
  headers: {
    authorization: "Bearer <jwt_token>"
  }
}
```

#### `disconnect`
Automatically emitted when a client disconnects.

---

### Conversation Events

#### `create_conversation`
Creates a new conversation between two users.

**Payload:**
```typescript
{
  participantOneId: string;
  participantTwoId: string;
}
```

**Response:** Emits `conversation_created` to both participants

---

#### `join_conversation`
Joins a specific conversation room.

**Payload:**
```typescript
{
  conversationId: string;
}
```

---

#### `typing_conversation`
Notifies other participants that a user is typing.

**Payload:**
```typescript
{
  conversationId: string;
  isTyping: boolean;
}
```

**Response:** Emits `conversation_typing` to other participants in the conversation

---

### Message Events

#### `send_message`
Sends a message in a conversation.

**Payload:**
```typescript
{
  conversationId: string;
  content: string;
}
```

**Response:** Emits `new_message` to all participants in the conversation

---

#### `read_all_messages`
Marks all messages in a conversation as read for the current user.

**Payload:**
```typescript
{
  conversationId: string;
}
```

**Response:** Emits `messages_read` to all participants in the conversation

---

### Friendship Events

#### `send_friendship_request`
Sends a friend request to another user.

**Payload:**
```typescript
{
  receiverId: string;
}
```

**Response:** Emits `friendship_request_received` to the receiver

---

#### `accept_friendship_request`
Accepts a pending friend request.

**Payload:**
```typescript
{
  friendshipId: string;
}
```

**Response:** Emits `friendship_request_accepted` to both requester and recipient

---

#### `decline_friendship_request`
Declines a pending friend request.

**Payload:**
```typescript
{
  friendshipId: string;
}
```

**Response:** Emits `friendship_request_declined` to the sender

---

## Server → Client Events

These are events that the server emits and clients listen to.

### User Status Events

#### `user:statusChanged`
Emitted when a user's online status changes (online/offline).

**Payload:**
```typescript
{
  userId: string;
  status: "online" | "offline";
}
```

**Emitted to:** All friends of the user

---

### Conversation Events

#### `conversation_created`
Emitted when a new conversation is created.

**Payload:**
```typescript
{
  conversation: ConversationWithDetails;
}
```

**Type Definition:**
```typescript
type ConversationWithDetails = {
  _id: string;
  participantOne: User;
  participantTwo: User;
  lastMessage?: PopulatedMessage;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
};
```

**Emitted to:** Both participants of the conversation

---

#### `conversation_typing`
Emitted when a user is typing in a conversation.

**Payload:**
```typescript
{
  conversationId: string;
  userId: string;
  isTyping: boolean;
}
```

**Emitted to:** Other participants in the conversation (not the sender)

---

### Message Events

#### `new_message`
Emitted when a new message is sent in a conversation.

**Payload:**
```typescript
{
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
}
```

**Emitted to:** All participants in the conversation

---

#### `messages_read`
Emitted when a user marks all messages as read in a conversation.

**Payload:**
```typescript
{
  conversationId: string;
  userId: string;
}
```

**Emitted to:** All participants in the conversation

---

### Friendship Events

#### `friendship_request_received`
Emitted when a user receives a friend request.

**Payload:**
```typescript
{
  friendship: Friendship;
}
```

**Type Definition:**
```typescript
type Friendship = {
  _id: string;
  requester: User;
  recipient: User;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
  updatedAt: Date;
};
```

**Emitted to:** The recipient of the friend request

---

#### `friendship_request_accepted`
Emitted when a friend request is accepted.

**Payload:**
```typescript
{
  friendship: Friendship;
}
```

**Emitted to:** Both the requester and recipient

---

#### `friendship_request_declined`
Emitted when a friend request is declined.

**Payload:**
```typescript
{
  friendshipId: string;
}
```

**Emitted to:** The sender who declined the request

---

### Error Events

#### `error`
Emitted when an error occurs during any socket operation.

**Payload:**
```typescript
{
  event: string;  // The name of the event that failed
  message: string;  // User-friendly error message
}
```

**Emitted to:** The client that triggered the error

---

## Type Definitions

### User
```typescript
type User = {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  createdAt: Date;
  updatedAt: Date;
};
```

### PopulatedMessage
```typescript
type PopulatedMessage = {
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
};
```

### ConversationWithDetails
```typescript
type ConversationWithDetails = {
  _id: string;
  participantOne: User;
  participantTwo: User;
  lastMessage?: PopulatedMessage;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
};
```

### Friendship
```typescript
type Friendship = {
  _id: string;
  requester: User;
  recipient: User;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
  updatedAt: Date;
};
```

---

## Socket Rooms

The application uses the following room naming conventions:

- **User Room:** `{userId}` - Each user automatically joins their own room upon connection
- **Conversation Room:** `conversation_{conversationId}` - Users join these rooms when entering a conversation

---

## Authentication

All socket connections must include a valid JWT token in the Authorization header:

```typescript
import { io } from 'socket.io-client';

const socket = io('http://your-server-url', {
  extraHeaders: {
    Authorization: `Bearer ${yourJwtToken}`
  }
});
```

If authentication fails, the connection will be rejected with an error.

---

## Error Handling

All socket event handlers include try-catch blocks. When an error occurs:

1. The error is logged on the server
2. An `error` event is emitted to the client with details
3. The client should handle the error appropriately (show toast, retry, etc.)

**Example Client-Side Error Handler:**
```typescript
socket.on("error", (error) => {
  console.error(`Error in ${error.event}:`, error.message);
  // Display user-friendly error message
  showErrorNotification(error.message);
});
```

---

## Best Practices

1. **Always listen for errors:** Implement an error listener on the client
2. **Handle disconnections:** Implement reconnection logic with exponential backoff
3. **Join conversation rooms:** Always emit `join_conversation` before sending messages
4. **Clean up listeners:** Remove event listeners when components unmount
5. **Type safety:** Use TypeScript interfaces that match these type definitions

---

## Example Usage

### Client-Side Example (React + TypeScript)

```typescript
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (token: string) => {
  const socket = io('http://localhost:3000', {
    extraHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  useEffect(() => {
    // Listen for errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Listen for new messages
    socket.on('new_message', (message) => {
      console.log('New message:', message);
    });

    // Listen for typing indicators
    socket.on('conversation_typing', (data) => {
      console.log('User typing:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (conversationId: string, content: string) => {
    socket.emit('send_message', { conversationId, content });
  };

  const joinConversation = (conversationId: string) => {
    socket.emit('join_conversation', { conversationId });
  };

  return { socket, sendMessage, joinConversation };
};
```

---

## Notes

- All timestamps are in ISO 8601 format
- All IDs are MongoDB ObjectId strings
- Password fields are never included in User objects returned via socket events
- Conversation rooms must be joined before sending messages
- Users are automatically added to their user room upon connection