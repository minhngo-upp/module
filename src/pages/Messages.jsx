import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MoreVertical, Send, Paperclip, Pin, AlertCircle, Bookmark, FileText } from 'lucide-react';
import './Messages.css';

export default function Messages() {
  const [activeChat, setActiveChat] = useState(1);
  const [messageText, setMessageText] = useState('');
  const messageInputId = useId();

  const conversations = [
    { id: 1, name: 'Nguyễn Thị Hoa', idUser: 'BN001', lastMsg: 'Bác sĩ cho hỏi em ăn phở thay bún được không?', time: '10:30', unread: 2, pinned: true, label: 'Dinh dưỡng' },
    { id: 2, name: 'Trần Văn Nam', idUser: 'BN002', lastMsg: 'Dạ tôi đã cập nhật xét nghiệm máu.', time: 'Hôm qua', unread: 0, pinned: false, label: 'Hành chính' },
    { id: 3, name: 'Lê Hoàng Anh', idUser: 'BN004', lastMsg: 'Tôi bị chóng mặt khi tập HIIT.', time: 'Thứ 3', unread: 0, pinned: false, label: 'Cảnh báo' },
  ];

  const quickReplies = ['Nhắc ghi log bữa ăn', 'Nhắc lịch tái khám', 'Yêu cầu bổ sung xét nghiệm', 'Động viên tuân thủ'];

  const chatHistory = [
    { id: 101, sender: 'doctor', text: 'Chào chị Hoa, tuần này chị thấy đường huyết ổn định chứ?', time: '09:00' },
    { id: 102, sender: 'patient', text: 'Chào bác sĩ, sáng nay em đo là 95 mg/dL. Hơi mệt xíu ạ.', time: '09:12' },
    { id: 103, sender: 'doctor', text: 'Mức đường huyết đó là ổn định nhé. Chị nhớ uống đủ nước.', time: '09:15' },
    { id: 104, sender: 'patient', text: 'Bác sĩ cho hỏi em ăn phở thay bún được không?', time: '10:30' },
  ];

  const currentContact = conversations.find((conversation) => conversation.id === activeChat);

  const handleSend = () => {
    if (!messageText.trim()) {
      return;
    }
    setMessageText('');
  };

  return (
    <div className="messages-page">
      <div className="messages-layout card">
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <h2>Tin nhắn</h2>
            <div className="search-bar chat-search">
              <Search size={16} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                name="message-search"
                autoComplete="off"
                aria-label="Tìm kiếm hội thoại theo tên bệnh nhân"
                placeholder="Tìm kiếm bệnh nhân..."
              />
            </div>
          </div>

          <div className="conversations-filters">
            <button className="badge badge-blue">Tất cả</button>
            <button className="badge badge-warning">Chưa đọc</button>
            <button className="badge">Ghim</button>
          </div>

          <div className="conversations-list">
            {conversations.map((chat) => (
              <button
                type="button"
                key={chat.id}
                className={`conversation-item ${activeChat === chat.id ? 'active' : ''}`}
                onClick={() => setActiveChat(chat.id)}
                aria-pressed={activeChat === chat.id}
                aria-label={`Mở hội thoại với ${chat.name}`}
              >
                <div className="chat-avatar">
                  {chat.name.charAt(0)}
                  {chat.unread > 0 && <span className="unread-dot" aria-hidden="true"></span>}
                </div>

                <div className="chat-info">
                  <div className="chat-info-top">
                    <h4 className="chat-name">{chat.name}</h4>
                    <span className="chat-time">{chat.time}</span>
                  </div>
                  <div className="chat-info-bottom">
                    <p className={`chat-last-msg ${chat.unread > 0 ? 'font-bold text-main' : ''}`}>{chat.lastMsg}</p>
                    {chat.pinned && <Pin size={14} className="text-muted" aria-hidden="true" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="chat-area">
          <div className="chat-header">
            <div className="chat-user-info">
              <div className="profile-avatar-sm">{currentContact.name.charAt(0)}</div>
              <div>
                <h3 className="chat-title">
                  {currentContact.name} <span className="text-sm font-normal text-muted">({currentContact.idUser})</span>
                </h3>
                <div className="chat-tags">
                  <span className={`badge ${currentContact.label === 'Cảnh báo' ? 'badge-danger' : 'badge-blue'}`}>{currentContact.label}</span>
                  <Link to={`/patients/${currentContact.idUser}`} className="badge text-primary profile-link-badge">
                    Xem hồ sơ
                  </Link>
                </div>
              </div>
            </div>

            <div className="chat-header-actions">
              <button className="btn-icon" type="button" aria-label={`Ghim hội thoại với ${currentContact.name}`}>
                <Pin size={20} aria-hidden="true" />
              </button>
              <button className="btn-icon" type="button" aria-label={`Mở thêm tùy chọn cho ${currentContact.name}`}>
                <MoreVertical size={20} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="chat-messages">
            <div className="chat-date-divider">
              <span>Hôm nay, 18/10</span>
            </div>

            {chatHistory.map((message) => (
              <div key={message.id} className={`message-bubble-wrapper ${message.sender === 'doctor' ? 'sent' : 'received'}`}>
                <div className="message-bubble">
                  <p>{message.text}</p>
                  <span className="message-time">{message.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <div className="quick-replies">
              <span className="text-xs text-muted quick-replies-label">
                <Bookmark size={12} aria-hidden="true" /> Tin nhắn mẫu:
              </span>
              <div className="quick-replies-list">
                {quickReplies.map((reply) => (
                  <button key={reply} className="quick-reply-btn" type="button" onClick={() => setMessageText(reply)}>
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-row">
              <label className="sr-only" htmlFor={messageInputId}>Nội dung tin nhắn</label>
              <button className="btn-icon text-muted" type="button" aria-label="Đính kèm tệp">
                <Paperclip size={20} aria-hidden="true" />
              </button>
              <input
                id={messageInputId}
                type="text"
                className="chat-text-input"
                aria-label="Nhập nội dung tư vấn cho bệnh nhân"
                placeholder="Nhập tin nhắn tư vấn..."
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSend()}
              />
              <button className="btn-primary btn-send" type="button" onClick={handleSend} disabled={!messageText.trim()} aria-label="Gửi tin nhắn">
                <Send size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

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
              <p className="text-danger flex context-inline-icon">
                <AlertCircle size={14} aria-hidden="true" /> Chưa log bữa tối qua
              </p>
            </div>
            <div className="context-section text-sm mt-3">
              <h5>Xét nghiệm mới</h5>
              <button className="btn-secondary btn-sm context-report-btn" type="button">
                <FileText size={14} aria-hidden="true" /> Máu tổng quát (16/10)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
