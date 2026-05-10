import React, { useState } from 'react';
import {
  Video, Calendar, Clock, User, Loader, RefreshCw, ExternalLink,
  CheckCircle, XCircle, AlertCircle, X,
} from 'lucide-react';
import moment from 'moment';
import 'moment/locale/vi';
import { useNavigate } from 'react-router-dom';
import { authApis, endpoints } from '../../configs/Apis';

moment.locale('vi');

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING: {
    label: 'Sắp diễn ra',
    color: '#4f46e5',
    bg: '#eef2ff',
    Icon: AlertCircle,
    cardClass: 'status-upcoming',
  },
  ONGOING: {
    label: 'Đang diễn ra',
    color: '#059669',
    bg: '#d1fae5',
    Icon: Video,
    cardClass: 'status-ongoing',
  },
  DONE: {
    label: 'Đã kết thúc',
    color: '#6b7280',
    bg: '#f3f4f6',
    Icon: CheckCircle,
    cardClass: 'status-done',
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: '#ef4444',
    bg: '#fee2e2',
    Icon: XCircle,
    cardClass: 'status-cancelled',
  },
};

const FILTER_TABS = ['Tất cả', 'Sắp diễn ra', 'Đang diễn ra', 'Đã kết thúc'];
const TAB_STATUS_MAP = {
  'Sắp diễn ra': 'PENDING',
  'Đang diễn ra': 'ONGOING',
  'Đã kết thúc': 'DONE',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (iso) => (iso ? moment(iso).format('HH:mm - DD/MM/YYYY') : '—');

const calcDuration = (start, end) => {
  if (!start || !end) return null;
  const mins = moment(end).diff(moment(start), 'minutes');
  return mins > 0 ? mins : null;
};

// ─── Join Error Modal ──────────────────────────────────────────────────────────
const JoinErrorModal = ({ message, onClose }) => (
  <div className="iv-modal-backdrop" onClick={onClose}>
    <div className="iv-join-error-modal" onClick={(e) => e.stopPropagation()}>
      <div className="iv-join-error-icon">
        <AlertCircle size={32} />
      </div>
      <h4 className="iv-join-error-title">Không thể tham gia</h4>
      <p className="iv-join-error-message">{message}</p>
      <button className="iv-join-error-btn" onClick={onClose}>
        Đã hiểu
      </button>
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
const InterviewPanel = ({ interviews = [], loading = false, onRefresh, currentUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [joiningId, setJoiningId] = useState(null);   // id of interview being joined
  const [errorMsg, setErrorMsg] = useState('');        // join error message

  const filtered =
    activeTab === 'Tất cả'
      ? interviews
      : interviews.filter((i) => i.status === TAB_STATUS_MAP[activeTab]);

  // ── Call /interviews/{id}/join/ then navigate ─────────────────────────────
  const handleJoin = async (e, interview) => {
    e.stopPropagation();
    if (joiningId) return;

    try {
      setJoiningId(interview.id);
      const res = await authApis().post(endpoints['join_interview'](interview.id));
      const { meeting_link, room_name, status } = res.data;

      // Navigate to InterviewPage with room details in state
      navigate('/interview', {
        state: {
          roomUrl: meeting_link,
          roomName: room_name,
          interviewStatus: status,
          interviewTitle: interview.title,
          userName: currentUser
            ? `${currentUser.first_name} ${currentUser.last_name}`.trim()
            : 'Người dùng',
        },
      });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        'Không thể tham gia phòng. Vui lòng thử lại.';
      setErrorMsg(msg);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="interview-panel">
      {/* Header */}
      <div className="interview-panel-header">
        <div className="interview-panel-title">
          <Calendar size={18} />
          <span>Danh sách cuộc họp của bạn</span>
        </div>
        <button
          className="interview-panel-refresh-btn"
          onClick={onRefresh}
          disabled={loading}
          title="Làm mới"
        >
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
        </button>
      </div>

      {/* Tabs */}
      <div className="interview-panel-tabs">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            className={`interview-panel-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="interview-panel-list">
        {loading ? (
          <div className="interview-panel-empty">
            <Loader size={20} className="spin" />
            <span>Đang tải…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="interview-panel-empty">
            <Calendar size={28} strokeWidth={1.5} />
            <span>Không có cuộc họp nào</span>
          </div>
        ) : (
          filtered.map((interview) => {
            const cfg = STATUS_CONFIG[interview.status] ?? STATUS_CONFIG.PENDING;
            const { Icon } = cfg;
            const duration = calcDuration(interview.start_time, interview.end_time);
            const isOngoing = interview.status === 'ONGOING';
            const isPending = interview.status === 'PENDING';
            const canJoin = isOngoing || isPending;
            const isThisJoining = joiningId === interview.id;

            return (
              <div
                key={interview.id}
                className={`interview-card ${cfg.cardClass}`}
              >
                {/* Card Top */}
                <div className="interview-card-top">
                  <span
                    className="interview-status-badge"
                    style={{ color: cfg.color, backgroundColor: cfg.bg }}
                  >
                    <Icon size={11} />
                    {cfg.label}
                  </span>
                  {duration && (
                    <span className="interview-duration">{duration} phút</span>
                  )}
                </div>

                {/* Title */}
                <h4 className="interview-card-title">{interview.title}</h4>

                {/* Meta */}
                <div className="interview-card-meta">
                  <span>
                    <User size={11} />
                    {interview.host?.first_name} {interview.host?.last_name}
                  </span>
                  <span>
                    <Clock size={11} />
                    {formatTime(interview.start_time)}
                  </span>
                </div>

                {/* Footer */}
                <div className="interview-card-footer">
                  {canJoin ? (
                    <button
                      className={`interview-join-btn ${isPending ? 'pending' : 'ongoing'}`}
                      onClick={(e) => handleJoin(e, interview)}
                      disabled={!!joiningId}
                    >
                      {isThisJoining ? (
                        <><Loader size={12} className="spin" /> Đang tải…</>
                      ) : (
                        <><ExternalLink size={12} /> Tham gia ngay</>
                      )}
                    </button>
                  ) : (
                    <span className="interview-done-label">
                      {STATUS_CONFIG[interview.status]?.label ?? ''}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Join Error Modal */}
      {errorMsg && (
        <JoinErrorModal
          message={errorMsg}
          onClose={() => setErrorMsg('')}
        />
      )}
    </div>
  );
};

export default InterviewPanel;
