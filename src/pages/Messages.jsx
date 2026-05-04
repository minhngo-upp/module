import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { messageConversationsMock } from '../mockData';
import './Messages.css';

import ConversationQueuePanel from '../components/messages/ConversationQueuePanel';
import ChatWorkspace from '../components/messages/ChatWorkspace';
import PatientActionPanel from '../components/messages/PatientActionPanel';

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedChatId = searchParams.get('patientId');
  const [conversations, setConversations] = useState(messageConversationsMock);
  const [toastMessage, setToastMessage] = useState('');

  // Fallback to the first item if none is selected
  const [fallbackSelectedChatId, setFallbackSelectedChatId] = useState(
    messageConversationsMock.some((conversation) => conversation.id === requestedChatId)
      ? requestedChatId
      : messageConversationsMock[0]?.id || ''
  );
  const selectedChatId = conversations.some((conversation) => conversation.id === requestedChatId)
    ? requestedChatId
    : fallbackSelectedChatId;

  const handleSelectChat = (id) => {
    setFallbackSelectedChatId(id);
    setSearchParams({ patientId: id });
  };

  const activeContact = conversations.find(c => c.id === selectedChatId);

  const showToast = (message) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(''), 2800);
  };

  const handleSendMessage = ({ text, isInternal, createFollowUp }) => {
    if (!activeContact || !text.trim()) return;
    const nextMessage = {
      id: Date.now(),
      sender: isInternal ? 'internal' : 'doctor',
      text: text.trim(),
      time: 'Bây giờ',
      author: isInternal ? 'BS. Nguyễn Văn A' : undefined,
    };

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeContact.id
          ? {
              ...conversation,
              lastMsg: isInternal ? `Ghi chú nội bộ: ${text.trim()}` : text.trim(),
              time: 'Bây giờ',
              unread: 0,
              messages: [...conversation.messages, nextMessage],
            }
          : conversation,
      ),
    );
    showToast(isInternal ? 'Đã lưu ghi chú nội bộ' : 'Đã gửi tin nhắn');

    if (createFollowUp) navigate(`/appointments?create=1&patientId=${activeContact.id}`);
  };

  const handleSchedule = (patientId) => {
    navigate(`/appointments?create=1&patientId=${patientId}`);
  };

  return (
    <div className="messages-page clinical-messaging-layout">
      {toastMessage ? (
        <div className="messages-toast" role="status" aria-live="polite">{toastMessage}</div>
      ) : null}
      {/* 
        This wrapper holds the robust CSS grid 
        defining the 3-column clinical workflow.
      */}
      <div className="messages-layout card">
        
        {/* COLUMN 1: Triage Queue */}
        <ConversationQueuePanel 
          conversations={conversations}
          activeChatId={selectedChatId}
          onSelectChat={handleSelectChat}
        />

        {/* COLUMN 2: Workspace & Triage Actions */}
        <ChatWorkspace 
          contact={activeContact} 
          onSchedule={handleSchedule}
          onSendMessage={handleSendMessage}
        />

        {/* COLUMN 3: Clinical Context & Actions (Right side Info) */}
        <PatientActionPanel 
          patient={activeContact} 
        />

      </div>
    </div>
  );
}
