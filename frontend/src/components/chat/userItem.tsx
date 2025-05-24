import type { User } from "../../types/user";
import "../styles/userItem.css";

interface UserItemProps {
  user: User;
  isSelected: boolean;
  onClick: () => void;
}

export default function UserItem({ user, isSelected, onClick }: UserItemProps) {
  const itemClasses = ["user-item", isSelected ? "selected" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={itemClasses} onClick={onClick}>
      <div className="avatar-container">
        <img
          src={user.profilePicture || "/placeholder.svg"}
          alt={user.username}
          className="user-avatar-img"
        />
        {user.online && <span className="online-indicator"></span>}
      </div>
      <div className="user-info">
        <div className="user-info-header">
          <h3 className="user-name">{user.username}</h3>
          <span className="message-time">{user.lastMessageTime}</span>
        </div>
        <div className="user-info-footer">
          <p className="last-message">{user.lastMessage}</p>
          {user.unreadCount > 0 && (
            <span className="unread-count">{user.unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
}
