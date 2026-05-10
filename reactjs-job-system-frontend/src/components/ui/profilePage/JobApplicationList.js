import React, { useState } from 'react';
import { Card, Container, Row, Col, Badge, Button } from 'react-bootstrap';
import {
    FiBriefcase,
    FiEye,
    FiFileText,
    FiCalendar,
    FiDollarSign,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiUser
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import CVModal from '../applyPage/CVModal';
import { FaBriefcase, FaComments } from 'react-icons/fa';

const JobApplicationsList = ({ applications }) => {
    const nav = useNavigate();

    const [showCVModal, setShowCVModal] = useState(false);

    const getStatusInfo = (status) => {
        const statusMap = {
            'PE': {
                label: 'Đang chờ',
                variant: 'warning',
                icon: <FiClock className="me-1" />,
                bgClass: 'bg-warning-subtle'
            },
            'RE': {
                label: 'Từ chối',
                variant: 'danger',
                icon: <FiXCircle className="me-1" />,
                bgClass: 'bg-danger-subtle'
            },
            'AC': {
                label: 'Chấp nhận',
                variant: 'success',
                icon: <FiCheckCircle className="me-1" />,
                bgClass: 'bg-success-subtle'
            }
        };
        return statusMap[status] || {
            label: 'Không xác định',
            variant: 'secondary',
            icon: <FiClock className="me-1" />,
            bgClass: 'bg-secondary-subtle'
        };
    };

    const formatSalary = (salary) => {
        return new Intl.NumberFormat('vi-VN').format(salary) + ' VNĐ';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewJob = (postingId) => {
        let url = `/job/${postingId}`;
        window.open(url, '_blank');
    };

    const handleChat = (receiverUser) => {
        try {
            nav('/chatv2', {
                state: {
                    isNew: true,
                    receiverUser: receiverUser,
                }
            });
        } catch (ex) {
            console("Lỗi load người để chat", ex);
        }
    };

    return (
        <Container>
            <div className="mb-3 mt-5">
                <h2 className="fw-bold text-center my-3 d-flex justify-content-center">
                    <FaBriefcase className="me-3 mt-1" />
                    Danh sách ứng tuyển
                </h2>
            </div>

            <Row>
                {applications.map((application) => {
                    const statusInfo = getStatusInfo(application.status);

                    return (
                        <Col key={application.id} xs={12} className="my-3 p-0">
                            <Card className="shadow border-1 h-100 overflow-hidden position-relative">
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <FiUser className="text-primary" size={20} />
                                                <h5 className="mb-0 fw-bold text-dark">
                                                    {application.title}
                                                </h5>
                                            </div>

                                            <div className="text-end">
                                                <div className="d-flex align-items-center text-muted mb-1">
                                                    <FiCalendar className="me-1" size={14} />
                                                    <small>{formatDate(application.created_at)}</small>
                                                </div>
                                            </div>
                                        </div>



                                        <Badge
                                            bg={statusInfo.variant}
                                            className="d-flex align-items-center w-fit px-3 py-2 fs-6"
                                        >
                                            {statusInfo.icon}
                                            {statusInfo.label}
                                        </Badge>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-muted mb-0 lh-base">
                                            {application.description}
                                        </p>
                                    </div>

                                    <div className="border rounded p-3 mb-4 bg-light">
                                        <div className="d-flex align-items-center mb-2">
                                            <FiBriefcase className="text-primary me-2" size={18} />
                                            <h6 className="mb-0 fw-semibold">
                                                {application.posting.title}
                                            </h6>
                                        </div>

                                        <p className="text-muted small mb-2 lh-base">
                                            {application.posting.description}
                                        </p>

                                        <div className="d-flex align-items-center">
                                            <FiDollarSign className="text-success me-1" size={16} />
                                            <span className="fw-semibold text-success">
                                                {formatSalary(application.posting.salary)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 flex-wrap">
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            className="d-flex align-items-center px-3 py-2"
                                            onClick={() => handleViewJob(application.posting.id)}
                                        >
                                            <FiEye className="me-1" size={16} />
                                            Xem công việc
                                        </Button>

                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            className="d-flex align-items-center px-3 py-2"
                                            onClick={() => { setShowCVModal(true) }}
                                        >
                                            <FiFileText className="me-1" size={16} />
                                            Xem CV
                                        </Button>

                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="d-flex align-items-center px-3 py-2"
                                            onClick={() => handleChat(application.user)}
                                        >
                                            <FaComments className="me-1" size={16} />
                                            Chat với nhà tuyển dụng
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                            <CVModal
                                show={showCVModal}
                                onHide={() => setShowCVModal(false)}
                                cvUrl={application.cv_file}
                                title={application.title}
                            />
                        </Col>
                    );
                })}
            </Row>

            {applications.length === 0 && (
                <div className="text-center py-5">
                    <FiBriefcase size={64} className="text-muted mb-3" />
                    <h4 className="text-muted">Không có đơn ứng tuyển nào</h4>
                    <p className="text-muted">Chưa có đơn ứng tuyển nào được gửi.</p>
                </div>
            )}


        </Container>
    );
};

export default JobApplicationsList;