# Unfriend & Block Feature Implementation

This document describes all changes made to implement the unfriend, block, and unblock features in the chat application.

---

## Table of Contents

- [Overview](#overview)
- [Backend Changes](#backend-changes)
- [Frontend Changes](#frontend-changes)
- [API Endpoints](#api-endpoints)
- [Feature Behavior](#feature-behavior)
- [File Changes Summary](#file-changes-summary)

---

## Overview

### Features Implemented

| Feature | Description |
|---------|-------------|
| **Unfriend** | Remove a user from friends list while keeping conversation accessible |
| **Block** | Block any user (friend or non-friend) from messaging you |
| **Unblock** | Remove a block to allow messaging again (does not restore friendship) |

### Key Design Decisions

1. **Block works for everyone** - Users can block anyone, not just friends
2. **Conversations remain visible** - Blocked conversations stay in the list but show a blocked message
3. **Both parties see blocked state** - Blocker sees "You have blocked this user", blocked user sees "You cannot message this user"
4. **Unblock doesn't restore friendship** - After unblocking, users need to send a new friend request to become friends again
5. **No real-time notifications for block** - Blocking is silent; the blocked user discovers it when trying to message

---

## Backend Changes

### 1. `backend/src/repository/friendshipRepository.ts`

#### Fixed `blockUser` Method (lines 222-252)
**Problem:** Only worked if a friendship record already existed.

**Solution:** Create a new blocked record if no friendship exists.

```typescript
async blockUser(userId: string, blockedUserId: string) {
    // Find any existing friendship/block record
    let friendship = await FriendshipModel.findOne({
        $or: [
            { requester: userId, recipient: blockedUserId },
            { requester: blockedUserId, recipient: userId },
        ],
    });

    if (friendship) {
        // Update existing record to blocked
        friendship.status = "blocked";
        friendship.blockedBy = new mongoose.Types.ObjectId(userId);
    } else {
        // Create new blocked record (for blocking non-friends)
        friendship = new FriendshipModel({
            requester: userId,
            recipient: blockedUserId,
            status: "blocked",
            blockedBy: userId,
        });
    }

    await friendship.save();
    // ... populate and return
}
```

#### Added `isBlocked` Method (lines 200-220)
**Purpose:** Check if a block exists between two users and who initiated it.

```typescript
async isBlocked(
    userOneId: string,
    userTwoId: string,
): Promise<{ isBlocked: boolean; blockedByUserId: string | null }> {
    const friendship = await FriendshipModel.findOne({
        $or: [
            { requester: userOneId, recipient: userTwoId },
            { requester: userTwoId, recipient: userOneId },
        ],
        status: "blocked",
    });

    if (!friendship) {
        return { isBlocked: false, blockedByUserId: null };
    }

    return {
        isBlocked: true,
        blockedByUserId: friendship.blockedBy?.toString() || null,
    };
}
```

#### Fixed `unblockUser` Method (line 261)
**Problem:** Was querying for `status: "accepted"` instead of `status: "blocked"`.

**Solution:** Changed to query for blocked status.

```typescript
// Before (buggy):
status: "accepted",

// After (fixed):
status: "blocked",
```

---

### 2. `backend/src/services/friendsipService.ts`

#### Added `isBlocked` Service Method (lines 73-76)

```typescript
async isBlocked(userOneId: string, userTwoId: string) {
    return await this.firendshipRepo.isBlocked(userOneId, userTwoId);
}
```

---

### 3. `backend/src/services/messageService.ts`

#### Added FriendshipService Dependency (lines 1-11)

```typescript
import { FriendshipService } from "./friendsipService";

export class MessageService {
    constructor(
        private messageRepo: MessageRepository,
        private conversationService: ConversationService,
        private friendshipService: FriendshipService,  // NEW
    ) {}
```

#### Added Block Check in `sendMessage` (lines 12-40)

Messages are rejected if either user has blocked the other:

```typescript
async sendMessage(input: CreateMessageInput) {
    // ... existing validation ...

    // Check if blocked
    const otherUserId =
        conversation.participantOne._id.toString() === senderId
            ? conversation.participantTwo._id.toString()
            : conversation.participantOne._id.toString();

    const blockStatus = await this.friendshipService.isBlocked(
        senderId,
        otherUserId,
    );
    if (blockStatus.isBlocked) {
        throw new AppError("You cannot message this user", 403);
    }

    // ... send message ...
}
```

---

### 4. `backend/src/services/conversatioService.ts`

#### Added Block Status to Conversations (lines 17-43)

When fetching conversations, each now includes blocked information:

```typescript
async getUserConversationsWithUnreadCounts(userId: string) {
    const conversations =
        await this.conversationRepo.getUserConversationsWithUnreadCounts(userId);

    // Add blocked status to each conversation
    const conversationsWithBlockStatus = await Promise.all(
        conversations.map(async (conv) => {
            const otherUserId =
                conv.participantOne._id.toString() === userId
                    ? conv.participantTwo._id.toString()
                    : conv.participantOne._id.toString();

            const blockStatus = await this.friendshipService.isBlocked(
                userId,
                otherUserId,
            );

            return {
                ...conv,
                isBlocked: blockStatus.isBlocked,
                blockedByMe: blockStatus.blockedByUserId === userId,
            };
        }),
    );

    return conversationsWithBlockStatus;
}
```

---

### 5. `backend/src/schema/mongodb/conversationSchema.ts`

#### Updated `PopulatedConversation` Type (lines 45-56)

```typescript
export type PopulatedConversation = Omit<...> & {
    // ... existing fields ...
    unreadCount: number;
    isBlocked?: boolean;      // NEW
    blockedByMe?: boolean;    // NEW
    createdAt: string;
    updatedAt: string;
};
```

---

### 6. `backend/src/utils/provider.ts`

#### Updated `getMessageService` (lines 142-151)

Injected `FriendshipService` as a dependency:

```typescript
getMessageService() {
    return this.getOrCreate(
        ObjectsName.MessageService,
        () =>
            new MessageService(
                this.getMessageRepository(),
                this.getConversationService(),
                this.getFriendshipService(),  // NEW
            ),
    );
}
```

---

## Frontend Changes

### 1. `frontend/src/types/conversation.ts`

#### Added Block Fields (lines 1-15)

```typescript
export type Conversation = {
    _id: string;
    participantOne: User;
    participantTwo: User;
    lastMessage?: Message;
    unreadCount: number;
    isBlocked?: boolean;      // NEW
    blockedByMe?: boolean;    // NEW
    createdAt: string;
    updatedAt: string;
};
```

---

### 2. `frontend/src/stateManagment/friendshipStore.ts`

#### Added `unblockUser` to Interface (line 31)

```typescript
unblockUser: (userId: string) => Promise<void>;
```

#### Added `unblockUser` Implementation (lines 611-658)

```typescript
unblockUser: async (userId) => {
    console.log(
        "%c 🌐 [HTTP] Unblocking User...",
        "color: #eab308; font-weight: bold;",
        { userId },
    );
    set({ isLoading: true, error: null });

    try {
        const rawResponse = await fetch(
            `${API_BASE_URL}/friendship/unblock/${userId}`,
            {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            },
        );

        const response = await rawResponse.json();

        if (!response.success) {
            set({ error: response.errorMessage });
            return;
        }

        // Refresh conversations to update blocked status
        useChatStore.getState().fetchConversations();
    } catch (err) {
        set({ error: "Failed to unblock user" });
    } finally {
        set({ isLoading: false });
    }
},
```

#### Updated `blockFriend` to Refresh Conversations (line 593)

Added conversation refresh after successful block:

```typescript
// Refresh conversations to get updated blocked status
useChatStore.getState().fetchConversations();
```

---

### 3. `frontend/src/components/chat/mainChatArea.tsx`

#### Added Store Imports (line 77)

```typescript
const { friends, unfriendUser, blockFriend, unblockUser } = useFriendshipStore();
```

#### Added Block State Variables (lines 96-98)

```typescript
// Check if conversation is blocked
const isBlocked = conversation?.isBlocked ?? false;
const blockedByMe = conversation?.blockedByMe ?? false;
```

#### Added Handler Functions

Wired up block dialog (lines 519-528):
```typescript
<BlockUserDailog
    isOpen={blockUserDialogOpen}
    setIsopen={setBlockUserDialogOpen}
    user={otherParticipant}
    onConfirm={() => {
        if (otherParticipant) {
            blockFriend(otherParticipant._id);
        }
    }}
/>
```

Added unblock handler (lines 225-229):
```typescript
const handleUnblockUser = () => {
    if (otherParticipant) {
        unblockUser(otherParticipant._id);
    }
};
```

#### Added Blocked UI with Unblock Button (lines 466-492)

```tsx
{isBlocked ? (
    <div className="sticky bottom-0 z-10 p-4 lg:p-6 border-t ...">
        <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center justify-center space-y-3 py-2">
                <div className="flex items-center space-x-2 text-gray-500 ...">
                    <UserX className="h-5 w-5" />
                    <span>
                        {blockedByMe
                            ? "You have blocked this user"
                            : "You cannot message this user"}
                    </span>
                </div>
                {blockedByMe && (
                    <Button
                        onClick={handleUnblockUser}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-600 ..."
                    >
                        Unblock User
                    </Button>
                )}
            </div>
        </div>
    </div>
) : (
    // Regular message input
)}
```

#### Conditionally Hide Block Menu Option (lines 320-328)

Only show "Block User" option if not already blocked by current user:

```tsx
{!blockedByMe && (
    <DropdownMenuItem
        className="cursor-pointer"
        onClick={handleBlockUser}
    >
        <UserX className="mr-2 h-4 w-4" />
        Block User
    </DropdownMenuItem>
)}
```

---

## API Endpoints

### Block User
- **Method:** `POST`
- **Endpoint:** `/api/friendship/block/:userId`
- **Description:** Block a user (works for friends and non-friends)

### Unblock User
- **Method:** `POST`
- **Endpoint:** `/api/friendship/unblock/:userId`
- **Description:** Remove a block (only the blocker can unblock)

### Remove Friend (Unfriend)
- **Method:** `DELETE`
- **Endpoint:** `/api/friendship/remove/:friendId`
- **Description:** Remove a friend from friends list

---

## Feature Behavior

### Blocking a User

1. Click menu (three dots) in chat header
2. Select "Block User"
3. Confirm in dialog
4. Result:
   - Friendship record updated to `status: "blocked"`
   - Conversation shows blocked message
   - Message input replaced with blocked notice
   - Other user sees "You cannot message this user"

### Unblocking a User

1. In blocked conversation, click "Unblock User" button
2. Result:
   - Block record is deleted
   - Message input reappears
   - Users are NOT automatically friends again
   - They can message if they become friends again

### Unfriending a User

1. Click menu (three dots) in chat header
2. Select "Unfriend User"
3. Confirm in dialog
4. Result:
   - Friend removed from friends list
   - Socket notifies other user
   - Conversation remains accessible

---

## File Changes Summary

| File | Type | Changes |
|------|------|---------|
| `backend/src/repository/friendshipRepository.ts` | Modified | Fixed `blockUser`, added `isBlocked`, fixed `unblockUser` |
| `backend/src/services/friendsipService.ts` | Modified | Added `isBlocked` method |
| `backend/src/services/messageService.ts` | Modified | Added block check, FriendshipService dependency |
| `backend/src/services/conversatioService.ts` | Modified | Added block status to conversation responses |
| `backend/src/schema/mongodb/conversationSchema.ts` | Modified | Added `isBlocked`, `blockedByMe` to type |
| `backend/src/utils/provider.ts` | Modified | Updated MessageService injection |
| `frontend/src/types/conversation.ts` | Modified | Added `isBlocked`, `blockedByMe` fields |
| `frontend/src/stateManagment/friendshipStore.ts` | Modified | Added `unblockUser`, updated `blockFriend` |
| `frontend/src/components/chat/mainChatArea.tsx` | Modified | Added blocked UI, unblock button, wired up block |

---

## Testing Checklist

- [ ] Block a friend - verify blocked UI appears
- [ ] Block a non-friend - verify it works
- [ ] Try to send message when blocked - verify rejection
- [ ] As blocked user, try to message - verify "You cannot message this user"
- [ ] Unblock a user - verify message input reappears
- [ ] Verify unblock doesn't restore friendship
- [ ] Unfriend a user - verify friend removed from list
- [ ] Verify socket notification on unfriend
