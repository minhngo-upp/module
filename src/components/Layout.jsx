import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, MessageSquare, Settings, Bell, Search, UserCircle } from 'lucide-react';
import './Layout.css';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/patients', label: 'Bệnh nhân', icon: Users },
    { path: '/appointments', label: 'Lịch khám', icon: Calendar },
    { path: '/messages', label: 'Tin nhắn', icon: MessageSquare },
    { path: '/settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">M</div>
          <h2>The Meal Clinic</h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                              (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link to={item.path} className={`nav-link ${isActive ? 'active' : ''}`}>
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="top-header">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Tìm kiếm bệnh nhân (Tên, SĐT, Mã)..." />
          </div>
          <div className="header-actions">
            <button className="btn-icon header-btn">
              <Bell size={20} />
              <span className="badge-indicator"></span>
            </button>
            <div className="user-profile">
              <div className="user-avatar">
                <UserCircle size={32} />
              </div>
              <div className="user-info">
                <span className="user-name">Dr. Nguyễn Văn A</span>
                <span className="user-role">Trưởng khoa Dinh dưỡng</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
