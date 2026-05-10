import { Card, Badge, Row, Col, Button } from 'react-bootstrap';
import {
    FaMapMarkerAlt,
    FaClock,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle
} from 'react-icons/fa';
import './styles.css'
import { useNavigate } from 'react-router-dom';
import { authApis, endpoints } from '../../../configs/Apis';

const JobCard = ({ job, isOwner = false, loadJobs }) => {
    const nav = useNavigate();

    // Format salary to Vietnamese currency
    const formatSalary = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Format date to Vietnamese format
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleClick = () => {
        if (isOwner)
            return
        nav(`/job/${job.id}`)
    }

    const handleViewApplies = () => {
        if (!isOwner)
            return
        nav(`/jobapplies/${job.id}`)
    }

    const handleViewRecommendations = () => {
        if (!isOwner)
            return
        nav(`/recommendations/${job.id}`)
    }

    const handleChangeActive = async () => {
        try {
            let res = await authApis().post(endpoints['changePostingActive'](job.id), {
                "is_active": !job.is_active,
            })

            if (res.status === 200) {
                alert("Đổi trạng thái ứng tuyển thành công");
                loadJobs();
            }
        } catch (ex) {
            console.log("Lỗi đổi active", ex);
        } finally {

        }
    }

    return (
        <Card className="job-card h-100 shadow border-0" style={{ cursor: 'pointer' }} onClick={handleClick}>
            <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                        <Card.Title className="job-title mb-2 text-dark fw-bold">
                            {job.title}
                        </Card.Title>
                        {/* {job.company && (
                            <div className="company-info mb-2">
                                <FaBuilding className="text-muted me-2" />
                                <span className="text-muted">Công ty #{job.company}</span>
                            </div>
                        )} */}
                    </div>
                    <Badge
                        bg={job.is_active ? 'success' : 'secondary'}
                        className="status-badge"
                    >
                        {job.is_active ? (
                            <>
                                <FaCheckCircle className="me-1" />
                                Đang tuyển
                            </>
                        ) : (
                            <>
                                <FaTimesCircle className="me-1" />
                                Ngừng tuyển
                            </>
                        )}
                    </Badge>
                </div>

                <Card.Text className="job-description text-muted mb-4 lh-base" style={{ height: '25px' }}>
                    {job.description.length > 100 ? job.description.slice(0, 100) + '...' : job.description}
                </Card.Text>

                <Row className="job-details g-3">
                    <Col md={6}>
                        <div className="detail-item d-flex align-items-center">
                            <FaMoneyBillWave className="detail-icon text-success me-2" />
                            <div>
                                <small className="text-muted d-block">Mức lương</small>
                                <span className="fw-semibold">
                                    {formatSalary(job.salary)}
                                </span>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="detail-item d-flex align-items-center">
                            <FaClock className="detail-icon text-primary me-2" />
                            <div>
                                <small className="text-muted d-block">Thời gian làm việc</small>
                                <span className="fw-semibold">
                                    {job.work_time}h/tuần
                                </span>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div className="detail-item d-flex align-items-start">
                            <FaMapMarkerAlt className="detail-icon text-danger me-2 mt-1" />
                            <div>
                                <small className="text-muted d-block">Địa chỉ làm việc</small>
                                <span className="fw-medium">{job.address}</span>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div className="detail-item d-flex align-items-center">
                            <FaCalendarAlt className="detail-icon text-info me-2" />
                            <div>
                                <small className="text-muted d-block">Ngày đăng</small>
                                <span className="fw-medium">
                                    {formatDate(job.created_at)}
                                </span>
                            </div>
                        </div>
                    </Col>
                </Row>

                {isOwner && <>
                    <div className="d-flex gap-3 w-100 pt-3">
                        <Button size="sm" variant="success" className="flex-fill" onClick={handleViewApplies}>
                            Xem bài ứng tuyển
                        </Button>
                        <Button size="sm" variant="info" className="flex-fill" onClick={handleViewRecommendations}>
                            Ứng viên đề xuất
                        </Button>
                        {job.is_active ? <>
                            <Button size="sm" variant="dark" className="flex-fill" onClick={handleChangeActive}>
                                Đừng tuyển
                            </Button>
                        </> : <>
                            <Button size="sm" variant="dark" className="flex-fill" onClick={handleChangeActive}>
                                Tiếp tục tuyển
                            </Button>
                        </>}
                    </div>
                </>}

            </Card.Body>
        </Card>
    );
};

export default JobCard;