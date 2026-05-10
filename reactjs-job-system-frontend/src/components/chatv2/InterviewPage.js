import React, { useState, useEffect, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { useLocation, useNavigate } from 'react-router-dom';

// ============================================================
// HƯỚNG DẪN SỬ DỤNG:
// 1. Đăng ký tài khoản miễn phí tại: https://dashboard.daily.co/signup
// 2. Vào Dashboard → Rooms → Create Room
// 3. Copy URL phòng (dạng: https://your-name.daily.co/room-name)
// 4. Thay DAILY_ROOM_URL bên dưới bằng URL của bạn
// ============================================================

const InterviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state ?? {};

    const roomUrl = state.roomUrl;
    const userName = state.userName ?? 'Người dùng';
    const interviewTitle = state.interviewTitle ?? 'Phỏng vấn trực tuyến';
    const [callState, setCallState] = useState('idle'); // idle | joining | joined | left | error
    const [errorMessage, setErrorMessage] = useState('');
    const callFrameRef = useRef(null);
    const containerRef = useRef(null);

    // Dọn dẹp khi unmount
    useEffect(() => {
        return () => {
            if (callFrameRef.current) {
                callFrameRef.current.destroy();
                callFrameRef.current = null;
            }
        };
    }, []);

    const joinMeeting = async () => {
        try {
            setCallState('joining');

            // Tạo iframe Daily.co
            const frame = DailyIframe.createFrame(containerRef.current, {
                url: roomUrl,
                showLeaveButton: true,
                showFullscreenButton: true,
                iframeStyle: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '12px',
                },
            });

            callFrameRef.current = frame;

            // Lắng nghe sự kiện
            frame
                .on('joined-meeting', (event) => {
                    console.log('Đã vào cuộc họp:', event);
                    setCallState('joined');
                })
                .on('left-meeting', (event) => {
                    console.log('Đã rời cuộc họp:', event);
                    setCallState('left');
                    frame.destroy();
                    callFrameRef.current = null;
                })
                .on('error', (event) => {
                    console.error('Lỗi Daily.co:', event);
                    setCallState('error');
                    setErrorMessage(event.errorMsg || 'Đã có lỗi xảy ra khi kết nối.');
                });

            // Tham gia phòng với tên người dùng
            await frame.join({ userName });

        } catch (err) {
            console.error('Lỗi khi tham gia:', err);
            setCallState('error');
            setErrorMessage(err.message || 'Không thể kết nối. Vui lòng kiểm tra URL phòng.');
        }
    };

    const leaveMeeting = () => {
        if (callFrameRef.current) {
            callFrameRef.current.leave();
        }
    };

    const resetMeeting = () => {
        setCallState('idle');
        setErrorMessage('');
    };

    return (
        <div style={styles.wrapper}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.dot} />
                    <span style={styles.headerTitle}>{interviewTitle}</span>
                </div>
                <div style={styles.headerLeft}>
                    {callState === 'joined' && (
                        <button onClick={leaveMeeting} style={styles.leaveBtn}>
                            ✕ Rời cuộc họp
                        </button>
                    )}
                    <button onClick={() => navigate(-1)} style={styles.backBtn}>
                        ← Quay lại
                    </button>
                </div>
            </div>

            {/* Màn hình chờ */}
            {callState === 'idle' && (
                <div style={styles.centerBox}>
                    <div style={styles.iconWrap}>🎥</div>
                    <h2 style={styles.title}>Sẵn sàng tham gia phỏng vấn?</h2>
                    <p style={styles.subtitle}>
                        Đảm bảo camera và microphone của bạn hoạt động bình thường trước khi vào.
                    </p>
                    <button onClick={joinMeeting} style={styles.joinBtn}>
                        Tham gia ngay
                    </button>
                    <p style={styles.hint}>
                        Powered by <a href="https://daily.co" target="_blank" rel="noreferrer" style={styles.link}>Daily.co</a> • Miễn phí, không cần đăng nhập
                    </p>
                </div>
            )}

            {/* Đang kết nối */}
            {callState === 'joining' && (
                <div style={styles.centerBox}>
                    <div style={styles.spinner} />
                    <p style={styles.subtitle}>Đang kết nối vào phòng họp...</p>
                </div>
            )}

            {/* Sau khi rời */}
            {callState === 'left' && (
                <div style={styles.centerBox}>
                    <div style={styles.iconWrap}>👋</div>
                    <h2 style={styles.title}>Bạn đã rời cuộc họp</h2>
                    <p style={styles.subtitle}>Cảm ơn bạn đã tham gia buổi phỏng vấn.</p>
                    <button onClick={resetMeeting} style={styles.joinBtn}>
                        Quay lại
                    </button>
                </div>
            )}

            {/* Lỗi */}
            {callState === 'error' && (
                <div style={styles.centerBox}>
                    <div style={styles.iconWrap}>⚠️</div>
                    <h2 style={{ ...styles.title, color: '#ef4444' }}>Lỗi kết nối</h2>
                    <p style={{ ...styles.subtitle, color: '#fca5a5' }}>{errorMessage}</p>
                    <button onClick={resetMeeting} style={styles.joinBtn}>
                        Thử lại
                    </button>
                </div>
            )}

            {/* Container Daily iframe (luôn mount, ẩn khi không dùng) */}
            <div
                ref={containerRef}
                style={{
                    ...styles.videoContainer,
                    display: callState === 'joining' || callState === 'joined' ? 'block' : 'none',
                }}
            />

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

// ─── Styles ────────────────────────────────────────────────
const styles = {
    body: {
        paddingTop: "0px",
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        color: '#e2e8f0',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        overflow: 'hidden',

    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#22c55e',
        boxShadow: '0 0 8px #22c55e',
    },
    headerTitle: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#f1f5f9',
    },
    leaveBtn: {
        padding: '8px 16px',
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.4)',
        borderRadius: '8px',
        color: '#f87171',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'all 0.2s',
    },
    backBtn: {
        padding: '8px 16px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '8px',
        color: '#94a3b8',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'all 0.2s',
    },
    centerBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '20px',
        textAlign: 'center',
    },
    iconWrap: {
        fontSize: '64px',
        lineHeight: 1,
        marginBottom: '8px',
    },
    title: {
        fontSize: '26px',
        fontWeight: 700,
        color: '#f1f5f9',
        margin: 0,
    },
    subtitle: {
        fontSize: '15px',
        color: '#94a3b8',
        maxWidth: '400px',
        lineHeight: 1.6,
        margin: 0,
    },
    joinBtn: {
        marginTop: '8px',
        padding: '14px 36px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        fontSize: '16px',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
        transition: 'all 0.2s',
    },
    hint: {
        fontSize: '13px',
        color: '#475569',
        margin: 0,
    },
    link: {
        color: '#818cf8',
        textDecoration: 'none',
    },
    spinner: {
        width: '48px',
        height: '48px',
        border: '4px solid rgba(255,255,255,0.1)',
        borderTop: '4px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    videoContainer: {
        flex: 1,
        position: 'relative',
        margin: '16px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#0d0d1a',
        minHeight: 0,
    },
};

export default InterviewPage;