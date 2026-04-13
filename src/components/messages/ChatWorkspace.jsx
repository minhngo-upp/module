import React, { useId, useMemo, useState, useEffect, useRef } from 'react';
import { MoreVertical, Send, Paperclip, Pin, Clock, AlertTriangle, ArrowRight, PenTool, Lock } from 'lucide-react';

const genericReplies = ['Nhắc log bữa ăn', 'Nhắc tái khám', 'Cần kết quả máu', 'Động viên tiếp tục'];
const escalationReplies = ['Mô tả rõ lúc bị mệt?', 'Có đang đổi thuốc?', 'Nên tái khám sớm'];
const dietReplies = ['Thay bằng gạo lứt?', 'Nhớ uống 2L nước', 'Nhắc bữa phụ'];

function analyzeChatContext(messages) {
  let hasEscalation = false;
  let hasDiet = false;

  const textToAnalyze = messages.map(m => m.text.toLowerCase()).join(' ');

  if (['mệt', 'chóng mặt', 'đau', 'buồn nôn', 'khó thở'].some(w => textToAnalyze.includes(w))) {
    hasEscalation = true;
  }
  if (['ăn', 'phở', 'bún', 'cơm', 'nước', 'đói', 'khẩu phần'].some(w => textToAnalyze.includes(w))) {
    hasDiet = true;
  }

  let recommendedReplies = [...genericReplies];
  if (hasDiet) recommendedReplies = [...dietReplies, ...recommendedReplies];
  if (hasEscalation) recommendedReplies = [...escalationReplies, ...recommendedReplies];

  return { hasEscalation, recommendedReplies: [...new Set(recommendedReplies)].slice(0, 4) };
}

