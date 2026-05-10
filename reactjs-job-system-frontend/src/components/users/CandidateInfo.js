import { useContext, useEffect, useState } from 'react';
import { Button, Modal, Card, Form, Alert, Spinner } from 'react-bootstrap';
import { FaEye, FaEdit, FaUpload, FaFilePdf, FaTimes, FaRobot, FaArrowRight, FaMagic } from 'react-icons/fa';
import { FiStar } from 'react-icons/fi';
import { authApis, endpoints } from '../../configs/Apis';
import { MyUserContext } from '../../configs/MyContexts';
import CVModal from '../ui/applyPage/CVModal';
import JobApplicationsList from '../ui/profilePage/JobApplicationList';
import { useNavigate } from 'react-router-dom';

const CandidateInfo = ({ cv_info }) => {
    const [showModal, setShowModal] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [, dispatch] = useContext(MyUserContext);

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load applications of candidate
    const loadApplications = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['application']);

            if (res.status === 200) {
                setApplications(res.data.results);
            }
        } catch (ex) {
            console.log("Lỗi load bài ứng tuyển", ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadApplications();
    }, [])

    // Xử lý xem CV
    const handleViewCV = () => {
        setShowModal(true);
    };

    // Xử lý đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        console.log(cv_info)
    };

    // Xử lý thay đổi CV
    const handleChangeCV = () => {
        setShowUploadForm(true);
    };

    // Xử lý chọn file
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            alert('Vui lòng chọn file PDF!');
        }
    };

    // Xử lý upload CV
    const handleUploadCV = async () => {
        if (!selectedFile) {
            alert('Vui lòng chọn file CV!');
            return;
        }

        setUploading(true);

        try {
            let formData = new FormData();

            formData.append("cv", selectedFile);

            let res = await authApis().post(endpoints['cv'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 201) {
                let u = await authApis().get(endpoints['profile']);
                dispatch({
                    "type": "login",
                    "payload": u.data
                })
            }

            setShowUploadForm(false);
            setSelectedFile(null);
            alert('Upload CV thành công!');
        } catch (ex) {
            alert('Upload CV thất bại! Vui lòng thử lại.');
        } finally {
            setUploading(false);
        }
    };

    // Xử lý hủy upload
    const handleCancelUpload = () => {
        setShowUploadForm(false);
        setSelectedFile(null);
    };

    // Format ngày tháng
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const nav = useNavigate();

    return (
        <div className='pt-4'>
            {/* Recommendation Banner */}
            <Card
                className="border-0 mb-4 overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #0f4c2a 0%, #198754 60%, #20c997 100%)',
                    borderRadius: '14px',
                    boxShadow: '0 8px 24px rgba(25, 135, 84, 0.3)',
                }}
            >
                <Card.Body className="p-4">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-3 text-white">
                            <div
                                style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    borderRadius: '50%',
                                    padding: '12px',
                                    backdropFilter: 'blur(8px)',
                                    flexShrink: 0,
                                }}
                            >
                                <FaRobot size={26} />
                            </div>
                            <div>
                                <h6 className="fw-bold mb-1" style={{ fontSize: '1rem' }}>
                                    <FiStar className="me-1" />
                                    Việc làm dành riêng cho bạn
                                </h6>
                                <p className="mb-0 opacity-75" style={{ fontSize: '0.83rem' }}>
                                    Hệ thống AI phân tích CV của bạn để gợi ý công việc phù hợp nhất
                                </p>
                            </div>
                        </div>
                        <Button
                            id="btn-your-recommendation-job"
                            onClick={() => nav('/your-recommendation-job')}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: '1.5px solid rgba(255,255,255,0.5)',
                                color: '#fff',
                                fontWeight: 600,
                                borderRadius: '8px',
                                backdropFilter: 'blur(8px)',
                                whiteSpace: 'nowrap',
                            }}
                            className="d-flex align-items-center gap-2"
                        >
                            Xem ngay
                            <FaArrowRight size={13} />
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* CV Builder Banner */}
            <div
                className="mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3 px-4 py-3"
                style={{
                    background: '#fff',
                    border: '1px solid #e9ecef',
                    borderLeft: '4px solid #198754',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
            >
                <div className="d-flex align-items-center gap-3">
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #e8f5e9, #d4edda)',
                            borderRadius: '10px',
                            padding: '10px',
                            flexShrink: 0,
                        }}
                    >
                        <FaMagic size={20} color="#198754" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.95rem' }}>
                            Thiết kế CV
                        </div>
                        <div style={{ color: '#6c757d', fontSize: '0.8rem', marginTop: '2px' }}>
                            Tạo CV với các mẫu đẹp, tải xuống dễ dàng
                        </div>
                    </div>
                </div>
                <button
                    id="btn-go-to-cvbuilder"
                    onClick={() => nav('/cvbuilder')}
                    style={{
                        background: 'linear-gradient(135deg, #198754, #20c997)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 18px',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 8px rgba(25,135,84,0.25)',
                    }}
                >
                    Thiết kế ngay
                    <FaArrowRight size={12} />
                </button>
            </div>

            {/* CV Management Card */}
            <div
                className="mb-4"
                style={{
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    border: '1px solid #e9ecef',
                }}
            >
                {/* Card Header */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                        padding: '1.1rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <div
                        style={{
                            background: 'rgba(255,255,255,0.12)',
                            borderRadius: '8px',
                            padding: '7px 9px',
                        }}
                    >
                        <FaFilePdf size={17} color="#fff" />
                    </div>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.01em' }}>
                        Hồ sơ CV của bạn
                    </span>
                    {cv_info && (
                        <span
                            style={{
                                marginLeft: 'auto',
                                background: 'rgba(32,201,151,0.18)',
                                color: '#20c997',
                                border: '1px solid rgba(32,201,151,0.35)',
                                borderRadius: '20px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                padding: '3px 10px',
                                letterSpacing: '0.02em',
                            }}
                        >
                            ✓ Đã tải lên
                        </span>
                    )}
                </div>

                <div className="p-4">
                    {cv_info ? (
                        <div>
                            {/* File info row */}
                            <div
                                className="d-flex align-items-center gap-3 p-3 mb-4"
                                style={{
                                    background: 'linear-gradient(90deg, #f0faf5, #e6f7f0)',
                                    borderRadius: '12px',
                                    border: '1px solid #b7e4cc',
                                }}
                            >
                                <div
                                    style={{
                                        background: 'linear-gradient(135deg, #198754, #20c997)',
                                        borderRadius: '10px',
                                        padding: '10px 12px',
                                        flexShrink: 0,
                                    }}
                                >
                                    <FaFilePdf size={22} color="#fff" />
                                </div>
                                <div className="flex-grow-1">
                                    <div style={{ fontWeight: 700, color: '#0f5132', fontSize: '0.92rem' }}>
                                        Curriculum Vitae
                                    </div>
                                    <div style={{ color: '#6c757d', fontSize: '0.78rem', marginTop: '2px' }}>
                                        Cập nhật lần cuối: <strong>{formatDate(cv_info.updated_at)}</strong>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        background: '#198754',
                                        color: '#fff',
                                        borderRadius: '6px',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        padding: '3px 8px',
                                        letterSpacing: '0.04em',
                                    }}
                                >
                                    PDF
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="d-flex gap-2 flex-wrap">
                                <button
                                    onClick={handleViewCV}
                                    style={{
                                        background: 'linear-gradient(135deg, #198754, #20c997)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '9px',
                                        padding: '9px 20px',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '7px',
                                        cursor: 'pointer',
                                        boxShadow: '0 3px 10px rgba(25,135,84,0.3)',
                                        transition: 'opacity 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    <FaEye size={14} />
                                    Xem CV
                                </button>

                                <button
                                    onClick={handleChangeCV}
                                    style={{
                                        background: '#fff',
                                        color: '#495057',
                                        border: '1.5px solid #dee2e6',
                                        borderRadius: '9px',
                                        padding: '9px 20px',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '7px',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.15s, color 0.15s',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#198754';
                                        e.currentTarget.style.color = '#198754';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = '#dee2e6';
                                        e.currentTarget.style.color = '#495057';
                                    }}
                                >
                                    <FaEdit size={14} />
                                    Thay đổi CV
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Chưa có CV — dashed upload zone */
                        <div
                            className="d-flex flex-column align-items-center justify-content-center text-center"
                            style={{
                                border: '2px dashed #ced4da',
                                borderRadius: '14px',
                                padding: '2.5rem 1.5rem',
                                background: '#fafafa',
                                transition: 'border-color 0.2s, background 0.2s',
                                cursor: 'pointer',
                            }}
                            onClick={() => setShowUploadForm(true)}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = '#198754';
                                e.currentTarget.style.background = '#f0faf5';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = '#ced4da';
                                e.currentTarget.style.background = '#fafafa';
                            }}
                        >
                            <div
                                style={{
                                    background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)',
                                    borderRadius: '50%',
                                    padding: '18px',
                                    marginBottom: '16px',
                                    display: 'inline-flex',
                                }}
                            >
                                <FaUpload size={28} color="#198754" />
                            </div>
                            <p style={{ fontWeight: 700, color: '#343a40', marginBottom: '6px', fontSize: '0.95rem' }}>
                                Chưa có CV nào được tải lên
                            </p>
                            <p style={{ color: '#6c757d', fontSize: '0.82rem', marginBottom: '18px', maxWidth: '280px' }}>
                                Tải CV lên để nhà tuyển dụng có thể tìm thấy và liên hệ với bạn
                            </p>
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #198754, #20c997)',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    padding: '8px 20px',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '7px',
                                    boxShadow: '0 3px 10px rgba(25,135,84,0.25)',
                                    pointerEvents: 'none',
                                }}
                            >
                                <FaUpload size={13} />
                                Tải lên ngay
                            </span>
                        </div>
                    )}

                    {/* Upload Form */}
                    {showUploadForm && (
                        <div
                            className="mt-4 pt-4"
                            style={{ borderTop: '1px dashed #dee2e6' }}
                        >
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <FaUpload size={14} color="#198754" />
                                <span style={{ fontWeight: 700, color: '#343a40', fontSize: '0.9rem' }}>
                                    {cv_info ? 'Tải CV mới lên' : 'Chọn file CV'}
                                </span>
                            </div>

                            <Form>
                                <Form.Group className="mb-3">
                                    <div
                                        style={{
                                            border: '1.5px solid #dee2e6',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Form.Control
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileSelect}
                                            disabled={uploading}
                                            style={{ border: 'none', borderRadius: 0, background: '#f8f9fa' }}
                                        />
                                    </div>
                                    <Form.Text style={{ color: '#6c757d', fontSize: '0.77rem' }}>
                                        📄 Chỉ chấp nhận file PDF · Tối đa 5MB
                                    </Form.Text>
                                </Form.Group>

                                {selectedFile && (
                                    <div
                                        className="d-flex align-items-center gap-2 mb-3 px-3 py-2"
                                        style={{
                                            background: '#f0faf5',
                                            border: '1px solid #b7e4cc',
                                            borderRadius: '8px',
                                            fontSize: '0.82rem',
                                            color: '#0f5132',
                                        }}
                                    >
                                        <FaFilePdf size={14} color="#198754" />
                                        <span className="fw-semibold">{selectedFile.name}</span>
                                        <span className="text-muted ms-auto">
                                            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                )}

                                <div className="d-flex gap-2 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={handleUploadCV}
                                        disabled={!selectedFile || uploading}
                                        style={{
                                            background: (!selectedFile || uploading)
                                                ? '#adb5bd'
                                                : 'linear-gradient(135deg, #198754, #20c997)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '9px',
                                            padding: '9px 22px',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '7px',
                                            cursor: (!selectedFile || uploading) ? 'not-allowed' : 'pointer',
                                            boxShadow: (!selectedFile || uploading) ? 'none' : '0 3px 10px rgba(25,135,84,0.3)',
                                            transition: 'opacity 0.15s',
                                        }}
                                    >
                                        {uploading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" style={{ width: '14px', height: '14px' }} />
                                                Đang tải lên...
                                            </>
                                        ) : (
                                            <>
                                                <FaUpload size={13} />
                                                Tải lên
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancelUpload}
                                        disabled={uploading}
                                        style={{
                                            background: '#fff',
                                            color: '#6c757d',
                                            border: '1.5px solid #dee2e6',
                                            borderRadius: '9px',
                                            padding: '9px 20px',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '7px',
                                            cursor: uploading ? 'not-allowed' : 'pointer',
                                            transition: 'border-color 0.15s',
                                        }}
                                        onMouseEnter={e => !uploading && (e.currentTarget.style.borderColor = '#adb5bd')}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = '#dee2e6')}
                                    >
                                        <FaTimes size={13} />
                                        Hủy
                                    </button>
                                </div>
                            </Form>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal xem CV */}
            {cv_info &&
                <CVModal
                    show={showModal}
                    onHide={handleCloseModal}
                    cvUrl={cv_info.cv}
                    title="Xem  CV"
                />
            }

            {loading ? <>
                <div className="py-5 d-flex justify-content-center">
                    <Spinner animation="border" variant="success" />
                </div>
            </> : <>
                <JobApplicationsList applications={applications} />
            </>}

        </div>
    );
}

export default CandidateInfo;