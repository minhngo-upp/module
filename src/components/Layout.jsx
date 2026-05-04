import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Badge, Dropdown, Avatar, Button } from 'antd';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  MessageSquare,
  Settings as SettingsIcon,
  Bell,
  UserCircle
} from 'lucide-react';

const { Header, Sider, Content } = Layout;

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { key: '/', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { key: '/menus', label: 'Thực đơn', icon: <BookOpen size={20} /> },
    { key: '/patients', label: 'Bệnh nhân', icon: <Users size={20} /> },
    { key: '/appointments', label: 'Lịch khám', icon: <Calendar size={20} /> },
    { key: '/messages', label: 'Tin nhắn', icon: <MessageSquare size={20} /> },
    { key: '/settings', label: 'Cài đặt', icon: <SettingsIcon size={20} /> },
  ];

  const userMenu = {
    items: [
      { key: 'profile', label: 'Hồ sơ', onClick: () => navigate('/settings') },
      { key: 'logout', label: 'Đăng xuất' }
    ]
  };

  // Determine active key for Menu based on pathname
  let activeKey = '/';
  if (location.pathname.startsWith('/menus')) activeKey = '/menus';

  else if (location.pathname.startsWith('/patients')) activeKey = '/patients';
  else if (location.pathname.startsWith('/appointments')) activeKey = '/appointments';
  else if (location.pathname.startsWith('/messages')) activeKey = '/messages';
  else if (location.pathname.startsWith('/settings')) activeKey = '/settings';

  const notifications = [
    { id: 1, type: 'message', content: 'Có tin nhắn mới từ BN Nguyễn Thị Hoa', time: '5 phút trước', unread: true },
    { id: 2, type: 'appointment', content: 'Lịch khám mới: 10:30 - Nguyễn Văn Bình', time: '15 phút trước', unread: true },
    { id: 3, type: 'alert', content: 'BN Trần Văn Nam có chỉ số đường huyết cao bất thường', time: '1 giờ trước', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  const notificationMenu = {
    items: [
      { key: 'header', label: <div style={{ fontWeight: 600, padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>Thông báo mới ({unreadCount})</div>, disabled: true, style: { cursor: 'default', color: '#333' } },
      ...notifications.map(n => ({
        key: n.id,
        label: (
          <div style={{ display: 'flex', flexDirection: 'column', padding: '4px 0', width: 300, whiteSpace: 'normal' }}>
            <span style={{ fontWeight: n.unread ? 600 : 400, color: '#333', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              {n.unread && <span style={{ color: '#ff4d4f', fontSize: '10px', marginTop: '4px' }}>●</span>}
              <span style={{ flex: 1, lineHeight: 1.4 }}>{n.content}</span>
            </span>
            <span style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4, marginLeft: n.unread ? 18 : 0 }}>{n.time}</span>
          </div>
        ),
      })),
      { type: 'divider' },
      { key: 'view-all', label: <div style={{ textAlign: 'center', color: '#22a06b', fontWeight: 600 }}>Xem tất cả thông báo</div>, onClick: () => navigate('/messages') },
    ]
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        breakpoint="lg"
        width={260}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', paddingLeft: collapsed ? 0 : 24, borderBottom: '1px solid #f0f0f0', transition: 'all 0.2s' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'baseline', 
            background: '#22a06b', 
            color: 'white', 
            padding: collapsed ? '4px 8px' : '4px 10px', 
            borderRadius: 8,
            fontWeight: 'bold',
            fontSize: collapsed ? 20 : 22,
            letterSpacing: '-1px'
          }}>
            <span style={{ fontSize: '0.6em', marginRight: '2px' }}>●</span>m
          </div>
          {!collapsed && <span style={{ marginLeft: 12, fontWeight: 800, fontSize: 18, color: '#111', letterSpacing: '-0.5px' }}>The Meal Clinic</span>}
        </div>
        <Menu 
          theme="light" 
          mode="inline" 
          selectedKeys={[activeKey]} 
          items={navItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, marginTop: 16 }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
             <Dropdown menu={notificationMenu} placement="bottomRight" trigger={['click']}>
               <Badge dot={unreadCount > 0} color="red" style={{ cursor: 'pointer' }}>
                 <Button type="text" icon={<Bell size={20} />} />
               </Badge>
             </Dropdown>
             <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
               <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 12, padding: '4px 8px', borderRadius: 8 }}>
                 <Avatar icon={<UserCircle size={24} />} style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }} />
                 <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                   <span style={{ fontWeight: 600, fontSize: 14 }}>BS. Nguyễn Văn A</span>
                   <span style={{ fontSize: 12, color: '#8c8c8c' }}>Trưởng khoa Dinh dưỡng</span>
                 </div>
               </div>
             </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px', background: 'transparent' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

