import React from 'react';
import { User } from 'lucide-react';
import moment from 'moment';

const ConversationSidebar = ({ conversations, activeChat, onSelectChat }) => {
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = moment(isoString);
    if (moment().isSame(date, 'day')) return date.format('HH:mm');
    return date.format('DD/MM/YYYY');
  };

  return (
    <div className="chatv2-sidebar">
      <div className="chatv2-sidebar-header">
        <h3>Tin nhắn</h3>
      </div>
      <div className="chatv2-conversation-list">
        {conversations.map(conv => (
          <div
            key={conv.id}
            className={`chatv2-conversation-item ${activeChat?.id === conv.id ? 'active' : ''}`}
            onClick={() => onSelectChat(conv)}
          >
            <div className="chatv2-avatar">
              {conv.order_user?.avatar ? (
                <img
                  src={conv.order_user.avatar}
                  alt={`${conv.order_user.first_name} ${conv.order_user.last_name}`}
                  className="avatar-img"
                />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="chatv2-conv-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="chatv2-conv-name" style={{ marginBottom: 0 }}>
                  {conv.order_user?.first_name + ' ' + conv.order_user?.last_name}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '6px', whiteSpace: 'nowrap' }}>
                  {formatTime(conv.updated_at)}
                </span>
              </div>
              <span className="chatv2-conv-lastmsg" style={{ marginTop: '4px' }}>{conv.last_msg}</span>
            </div>
            {conv.unread > 0 && <span className="chatv2-unread-badge">{conv.unread}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationSidebar;
