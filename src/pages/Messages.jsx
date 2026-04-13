import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { messageConversationsMock } from '../mockData';
import './Messages.css';

import ConversationQueuePanel from '../components/messages/ConversationQueuePanel';
import ChatWorkspace from '../components/messages/ChatWorkspace';
import PatientActionPanel from '../components/messages/PatientActionPanel';

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedChatId = searchParams.get('patientId');

  // Fallback to the first item if none is selected
  const [selectedChatId, setSelectedChatId] = useState(
    requestedChatId || messageConversationsMock[0]?.id || ''
  );

  const handleSelectChat = (id) => {
    setSelectedChatId(id);
    setSearchParams({ patientId: id });
  };

  const activeContact = messageConversationsMock.find(c => c.id === selectedChatId);

  return (
    <div className="messages-page clinical-messaging-layout">
      {/* 
        This wrapper holds the robust CSS grid 
        defining the 3-column clinical workflow.
      */}
      <div className="messages-layout card">
        
        {/* COLUMN 1: Triage Queue */}
        <ConversationQueuePanel 
          conversations={messageConversationsMock}
          activeChatId={selectedChatId}
          onSelectChat={handleSelectChat}
        />

        {/* COLUMN 2: Workspace & Triage Actions */}
        <ChatWorkspace 
          contact={activeContact} 
        />

        {/* COLUMN 3: Clinical Context & Actions (Right side Info) */}
        <PatientActionPanel 
          patient={activeContact} 
        />

      </div>
    </div>
  );
}
