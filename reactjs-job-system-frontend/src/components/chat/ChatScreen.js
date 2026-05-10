import { useEffect, useRef, useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { BsSend, BsEmojiSmile } from 'react-icons/bs';
import { sendMsg } from '../../services/serviceChat';

const ChatScreen = ({ receiverUser, messages, myId }) => {
    const [messageText, setMessageText] = useState('');

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (messageText.trim() === '') return;
        try {
            setMessageText('');
            await sendMsg(myId, receiverUser.id, messageText);
        } catch (ex) {
            console.log(ex);
        }
    };

    const formatTime = (dateInput) => {
        const date = new Date(dateInput);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // 24h
            });
        } else if (days === 1) {
            return 'Hôm qua';
        } else if (days < 7) {
            return date.toLocaleDateString('vi-VN', { weekday: 'long' });
        } else {
            return date.toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'short'
            });
        }
    };

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    if (!receiverUser) {
        return (
            <div className="h-100 d-flex align-items-center justify-content-center">
                <div className="text-center text-muted">
                    <BsEmojiSmile size={48} className="mb-3 text-success" />
                    <h5>Chọn đoạn chat để bắt đầu chat</h5>
                    <p>Chọn đoạn chat ở thanh điều hướng bên trái màn hình</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-100 d-flex flex-column">
            {/* Chat Header */}
            <div className="border-bottom p-3">
                <div className="d-flex align-items-center">
                    <div className="position-relative me-3 d-flex gap-3 align-items-center">
                        <img
                            src={receiverUser.avatar}
                            alt={receiverUser.first_name}
                            className="rounded-circle"
                            width="40"
                            height="40"
                            style={{ objectFit: 'cover' }}
                        />
                        <div style={{ fontWeight: '500' }}>{receiverUser.last_name} {receiverUser.first_name}</div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto' }} className="p-3" ref={chatContainerRef}>
                <div className="d-flex flex-column gap-3" >
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`d-flex ${message.senderId === myId ? 'justify-content-end' : 'justify-content-start'
                                }`}
                        >
                            <Card
                                className={`border-0 shadow-sm ${message.senderId === myId
                                    ? 'bg-success text-white'
                                    : 'bg-white border'
                                    }`}
                                style={{
                                    maxWidth: '75%',
                                    borderRadius: message.senderId === myId ? '1.2rem 1.2rem 0 1.2rem' : '1.2rem 1.2rem 1.2rem 0'
                                }}
                            >
                                <Card.Body className="py-2 px-3">
                                    <p className="mb-1">{message.text}</p>
                                    <small
                                        className={`${message.senderId === myId
                                            ? 'text-white-50'
                                            : 'text-muted'
                                            }`}
                                    >
                                        {formatTime(message.createdAt?.toDate?.())}
                                    </small>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message Input */}
            <div className="border-top p-3">
                <Form onSubmit={handleSendMessage}>
                    <InputGroup>
                        <Form.Control
                            placeholder={`Gửi tin nhắn đến ${receiverUser.first_name}...`}
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                        />
                        <Button
                            variant="success"
                            type="submit"
                            disabled={!messageText.trim()}
                        >
                            <BsSend />
                        </Button>
                    </InputGroup>
                </Form>
            </div>
        </div>
    );
};

export default ChatScreen;