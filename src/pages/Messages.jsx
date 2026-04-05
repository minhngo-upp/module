import React, { useState } from 'react';
import { Search, MoreVertical, Send, Paperclip, Pin, CheckCircle2, AlertCircle, Bookmark, FileText } from 'lucide-react';
import './Messages.css';

export default function Messages() {
  const [activeChat, setActiveChat] = useState(1);
  const [messageText, setMessageText] = useState('');

  // Mocks
  const conversations = [
    { id: 1, name: 'Nguyễn Thị Hoa', idUser: 'BN001', lastMsg: 'Bác sĩ cho hỏi em ăn phở thay bún được không?', time: '10:30', unread: 2, pinned: true, label: 'Dinh dưỡng' },
    { id: 2, name: 'Trần Văn Nam', idUser: 'BN002', lastMsg: 'Dạ tôi đã cập nhật xét nghiệm máu.', time: 'Hôm qua', unread: 0, pinned: false, label: 'Hành chính' },
    { id: 3, name: 'Lê Hoàng Anh', idUser: 'BN004', lastMsg: 'Tôi bị chóng mặt khi tập HIIT.', time: 'Thứ 3', unread: 0, pinned: false, label: 'Cảnh báo' },
  ];

  const quickReplies = [
    'Nhắc ghi log bữa ăn',
    'Nhắc lịch tái khám',
    'Yêu cầu bổ sung xét nghiệm',
    'Động viên tuân thủ',
  ];

  const chatHistory = [
    { id: 101, sender: 'doctor', text: 'Chào chị Hoa, tuần này chị thấy đường huyết ổn định chứ?', time: '09:00', date: 'Hôm nay' },
    { id: 102, sender: 'patient', text: 'Chào bác sĩ, sáng nay em đo là 95 mg/dL. Hơi mệt xíu ạ.', time: '09:12', date: 'Hôm nay' },
    { id: 103, sender: 'doctor', text: 'Mức đường huyết đó là ổn định nhé. Chị nhớ uống đủ nước.', time: '09:15', date: 'Hôm nay' },
    { id: 104, sender: 'patient', text: 'Bác sĩ cho hỏi em ăn phở thay bún được không?', time: '10:30', date: 'Hôm nay' },
  ];
  
  const currentContact = conversations.find(c => c.id === activeChat);

  const handleSend = () => {
    if(!messageText.trim()) return;
    // Mock sending message
    setMessageText('');
  };

  return (
    <div className="messages-page">
      <div className="messages-layout card">
        
        {/* Left: Conversations List */}
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <h2>Tin nhắn</h2>
            <div className="search-bar chat-search">
              <Search size={16} className="search-icon" />
              <input type="text" placeholder="Tìm kiếm bệnh nhân..." />
            </div>
          </div>
          
          <div className="conversations-filters">
            <button className="badge badge-blue">Tất cả</button>
            <button className="badge badge-warning">Chưa đọc</button>
            <button className="badge">Ghim</button>
          </div>

          <div className="conversations-list">
            {conversations.map(chat => (
              <div 
                key={chat.id} 
                className={`conversation-item ${activeChat === chat.id ? 'active' : ''}`}
                onClick={() => setActiveChat(chat.id)}
              >
                <div className="chat-avatar">
                  {chat.name.charAt(0)}
                  {chat.unread > 0 && <span className="unread-dot"></span>}
                </div>
                <div className="chat-info">
                  <div className="chat-info-top">
                    <h4 className="chat-name">{chat.name}</h4>
                    <span className="chat-time">{chat.time}</span>
                  </div>
                  <div className="chat-info-bottom">
                    <p className={`chat-last-msg ${chat.unread > 0 ? 'font-bold text-main' : ''}`}>
                      {chat.lastMsg}
                    </p>
                    {chat.pinned && <Pin size={14} className="text-muted" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chat Area */}
        <div className="chat-area">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-user-info">
              <div className="profile-avatar-sm">{currentContact.name.charAt(0)}</div>
              <div>
                <h3 className="chat-title">{currentContact.name} <span className="text-sm font-normal text-muted">({currentContact.idUser})</span></h3>
                <div className="chat-tags">
                  <span className={`badge ${currentContact.label === 'Cảnh báo' ? 'badge-danger' : 'badge-blue'}`}>{currentContact.label}</span>
                  <a href={`/patients/${currentContact.idUser}`} className="badge text-primary" style={{backgroundColor: 'transparent', border: '1px solid currentColor'}}>Xem hồ sơ</a>
                </div>
              </div>
            </div>
            <div className="chat-header-actions">
              <button className="btn-icon"><Pin size={20}/></button>
              <button className="btn-icon"><MoreVertical size={20}/></button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            <div className="chat-date-divider"><span>Hôm nay, 18/10</span></div>
            
            {chatHistory.map(msg => (
              <div key={msg.id} className={`message-bubble-wrapper ${msg.sender === 'doctor' ? 'sent' : 'received'}`}>
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input & Tools */}
          <div className="chat-input-area">
            {/* Quick Replies Tool */}
            <div className="quick-replies">
              <span className="text-xs text-muted" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                <Bookmark size={12}/> Tin nhắn mẫu:
              </span>
              <div className="quick-replies-list">
                {quickReplies.map((reply, idx) => (
                  <button 
                    key={idx} 
                    className="quick-reply-btn"
                    onClick={() => setMessageText(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-row">
              <button className="btn-icon text-muted"><Paperclip size={20}/></button>
              <input 
                type="text" 
                className="chat-text-input" 
                placeholder="Nhập tin nhắn tư vấn..." 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="btn-primary btn-send" onClick={handleSend} disabled={!messageText.trim()}>
                <Send size={18}/>
              </button>
            </div>
          </div>
        </div>

        {/* Far Right: Patient Context Overview (Bonus feature) */}
        <div className="chat-context-panel hidden-md">
          <div className="context-header">
            <h4>Bối cảnh bệnh nhân</h4>
          </div>
          <div className="context-body">
             <div className="context-section">
                <h5>Mục tiêu</h5>
                <p className="text-sm text-muted">Kiểm soát đường thai kỳ</p>
             </div>
             <div className="context-section text-sm mt-3">
                <h5>Cảnh báo gần đây</h5>
                <p className="text-danger flex" style={{alignItems: 'center', gap: '4px'}}><AlertCircle size={14}/> Chưa log bữa tối qua</p>
             </div>
             <div className="context-section text-sm mt-3">
                <h5>Xét nghiệm mới</h5>
                <button className="btn-secondary btn-sm" style={{width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                  <FileText size={14}/> Máu tổng quát (16/10)
                </button>
             </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
