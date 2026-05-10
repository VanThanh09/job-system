import React, { useState } from 'react';
import { Video, Send, User, X, CalendarPlus, Clock, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { BsEmojiSmile } from 'react-icons/bs';
import moment from 'moment';
import { authApis, endpoints } from '../../configs/Apis';

// ─── Create Interview Modal ───────────────────────────────────────────────────
const CreateInterviewModal = ({ candidate, onClose, onCreated }) => {
  const tomorrow = moment().add(1, 'day');
  const [form, setForm] = useState({
    title: 'Phỏng vấn',
    start_date: tomorrow.format('YYYY-MM-DD'),
    start_time: '09:00',
    end_time: '10:00',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.title.trim()) return 'Tiêu đề không được để trống.';
    const start = moment(`${form.start_date}T${form.start_time}`);
    const end = moment(`${form.start_date}T${form.end_time}`);
    if (!start.isValid() || !end.isValid()) return 'Thời gian không hợp lệ.';
    if (end.isSameOrBefore(start)) return 'Thời gian kết thúc phải sau thời gian bắt đầu.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    const payload = {
      title: form.title.trim(),
      candidate_id: candidate.id,
      start_time: moment(`${form.start_date}T${form.start_time}`).toISOString(),
      end_time: moment(`${form.start_date}T${form.end_time}`).toISOString(),
    };

    try {
      setSubmitting(true);
      setError('');
      await authApis().post(endpoints['my_interviews'], payload);
      setSuccess(true);
      setTimeout(() => {
        onCreated?.();
        onClose();
      }, 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        'Tạo lịch phỏng vấn thất bại. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="iv-modal-backdrop" onClick={onClose}>
      <div className="iv-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="iv-modal-header">
          <div className="iv-modal-title">
            <CalendarPlus size={20} />
            <span>Tạo lịch phỏng vấn</span>
          </div>
          <button className="iv-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Candidate badge */}
        <div className="iv-modal-candidate">
          <div className="iv-candidate-avatar">
            {candidate?.avatar
              ? <img src={candidate.avatar} alt="" className="avatar-img" />
              : <User size={16} />}
          </div>
          <div className="iv-candidate-info">
            <span className="iv-candidate-name">
              {candidate?.first_name} {candidate?.last_name}
            </span>
            <span className="iv-candidate-label">Ứng viên</span>
          </div>
        </div>

        {/* Form */}
        <form className="iv-modal-form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="iv-form-group">
            <label htmlFor="iv-title">Tiêu đề cuộc phỏng vấn</label>
            <input
              id="iv-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="VD: Phỏng vấn Frontend Dev"
              disabled={submitting}
            />
          </div>

          {/* Date */}
          <div className="iv-form-group">
            <label htmlFor="iv-date">Ngày phỏng vấn</label>
            <input
              id="iv-date"
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChange}
              min={moment().format('YYYY-MM-DD')}
              disabled={submitting}
            />
          </div>

          {/* Time row */}
          <div className="iv-form-row">
            <div className="iv-form-group">
              <label htmlFor="iv-start">
                <Clock size={13} /> Bắt đầu
              </label>
              <input
                id="iv-start"
                name="start_time"
                type="time"
                value={form.start_time}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
            <div className="iv-form-group">
              <label htmlFor="iv-end">
                <Clock size={13} /> Kết thúc
              </label>
              <input
                id="iv-end"
                name="end_time"
                type="time"
                value={form.end_time}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Payload preview (read-only hint) */}
          <div className="iv-payload-preview">
            <div className="iv-form-group"> <label htmlFor="iv-title">Thời gian</label></div>
            <code>
              {moment(`${form.start_date}T${form.start_time}`).format('HH:mm DD/MM/YYYY')}
              {' → '}
              {moment(`${form.start_date}T${form.end_time}`).format('HH:mm')}
            </code>
          </div>

          {/* Error */}
          {error && (
            <div className="iv-form-error">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="iv-form-success">
              <CheckCircle size={14} />
              Tạo lịch thành công!
            </div>
          )}

          {/* Actions */}
          <div className="iv-modal-actions">
            <button type="button" className="iv-btn-cancel" onClick={onClose} disabled={submitting}>
              Hủy
            </button>
            <button type="submit" className="iv-btn-submit" disabled={submitting || success}>
              {submitting
                ? <><Loader size={14} className="spin" /> Đang tạo…</>
                : success
                  ? <><CheckCircle size={14} /> Đã tạo</>
                  : <><CalendarPlus size={14} /> Tạo lịch</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── ChatScreen ───────────────────────────────────────────────────────────────
const ChatScreen = ({
  activeChat,
  isNew,
  receiverUser,
  messages,
  user,
  inputValue,
  loadingMore,
  messagesAreaRef,
  onScroll,
  onInputChange,
  onSendMessage,
  onInterviewCreated,
}) => {
  const [showModal, setShowModal] = useState(false);

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = moment(isoString);
    if (moment().isSame(date, 'day')) return date.format('HH:mm');
    return date.format('DD/MM/YYYY');
  };

  // Người dùng hiển thị trên header
  const headerUser = isNew ? receiverUser : activeChat?.order_user;

  // Candidate là người kia trong cuộc trò chuyện
  const candidate = headerUser;

  if (!activeChat && !isNew) {
    return (
      <div className="chatv2-main">
        <div className="h-100 d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <BsEmojiSmile size={48} className="mb-3 text-mute" />
            <h5>Chọn đoạn chat để bắt đầu chat</h5>
            <p>Chọn đoạn chat ở thanh điều hướng bên trái màn hình</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chatv2-main">
      {/* Header */}
      <div className="chatv2-main-header">
        <div className="chatv2-header-user">
          <div className="chatv2-avatar-medium">
            {headerUser?.avatar ? (
              <img
                src={headerUser.avatar}
                alt={`${headerUser.first_name} ${headerUser.last_name}`}
                className="avatar-img"
              />
            ) : (
              <User size={20} />
            )}
          </div>
          <div className="chatv2-header-info">
            <h4>{headerUser?.first_name + ' ' + headerUser?.last_name}</h4>
          </div>
        </div>

        <div className="chatv2-header-actions">
          <button
            className="chatv2-icon-btn iv-schedule-btn"
            title="Tạo lịch phỏng vấn"
            onClick={() => setShowModal(true)}
          >
            <CalendarPlus size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chatv2-messages-area" ref={messagesAreaRef} onScroll={onScroll}>
        {loadingMore && (
          <div className="text-center my-2">
            <small className="text-muted">Đang tải...</small>
          </div>
        )}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`chatv2-message-wrapper ${msg.sender?.id === user.id ? 'mine' : 'theirs'}`}
          >
            {msg.sender?.id !== user.id && (
              <div className="chatv2-avatar-small">
                {msg.sender?.avatar ? (
                  <img src={msg.sender.avatar} className="avatar-img" alt="" />
                ) : (
                  <User size={20} />
                )}
              </div>
            )}
            <div className="chatv2-message-bubble">
              <div className="chatv2-message-text">{msg.content}</div>
              <div className="chatv2-message-time">{formatTime(msg.created_at)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="chatv2-input-area">
        <form onSubmit={onSendMessage} className="chatv2-input-form">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={inputValue}
            onChange={onInputChange}
            autoFocus
          />
          <button type="submit" className="chatv2-send-btn" disabled={!inputValue.trim()}>
            <Send size={20} />
          </button>
        </form>
      </div>

      {/* Create Interview Modal */}
      {showModal && candidate && (
        <CreateInterviewModal
          candidate={candidate}
          onClose={() => setShowModal(false)}
          onCreated={onInterviewCreated}
        />
      )}
    </div>
  );
};

export default ChatScreen;
