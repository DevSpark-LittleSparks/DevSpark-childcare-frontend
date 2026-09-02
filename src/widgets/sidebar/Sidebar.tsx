import React from 'react';
import { 
  Home, 
  Users, 
  TrendingUp, 
  CreditCard, 
  Bell, 
  MessageSquare, 
  User, 
  Check
} from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon"><Check size={20} /></div>
        <span>Sprouty</span>
      </div>
      
      <nav className="nav-links">
        <a href="#" className="nav-item">
          <Home className="nav-icon" /> Home
        </a>
        <a href="#" className="nav-item">
          <Users className="nav-icon" /> My Children
        </a>
        <a href="#" className="nav-item">
          <TrendingUp className="nav-icon" /> Progress
        </a>
        <a href="#" className="nav-item active">
          <CreditCard className="nav-icon" /> Payments
        </a>
        <a href="#" className="nav-item">
          <Bell className="nav-icon" /> Notifications
        </a>
        <a href="#" className="nav-item">
          <MessageSquare className="nav-icon" /> Messaging
        </a>
        <a href="#" className="nav-item">
          <User className="nav-icon" /> My Profile
        </a>
      </nav>

      <div className="user-profile">
        <div className="avatar">SJ</div>
        <div className="user-info">
          <span className="user-name">Sarah Jenkins</span>
          <span className="user-role">Parent</span>
        </div>
      </div>
    </aside>
  );
};
