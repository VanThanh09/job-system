import { ListGroup } from 'react-bootstrap';

const formatTime = (date) => {
    if (!date) return '';

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    } else if (days === 1) {
        return 'Hôm qua';
    } else if (days < 7) {
        return date.toLocaleDateString('vi-VN', { weekday: 'short' });
    } else {
        return date.toLocaleDateString('vi-VN', {
            month: 'short',
            day: 'numeric'
        });
    }
};

const ConversationsBar = ({ conversations, chatId, setChatId, setReceiverUser }) => {
    return (
        <div className="h-100 d-flex flex-column border-end">
            <div className="p-3 border-bottom">
                <h5 className="mb-0">Đoạn hội thoại</h5>
            </div>

            <div className="flex-grow-1 overflow-auto">
                <ListGroup variant="flush">
                    {conversations.map((c) => (
                        <ListGroup.Item
                            key={c.id}
                            action
                            onClick={() => {
                                setChatId(c.id)
                                setReceiverUser(c.receiverUser)
                            }}
                            className={`border-0 py-3 ${chatId === c.id ? 'bg-success bg-opacity-10 border-end border-success border-4' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="d-flex align-items-center">
                                <div className="position-relative me-3">
                                    <img
                                        src={c.receiverUser.avatar}
                                        alt={c.receiverUser.first_name}
                                        className="rounded-circle"
                                        width="50"
                                        height="50"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>

                                <div className="flex-grow-1 min-width-0">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h6 className="mb-0 text-truncate">{c.receiverUser.last_name}  {c.receiverUser.first_name}</h6>
                                        <small className="text-muted">
                                            {formatTime(c?.updateAt)}
                                        </small>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <p className="mb-0 text-muted text-truncate small">
                                            {c.lastMsg}
                                        </p>
                                        {/* {contact.unreadCount > 0 && (
                                            <Badge bg="primary" pill className="ms-2">
                                                {contact.unreadCount}
                                            </Badge>
                                        )} */}
                                    </div>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </div>
    );
};

export default ConversationsBar;