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
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">M</div>
          <h2>The Meal Clinic</h2>
        </div>

        <nav className="sidebar-nav" aria-label="Điều hướng chính">
          <ul>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="main-content">
        <header className="top-header">
          <div className="search-bar">
            <Search size={18} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              name="global-patient-search"
              autoComplete="off"
              aria-label="Tìm kiếm bệnh nhân theo tên, số điện thoại hoặc mã bệnh nhân"
              placeholder="Tìm kiếm bệnh nhân (Tên, SĐT, Mã)..."
            />
          </div>

          <div className="header-actions">
            <button className="btn-icon header-btn" type="button" aria-label="Mở thông báo">
              <Bell size={20} aria-hidden="true" />
              <span className="badge-indicator" aria-hidden="true"></span>
            </button>

            <button className="user-profile" type="button" aria-label="Mở hồ sơ tài khoản bác sĩ">
              <div className="user-avatar">
                <UserCircle size={32} aria-hidden="true" />
              </div>
              <div className="user-info">
                <span className="user-name">Dr. Nguyễn Văn A</span>
                <span className="user-role">Trưởng khoa Dinh dưỡng</span>
              </div>
            </button>
          </div>
        </header>

        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
