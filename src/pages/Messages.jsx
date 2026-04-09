import React, { useId, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MessageSquarePlus, MoreVertical, Send, Paperclip, Pin, AlertCircle, Bookmark, FileText } from 'lucide-react';
import { messageConversationsMock } from '../mockData';
import './Messages.css';

const quickReplies = ['Nhắc ghi log bữa ăn', 'Nhắc lịch tái khám', 'Yêu cầu bổ sung xét nghiệm', 'Động viên tuân thủ'];

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChatId, setSelectedChatId] = useState(messageConversationsMock[0]?.id || '');
  const [messageSearch, setMessageSearch] = useState('');
  const [messageText, setMessageText] = useState('');
  const messageInputId = useId();

  const conversations = messageConversationsMock;

  const filteredConversations = useMemo(() => {
    const normalizedSearch = messageSearch.trim().toLowerCase();
    if (!normalizedSearch) return conversations;

    return conversations.filter((conversation) =>
      [conversation.name, conversation.id, conversation.lastMsg, conversation.label].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [conversations, messageSearch]);

  const requestedPatientId = searchParams.get('patientId');
  const activeChat =
    (requestedPatientId && conversations.some((conversation) => conversation.id === requestedPatientId) && requestedPatientId) ||
    (conversations.some((conversation) => conversation.id === selectedChatId) && selectedChatId) ||
    conversations[0]?.id ||
    '';

  const currentContact =
    conversations.find((conversation) => conversation.id === activeChat) ??
    filteredConversations[0] ??
    conversations[0];

  const handleOpenConversation = (patientId) => {
    setSelectedChatId(patientId);
    setSearchParams({ patientId });
  };

  const handleSend = () => {
    if (!messageText.trim()) return;
    setMessageText('');
  };

  return (
    <div className="messages-page">
      <div className="messages-layout card">
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <div className="messages-title-row">
              <h2>Tin nhắn</h2>
              <button className="btn-icon" type="button" aria-label="Tạo hội thoại mới">
                <MessageSquarePlus size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="search-bar chat-search">
              <Search size={16} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                name="message-search"
                autoComplete="off"
                aria-label="Tìm kiếm hội thoại theo tên bệnh nhân"
                placeholder="Tìm kiếm bệnh nhân..."
                value={messageSearch}
                onChange={(event) => setMessageSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="conversations-filters">
            <button className="badge badge-blue" type="button">Tất cả</button>
            <button className="badge badge-warning" type="button">Chưa đọc</button>
            <button className="badge" type="button">Ghim</button>
          </div>

          <div className="conversations-list">
            {filteredConversations.map((chat) => (
              <button
                type="button"
                key={chat.id}
                className={`conversation-item ${activeChat === chat.id ? 'active' : ''}`}
                onClick={() => handleOpenConversation(chat.id)}
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
                  <div className="chat-info-middle">
                    <span className="chat-patient-id">{chat.id}</span>
                    <span className={`badge ${chat.label === 'Cảnh báo' ? 'badge-danger' : 'badge-blue'}`}>{chat.label}</span>
                  </div>
                  <div className="chat-info-bottom">
                    <p className={`chat-last-msg ${chat.unread > 0 ? 'font-bold text-main' : ''}`}>{chat.lastMsg}</p>
                    {chat.pinned && <Pin size={14} className="text-muted" aria-hidden="true" />}
                  </div>
                </div>
              </button>
            ))}

            {filteredConversations.length === 0 ? <p className="messages-empty">Không tìm thấy hội thoại phù hợp.</p> : null}
          </div>
        </div>

        {currentContact ? (
          <>
            <div className="chat-area">
              <div className="chat-header">
                <div className="chat-user-info">
                  <div className="profile-avatar-sm">{currentContact.name.charAt(0)}</div>
                  <div>
                    <h3 className="chat-title">
                      {currentContact.name} <span className="text-sm font-normal text-muted">({currentContact.id})</span>
                    </h3>
                    <div className="chat-tags">
                      <span className={`badge ${currentContact.label === 'Cảnh báo' ? 'badge-danger' : 'badge-blue'}`}>
                        {currentContact.label}
                      </span>
                      <Link to={`/patients/${currentContact.id}`} className="badge text-primary profile-link-badge">
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
                  <span>Hôm nay</span>
                </div>

                {currentContact.messages.map((message) => (
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
                  <p className="text-sm text-muted">{currentContact.contextGoal}</p>
                </div>
                <div className="context-section text-sm mt-3">
                  <h5>Cảnh báo gần đây</h5>
                  <p className="text-danger flex context-inline-icon">
                    <AlertCircle size={14} aria-hidden="true" /> {currentContact.contextAlert}
                  </p>
                </div>
                <div className="context-section text-sm mt-3">
                  <h5>Tài liệu mới</h5>
                  <button className="btn-secondary btn-sm context-report-btn" type="button">
                    <FileText size={14} aria-hidden="true" /> {currentContact.latestReport}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="chat-area chat-empty-state">
            <p>Chọn một bệnh nhân để bắt đầu nhắn tin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
