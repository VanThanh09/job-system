import React, { useState } from 'react';
import Apis, { endpoints } from '../../configs/Apis';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    // Lấy thông tin từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');
    const token = urlParams.get('token');

    const navigate = useNavigate();

    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleVerifyEmail = async () => {
        try {
            setLoading(true);

            let form = new FormData();
            form.append("uid", uid);
            form.append("token", token);

            let res = await Apis.post(endpoints['verify_email'], form);

            if (res.status === 200) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }

        } catch (error) {
            console.error("Lỗi xác thực: ", error);
            alert("Xác thực thất bại, vui lòng kiểm tra lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.iconContainer}>
                    <svg style={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h2 style={styles.title}>Xác thực Email</h2>

                <p style={styles.description}>
                    Cảm ơn bạn đã đăng ký! Vui lòng nhấn vào nút bên dưới để hoàn tất quá trình xác thực địa chỉ email bảo mật của bạn.
                </p>

                <button
                    style={{
                        ...styles.button,
                        transform: (isHovered && !loading && !success) ? 'translateY(-3px)' : 'translateY(0)',
                        boxShadow: (isHovered && !loading && !success) ? '0 10px 20px rgba(37, 99, 235, 0.4)' : '0 4px 6px rgba(37, 99, 235, 0.2)',
                        cursor: (loading || success) ? 'not-allowed' : 'pointer',
                        opacity: (loading || success) ? 0.8 : 1,
                        backgroundColor: success ? '#10b981' : '#3b82f6', // Màu xanh lá khi thành công
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={(loading || success) ? undefined : handleVerifyEmail}
                >
                    {success ? (
                        <>
                            Xác thực thành công!
                            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </>
                    ) : loading ? (
                        "Đang xử lý..."
                    ) : (
                        <>
                            Xác thực tài khoản
                            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </>
                    )}
                </button>

                {(!uid || !token) && (
                    <div style={styles.warningBox}>
                        <svg style={{ width: '20px', height: '20px', marginRight: '8px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p style={styles.warningText}>
                            Có vẻ như liên kết không chính xác, vui lòng vào liên kết được gửi tại mail của bạn!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0,0,0,0.05)',
        padding: '48px 40px',
        maxWidth: '480px',
        width: '90%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    iconContainer: {
        width: '88px',
        height: '88px',
        backgroundColor: '#dcfce7',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: '0 8px 16px rgba(34, 197, 94, 0.2)'
    },
    icon: {
        width: '44px',
        height: '44px',
        color: '#16a34a',
    },
    title: {
        margin: '0 0 16px 0',
        fontSize: '32px',
        fontWeight: '800',
        color: '#1e293b',
        letterSpacing: '-0.5px'
    },
    description: {
        margin: '0 0 36px 0',
        fontSize: '17px',
        color: '#64748b',
        lineHeight: '1.6',
    },
    button: {
        backgroundColor: '#16a34a',
        backgroundImage: 'linear-gradient(to right, #178a00ff, #53ac57ff)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        padding: '16px 32px',
        fontSize: '18px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        width: '100%',
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
    },
    warningBox: {
        marginTop: '24px',
        display: 'flex',
        alignItems: 'flex-start',
        backgroundColor: '#fef2f2',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid #fecaca',
        color: '#ef4444',
        textAlign: 'left'
    },
    warningText: {
        margin: 0,
        fontSize: '14px',
        lineHeight: '1.5'
    }
};

export default VerifyEmail;
