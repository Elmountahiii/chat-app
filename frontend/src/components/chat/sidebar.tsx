import { useState } from "react";
import { Search, Plus, MoreVertical } from "lucide-react";
import type { User } from "../../types/user";
import UserItem from "../chat/userItem";
import { useMobile } from "../../hooks/use-mobile";
import "../styles/sidebar.css";

interface SidebarProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
}

export default function Sidebar({
  users,
  selectedUser,
  onSelectUser,
  isMobileOpen,
  toggleMobileSidebar,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMobile();

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOnProfileClick = () => {};

  const sidebarClasses = [
    "sidebar",
    isMobile ? "sidebar-mobile" : "",
    isMobile && !isMobileOpen ? "sidebar-mobile-closed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={sidebarClasses}>
      {/* Header */}
      <div className="sidebar-header">
        <div onClick={handleOnProfileClick} className="user-avatar">
          <span className="user-avatar-text">ME</span>
        </div>
        <div className="header-actions">
          <button className="icon-button">
            <Plus size={20} />
          </button>
          <button className="icon-button">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            className="search-input"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* User list */}
      <div className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              isSelected={selectedUser?.id === user.id}
              onClick={() => onSelectUser(user)}
            />
          ))
        ) : (
          <div className="empty-results">No chats found</div>
        )}
      </div>
    </div>
  );
}
