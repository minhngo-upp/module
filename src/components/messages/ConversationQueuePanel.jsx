import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Search, MessageSquarePlus, Pin, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ConversationQueuePanel({ conversations, activeChatId, onSelectChat }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, URGENT, WAITING, FOLLOWING
  
  const filterScrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (filterScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = filterScrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollFilters = (dir) => {
    if (filterScrollRef.current) {
      filterScrollRef.current.scrollBy({ left: dir === 'left' ? -150 : 150, behavior: 'smooth' });
      setTimeout(checkScroll, 300); // re-check after smooth scroll
    }
  };

  const filtered = useMemo(() => {
    let result = conversations;

    if (filter === 'UNREAD') {
      result = result.filter((c) => c.unread > 0);
    } else if (filter === 'WAITING') {
      result = result.filter((c) => c.waitingTime);
    } else if (filter === 'URGENT') {
      result = result.filter((c) => c.priority === 'Cao' || c.label === 'Cảnh báo');
    } else if (filter === 'FOLLOWING') {
      result = result.filter((c) => c.patientStatus === 'Đang theo dõi');
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        [c.name, c.id, c.patientStatus].some((val) => val && val.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [conversations, search, filter]);

  const FilterButton = ({ label, value, active }) => (
    <button
      className={`queue-filter-chip ${active ? 'active' : ''}`}
      onClick={() => setFilter(value)}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <div className="conversations-sidebar">
      <div className="conversations-header">
        <div className="messages-title-row">
          <h2>Tin nhắn</h2>
          <button className="btn-icon" type="button" title="Tạo hội thoại mới">
            <MessageSquarePlus size={18} />
          </button>
        </div>

        <div className="search-bar chat-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm theo Mã BN, tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="conversations-filters-wrapper">
        {showLeftArrow && (
          <button className="filter-scroll-btn left" onClick={() => scrollFilters('left')}>
            <ChevronLeft size={16} />
          </button>
        )}

        <div className="conversations-filters" ref={filterScrollRef} onScroll={checkScroll}>
          <FilterButton label="Tất cả" value="ALL" active={filter === 'ALL'} />
          <FilterButton label="Cần chú ý" value="URGENT" active={filter === 'URGENT'} />
          <FilterButton label="Chờ phản hồi" value="WAITING" active={filter === 'WAITING'} />
          <FilterButton label="Chưa đọc" value="UNREAD" active={filter === 'UNREAD'} />
          <FilterButton label="Đang theo dõi" value="FOLLOWING" active={filter === 'FOLLOWING'} />
        </div>

        {showRightArrow && (
          <button className="filter-scroll-btn right" onClick={() => scrollFilters('right')}>
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      <div className="conversations-list flex-1 overflow-y-auto">
        {filtered.map((chat) => {
           // Refined hierarchy logic
           const isUrgent = chat.priority === 'Cao' || chat.label === 'Cảnh báo';
           
           return (
            <button
              type="button"
              key={chat.id}
              className={`conversation-item ${activeChatId === chat.id ? 'active' : ''} ${isUrgent ? 'urgent-item' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="chat-avatar">
                {chat.name.charAt(0)}
                {chat.unread > 0 && <span className="unread-dot-minimal"></span>}
              </div>

              <div className="chat-info">
                <div className="chat-info-top">
                  <h4 className={`chat-name ${chat.unread > 0 ? 'text-bold' : ''}`}>{chat.name}</h4>
                  <span className="chat-time">{chat.time}</span>
                </div>

                <div className="chat-info-middle">
                  <span className="chat-patient-id">{chat.id}</span>
                  
                  {/* Strict Hierarchy Badges: 1 Main (Urgent), 1 Sub (SLA), 1 Context (Flow) */}
                  <div className="chat-tags-small">
                    {/* Main Priority Badge */}
                    {isUrgent && (
                      <span className="badge badge-danger flex items-center gap-1 font-bold">
                        <AlertCircle size={10} /> Cảnh báo
                      </span>
                    )}

                    {/* Sub SLA Badge */}
                    {chat.waitingTime && !isUrgent && (
                      <span className="badge badge-warning text-xs">
                        {chat.waitingTime}
                      </span>
                    )}
                    
                    {/* Flow Label */}
                    {!isUrgent && chat.label !== 'Cảnh báo' && (
                       <span className="badge badge-blue text-xs opacity-80">{chat.label}</span>
                    )}
                  </div>
                </div>

                <div className="chat-info-bottom">
                  <p className={`chat-last-msg ${chat.unread > 0 ? 'font-bold text-main' : ''}`}>
                    {chat.lastMsg}
                  </p>
                  {chat.pinned && <Pin size={14} className="text-muted" />}
                </div>
              </div>
            </button>
          )
        })}

        {filtered.length === 0 && (
          <p className="messages-empty">Không tìm thấy hội thoại nào phù hợp.</p>
        )}
      </div>
    </div>
  );
}
