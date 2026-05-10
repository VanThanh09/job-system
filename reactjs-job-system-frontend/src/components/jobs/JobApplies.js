import { useEffect, useState } from 'react';
import { Container, Row, Col, Pagination, Spinner } from 'react-bootstrap';
import { FiUsers, FiBriefcase } from 'react-icons/fi';
import ApplicationStats from '../ui/applyPage/ApplicationStats';
import ApplicationCard from '../ui/applyPage/ApplicationCard';
import CVModal from '../ui/applyPage/CVModal';
import Apis, { authApis, endpoints } from '../../configs/Apis';
import { useParams } from 'react-router-dom';

function JobApplies() {
    const { jobId } = useParams();
    const [job, setJob] = useState({});
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showCVModal, setShowCVModal] = useState(false);
    const [selectedCV, setSelectedCV] = useState({ url: '', title: '' });

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [status, setStatus] = useState('');
    const [count, setCount] = useState({});

    const loadApply = async () => {
        try {
            setLoading(true);
            let params = new URLSearchParams();

            params.append('page', page);

            params.append('status', status);

            let urlApply = `${endpoints['jobApplies'](jobId)}?${params.toString()}`;
            let resApply = await authApis().get(urlApply);

            if (resApply.status === 200) {
                setApplications(resApply.data.results);

                setTotalPages(Math.ceil(resApply.data.count / 12));
            }

            let resCount = await authApis().get(`${endpoints['jobAppliesCount'](jobId)}`);

            if (resCount.status === 200) {
                setCount(resCount.data);
            }

            let res = await Apis.get(endpoints['job'](jobId));

            if (res.status === 200) {
                setJob(res.data);
            }
        } catch (ex) {
            console.log("Không tải được bài ứng tuyển", ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const el = document.querySelector('.scroll-to-here');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
        loadApply();
    }, [page, status]);

    const handleViewCV = (cvUrl, title) => {
        setSelectedCV({ url: cvUrl, title });
        setShowCVModal(true);
    };

    const handleApprove = async (id) => {
        const confirmReject = window.confirm("Bạn có chắc chắn muốn chập nhận đơn ứng tuyển này không?");
        if (!confirmReject) return;

        try {
            let res = await authApis().post(endpoints['changeApplyStatus'](jobId), {
                "application_id": id,
                "status": "AP",
            })

            if (res.status === 200) {
                loadApply();
            }
        } catch (ex) {
            console.log("Lỗi đổi trạng thái", ex);
        }
    };

    const handleReject = async (id) => {
        const confirmReject = window.confirm("Bạn có chắc chắn muốn từ chối đơn ứng tuyển này không?");
        if (!confirmReject) return;

        try {
            let res = await authApis().post(endpoints["changeApplyStatus"](jobId), {
                "application_id": id,
                "status": "RE",
            })

            if (res.status === 200) {
                loadApply();
            }
        } catch (ex) {
            console.log("Lỗi đổi trạng thái", ex);
        }
    };

    const generatePaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <Pagination.Item
                        key={i}
                        active={i === page}
                        onClick={() => setPage(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            }
        } else {
            // First page
            items.push(
                <Pagination.Item
                    key={1}
                    active={1 === page}
                    onClick={() => setPage(1)}
                >
                    1
                </Pagination.Item>
            );

            if (page > 3) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" />);
            }

            // Current page and neighbors    
            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                items.push(
                    <Pagination.Item
                        key={i}
                        active={i === page}
                        onClick={() => setPage(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            }

            if (page < totalPages - 2) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" />);
            }

            // Last page
            if (totalPages > 1) {
                items.push(
                    <Pagination.Item
                        key={totalPages}
                        active={totalPages === page}
                        onClick={() => setPage(totalPages)}
                    >
                        {totalPages}
                    </Pagination.Item>
                );
            }
        }

        return items;
    };

    return (
        <div className="min-vh-100 bg-light">
            <div className='scroll-to-here'></div>
            <div className="bg-success text-white py-4 mb-4">
                <Container>
                    <Row className="align-items-center">
                        <Col>
                            <div className="d-flex align-items-center">
                                <FiBriefcase size={32} className="me-3" />
                                <div>
                                    <h1 className="h3 mb-1">{job.title}</h1>
                                    <p className="mb-0 opacity-75">
                                        <FiUsers className="me-2" />
                                        Xem danh sách ứng tuyển
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container>

                <ApplicationStats setStatus={setStatus} count={count} />

                {loading ? <>
                    <div className='d-flex justify-content-center mt-5'>
                        <Spinner variant='success' size='lg' />
                    </div>
                </> : <>
                    <Row className="g-5">
                        {applications.map((application) => (
                            <Col key={application.id} sm={12} md={12} lg={12}>
                                <ApplicationCard
                                    application={application}
                                    onViewCV={handleViewCV}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                />
                            </Col>
                        ))}
                    </Row>

                    {applications.length === 0 && (
                        <div className="text-center py-5">
                            <FiUsers size={64} className="text-muted mb-3" />
                            <h4 className="text-muted">Chưa có ứng tuyển nào</h4>
                            <p className="text-muted">Các ứng tuyển sẽ xuất hiện ở đây khi có người nộp hồ sơ.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-3">
                            <Pagination size="sm" className="custom-pagination">
                                <Pagination.Prev
                                    disabled={page === 1}
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                />

                                {generatePaginationItems()}

                                <Pagination.Next
                                    disabled={page === totalPages}
                                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                />
                            </Pagination>
                        </div>
                    )}
                </>}
            </Container>

            <CVModal
                show={showCVModal}
                onHide={() => setShowCVModal(false)}
                cvUrl={selectedCV.url}
                title={selectedCV.title}
            />
        </div>
    );
}

export default JobApplies;