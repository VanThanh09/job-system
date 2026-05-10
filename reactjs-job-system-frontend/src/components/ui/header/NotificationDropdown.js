import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { Nav, Card, ListGroup, Badge } from 'react-bootstrap';
import { BsBell, BsBellFill } from 'react-icons/bs';
import { IoClose, IoInformationCircle, IoWarning } from 'react-icons/io5';
import './NotificationDropdown.css';
import { authApis, endpoints } from '../../../configs/Apis';
import { MyUserContext } from '../../../configs/MyContexts';

const NotificationDropdown = () => {
    const [showNoti, setShowNoti] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [user,] = useContext(MyUserContext);

    // Sample notifications data
    const [notifications, setNotifications] = useState([]);

    const loadNoti = useCallback(async () => {
        try {
            let res = await authApis().get(endpoints['myNotis']);
            if (res.status === 200) {
                setNotifications(res.data);
                setUnreadCount(res.data.filter(n => !n.is_read).length);
            }
        } catch (ex) {
            console.log("Lỗi tải notifications: ", ex);
        } finally {
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            loadNoti();
        }
    }, [loadNoti]);

    // Handle click outside to close notification
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowNoti(false);
            }
        };

        if (showNoti) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNoti]);

    const calculatePostedDaysAgo = (createdAt) => {
        const createdDate = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - createdDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Toggle notification dropdown
    const toggleNotification = () => {
        setShowNoti(!showNoti);
    };

    // Mark notification as read
    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => prev - 1);
        try {
            let res = authApis().post(endpoints['readNoti'](id));
        } catch (ex) {
            console.log("Lỗi đọc noti: ", ex);
        } finally {
        }
    };

    // Clear all notifications
    const viewAllNotifications = () => {

    };

    // const unreadCount = notifications.filter(n => n.isRead).length;

    return (
        <Nav className="position-relative notification-container">
            {/* Notification Bell Button */}
            <Nav.Link
                ref={buttonRef}
                onClick={toggleNotification}
                className="notification-bell position-relative"
                style={{ cursor: 'pointer' }}
            >
                {showNoti ? <BsBell size={22} /> : <BsBellFill size={22} />}
                {unreadCount > 0 && user && (
                    <Badge
                        bg="danger"
                        pill
                        className="position-absolute notification-badge"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                )}
            </Nav.Link>

            {/* Notification Dropdown */}
            {showNoti && (
                <div
                    ref={dropdownRef}
                    className={`notification-dropdown ${showNoti ? 'show' : ''}`}
                >
                    <Card className="shadow-lg border-0">
                        <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <BsBell className="me-2" />
                                <span className="fw-bold">Thông báo</span>
                                {unreadCount > 0 && user && (
                                    <Badge bg="light" text="success" className="ms-2">
                                        {unreadCount} mới
                                    </Badge>
                                )}
                            </div>
                            <button
                                className="btn btn-sm text-white p-0"
                                onClick={() => setShowNoti(false)}
                                style={{ background: 'none', border: 'none' }}
                            >
                                <IoClose size={20} />
                            </button>
                        </Card.Header>

                        <div className="notification-body">
                            {!user ?
                                <div className="text-center p-4 text-muted">
                                    <BsBell size={48} className="mb-3 opacity-25" />
                                    <p className="mb-0">Vui lòng đăng nhập để xem thông báo</p>
                                </div>
                                :
                                notifications.length === 0 ? (
                                    <div className="text-center p-4 text-muted">
                                        <BsBell size={48} className="mb-3 opacity-25" />
                                        <p className="mb-0">Không có thông báo nào</p>
                                    </div>
                                ) : (
                                    <ListGroup variant="flush">
                                        {notifications.map((notification) => (
                                            <ListGroup.Item
                                                key={notification.id}
                                                className={`notification-item ${!notification.is_read ? 'unread' : 'read'}`}
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                <div className="d-flex align-items-start">
                                                    <IoInformationCircle className="text-info me-2 mt-1" />
                                                    <div className="flex-grow-1">
                                                        <div className="notification-text mb-1">
                                                            {notification.title}
                                                        </div>
                                                        <div className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>
                                                            {notification.content.length > 50 ? `${notification.content.slice(0, 50)}...` : notification.content}
                                                        </div>
                                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                            {calculatePostedDaysAgo(notification.created_at)} ngày trước
                                                        </small>
                                                    </div>
                                                    {!notification.is_read && (
                                                        <div className="unread-indicator"></div>
                                                    )}
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )
                            }

                        </div>

                        {notifications.length > 0 && (
                            <Card.Footer className="bg-light text-center">
                                <button
                                    className="btn btn-link btn-sm text-decoration-none"
                                    onClick={viewAllNotifications}
                                >
                                    Xem tất cả
                                </button>
                            </Card.Footer>
                        )}
                    </Card>
                </div>
            )}
        </Nav>
    );
};

export default NotificationDropdown;