export default function ChatWorkspace({ contact }) {
  const [messageText, setMessageText] = useState('');
  const [internalNoteMode, setInternalNoteMode] = useState(false);
  const messageInputId = useId();
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [contact?.messages]);

  if (!contact) {
    return (
      <div className="chat-area chat-empty-state">
        <p>Chọn một hội thoại để bắt đầu.</p>
      </div>
    );
  }

  const { hasEscalation, recommendedReplies } = useMemo(() => analyzeChatContext(contact.messages), [contact]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    alert(`${internalNoteMode ? '[INTERNAL NOTE]' : '[GỬI BỆNH NHÂN]'} ${messageText}`);
    setMessageText('');
  };

  const handleSendAndFollowUp = () => {
    if (!messageText.trim()) return;
    alert(`Đã gửi "${messageText}" và TẠO MỚI FOLLOW-UP!`);
    setMessageText('');
  };

  return (
    <div className="chat-area clinical-chat-workspace">
      
      {/* ---------------- HEADER ---------------- */}
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="profile-avatar-sm">{contact.name.charAt(0)}</div>
          <div>
            <h3 className="chat-title flex items-center gap-2">
              {contact.name} <span className="text-sm font-normal text-muted">({contact.id})</span>
            </h3>
            <div className="chat-metadata font-medium text-xs text-muted flex items-center gap-1">
               <span className={`badge ${contact.patientStatus === 'Cần chú ý' ? 'badge-danger' : 'badge-blue'} badge-sm`}>
                 {contact.patientStatus}
               </span>
               <span className="mx-1">•</span>
               <span>BS: {contact.assignedDoctor}</span>
               {contact.waitingTime && (
                 <>
                   <span className="mx-1">•</span>
                   <strong className="text-warning">{contact.waitingTime}</strong>
                 </>
               )}
            </div>
          </div>
        </div>

        <div className="chat-header-actions">
          <button className="btn-icon" aria-label="Ghi ghim">
            <Pin size={20} />
          </button>
          <button className="btn-icon" aria-label="Khác">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* ---------------- CHAT CONTENT ---------------- */}
      <div className="chat-messages">
        
        {/* Triage Card: Refactored to Strict A-B-C */}
        <div className="conversation-triage-card">
           <div className="triage-card-header">
             <h4>Đánh giá nhanh hội thoại</h4>
              <span className={`badge ${contact.priority === 'Cao' ? 'badge-danger' : 'badge-warning'}`}>
                Ưu tiên: {contact.priority || 'Thấp'}
              </span>
           </div>
           
           <div className="triage-card-body">
              <div className="triage-grid">
                <div className="triage-row">
                  <span className="triage-label text-muted">Lý do:</span>
                  <span>{hasEscalation ? 'Phát hiện triệu chứng mới (chóng mặt/mệt mỏi)' : 'Chờ phản hồi thông tin / Theo dõi thường quy'}. {contact.waitingTime}</span>
                </div>
                <div className="triage-row">
                  <span className="triage-label text-muted">Hành động:</span>
                  <ul className="triage-actions-list font-medium">
                     {hasEscalation ? (
                        <>
                          <li className="text-danger flex items-center gap-1"><ArrowRight size={14}/> Yêu cầu bổ sung dữ liệu lâm sàng lập tức</li>
                          <li className="flex items-center gap-1"><ArrowRight size={14}/> Cân nhắc đặt lịch khám</li>
                        </>
                     ) : (
                        <li className="flex items-center gap-1"><ArrowRight size={14}/> Trả lời ngắn ngọn dể đóng hội thoại</li>
                     )}
                  </ul>
                </div>
              </div>
           </div>
        </div>

        {/* Date Divider */}
        <div className="chat-date-divider">
          <span>Hôm nay</span>
        </div>

        {/* Messages Loop */}
        {contact.messages.map((message) => {
          const isInternal = message.sender === 'internal';
          const isMySent = message.sender === 'doctor';
          const wrapperClass = isMySent || isInternal ? 'sent' : 'received';

          return (
            <div key={message.id} className={`message-bubble-wrapper ${wrapperClass}`}>
              <div className={`message-bubble ${isInternal ? 'bubble-internal' : ''}`}>
                {isInternal && (
                  <div className="internal-badge">
                    <Lock size={10} /> Nội bộ - {message.author}
                  </div>
                )}
                <p>{message.text}</p>
                <span className="message-time">{message.time}</span>
              </div>
            </div>
          );
        })}
        
        <div ref={chatBottomRef} />
      </div>

      {/* ---------------- COMPOSER & TEMPLATES ---------------- */}
      <div className="chat-input-area">
        
        {/* Escalation Prompt (Embedded tight to composer) */}
        {hasEscalation && (
          <div className="escalation-alert-box">
             <div className="escalation-alert-header flex items-center gap-2">
                <AlertTriangle size={15} /> <strong>Cảnh báo hội thoại</strong>
             </div>
             <p className="text-sm mt-1 mb-2">Bệnh nhân nhắc đến các từ khóa rủi ro lâm sàng. Không nên chỉ điều chỉnh khẩu phần đơn thuần.</p>
             <div className="escalation-actions flex gap-2">
               <button className="btn-secondary btn-sm" onClick={() => setMessageText('Bạn hãy mô tả rõ triệu chứng này từ bao giờ nhé.')}>Hỏi thêm</button>
               <button className="btn-secondary btn-sm">Đặt lịch khám</button>
               <button className="btn-secondary btn-sm btn-outline-warning text-warning" onClick={() => setInternalNoteMode(true)}>+ Ghi chú nội bộ</button>
             </div>
          </div>
        )}

        {/* Templates - Shortened */}
        <div className="quick-replies pb-2">
          <div className="quick-replies-list" style={{ gap: '0.4rem' }}>
            {recommendedReplies.map((reply) => (
              <button key={reply} className="quick-reply-btn" onClick={() => setMessageText(reply)}>
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Composer */}
        <div className={`input-row ${internalNoteMode ? 'internal-mode-active' : ''}`}>
          <button className="btn-icon text-muted" title={internalNoteMode ? "Tắt ghi chú nội bộ" : "Bật ghi chú nội bộ"} onClick={() => setInternalNoteMode(!internalNoteMode)}>
            <PenTool size={20} className={internalNoteMode ? 'text-warning' : ''} />
          </button>
          
          <button className="btn-icon text-muted" title="Đính kèm">
            <Paperclip size={20} />
          </button>
          
          <input
            id={messageInputId}
            type="text"
            className="chat-text-input"
            placeholder={internalNoteMode ? '[NỘI BỘ] Nhập ghi chú ẩn với bệnh nhân...' : 'Nhập nội dung tư vấn...'}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          
          <div className="composer-actions">
            <button className={`btn-primary btn-send ${internalNoteMode ? 'btn-warning-solid' : ''}`} onClick={handleSend} disabled={!messageText.trim()}>
              <Send size={18} />
            </button>
            {!internalNoteMode && (
              <button className="btn-primary btn-send-action" disabled={!messageText.trim()} onClick={handleSendAndFollowUp} title="Gửi và Tạo Follow-up">
                Gửi & Follow-up
              </button>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}
