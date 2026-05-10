import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Badge, Card } from 'react-bootstrap';
import { FiStar, FiBriefcase, FiMapPin, FiClock, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import { authApis, endpoints } from '../../configs/Apis';
import { useNavigate } from 'react-router-dom';
import Paginator from '../ui/Paginator';

const formatSalary = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

const SimilarityBadge = ({ score }) => {
    const pct = Math.round((score || 0) * 100);
    let variant = 'secondary';
    if (pct >= 70) variant = 'success';
    else if (pct >= 40) variant = 'warning';
    return (
        <Badge bg={variant} className="d-flex align-items-center gap-1 px-2 py-1" style={{ fontSize: '0.75rem' }}>
            <FiStar size={11} />
            {pct}% phù hợp
        </Badge>
    );
};

const RecommendedJobCard = ({ item }) => {
    const nav = useNavigate();
    const { posting_info, similarity } = item;
    const job = posting_info;

    return (
        <Card
            className="h-100 border-0 shadow-sm"
            style={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                borderRadius: '12px',
                overflow: 'hidden',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
            }}
            onClick={() => nav(`/job/${job.id}`)}
        >
            {/* Gradient accent bar */}
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #198754, #20c997)' }} />

            <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="fw-bold mb-0 text-dark flex-grow-1 me-2" style={{ lineHeight: 1.4 }}>
                        {job.title}
                    </h6>
                    <SimilarityBadge score={similarity} />
                </div>

                <p className="text-muted small mb-3" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                    {job.description}
                </p>

                <Row className="g-2">
                    <Col xs={6}>
                        <div className="d-flex align-items-center gap-2">
                            <FiDollarSign className="text-success" size={14} />
                            <span className="small fw-semibold text-success">{formatSalary(job.salary)}</span>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div className="d-flex align-items-center gap-2">
                            <FiClock className="text-primary" size={14} />
                            <span className="small text-muted">{job.work_time}h/tuần</span>
                        </div>
                    </Col>
                    <Col xs={12}>
                        <div className="d-flex align-items-center gap-2">
                            <FiMapPin className="text-danger" size={14} />
                            <span className="small text-muted">{job.address}</span>
                        </div>
                    </Col>
                    <Col xs={12}>
                        <div className="d-flex align-items-center gap-2">
                            <FiCalendar className="text-muted" size={14} />
                            <span className="small text-muted">Đăng ngày {formatDate(job.created_at)}</span>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

function YourRecommendationJob() {
    const [jobs, setJobs] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const loadRecommendations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page });
            const res = await authApis().get(`${endpoints['yourRecommendations']}?${params.toString()}`);
            if (res.status === 200) {
                setJobs(res.data.results);
                setTotalCount(res.data.count);
                setTotalPages(Math.ceil(res.data.count / 3));
            }
        } catch (ex) {
            console.error('Lỗi tải việc đề xuất', ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        loadRecommendations();
    }, [page]);

    return (
        <div className="min-vh-100" style={{ background: '#f8f9fa' }}>
            {/* Hero Banner */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #0f4c2a 0%, #198754 60%, #20c997 100%)',
                    padding: '3rem 0 2.5rem',
                }}
            >
                <Container>
                    <div className="d-flex align-items-center gap-3 text-white">
                        <div
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                borderRadius: '50%',
                                padding: '14px',
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <FaRobot size={32} />
                        </div>
                        <div>
                            <h1 className="h3 fw-bold mb-1">Việc làm dành cho bạn</h1>
                            <p className="mb-0 opacity-75" style={{ fontSize: '0.95rem' }}>
                                <FiStar className="me-1" />
                                Được gợi ý dựa trên CV và kỹ năng của bạn
                            </p>
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="py-4">
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                        <div className="text-center">
                            <Spinner animation="border" variant="success" />
                            <p className="text-muted mt-3 small">Đang phân tích CV và tìm việc phù hợp...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {jobs.length > 0 ? (
                            <>
                                <p className="text-muted mb-4 small">
                                    Tìm thấy <strong className="text-dark">{totalCount}</strong> công việc phù hợp với bạn
                                </p>
                                <Row className="g-4">
                                    {jobs.map((item, idx) => (
                                        <Col key={idx} sm={12} md={6} lg={4}>
                                            <RecommendedJobCard item={item} />
                                        </Col>
                                    ))}
                                </Row>
                                {totalPages > 1 && (
                                    <div className="mt-4">
                                        <Paginator page={page} totalPage={totalPages} setPage={setPage} />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-5">
                                <div
                                    style={{
                                        background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)',
                                        borderRadius: '50%',
                                        width: '100px',
                                        height: '100px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1.5rem',
                                    }}
                                >
                                    <FiBriefcase size={44} className="text-success" />
                                </div>
                                <h4 className="fw-bold text-dark mb-2">Chưa có việc phù hợp</h4>
                                <p className="text-muted mb-0">
                                    Hãy cập nhật CV của bạn để hệ thống có thể gợi ý việc làm chính xác hơn.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
}

export default YourRecommendationJob;
