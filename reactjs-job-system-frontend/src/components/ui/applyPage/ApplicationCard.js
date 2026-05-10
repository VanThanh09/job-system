import { Card, Badge, Button, Row, Col, Image } from 'react-bootstrap';
import { FaComments } from 'react-icons/fa';
import { FiEye, FiCheck, FiX, FiFileText, FiClock, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { authApis, endpoints } from '../../../configs/Apis';
import { useContext } from 'react';
import { MyUserContext } from '../../../configs/MyContexts';

const ApplicationCard = ({ application, onViewCV, onApprove, onReject }) => {
    const nav = useNavigate();
    const [user,] = useContext(MyUserContext);

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PE':
                return <Badge bg="warning" className="d-flex align-items-center gap-1">
                    <FiClock size={14} /> Đang chờ
                </Badge>;
            case 'AP':
                return <Badge bg="success" className="d-flex align-items-center gap-1">
                    <FiCheck size={14} /> Đã chấp nhận
                </Badge>;
            case 'RE':
                return <Badge bg="danger" className="d-flex align-items-center gap-1">
                    <FiX size={14} /> Đã từ chối
                </Badge>;
            default:
                return <Badge bg="secondary">Không xác định</Badge>;
        }
    };

    const handleChat = async (receiverUser) => {
        if (!user) {
            alert("Đăng nhập trước khi chat!!");
            return;
        }
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
        <Card className="h-100 shadow-sm application-card">
            <Card.Header className='border-0'>
                <div className="text-center d-flex align-items-center">
                    <Image
                        src={application.user?.avatar}
                        roundedCircle
                        width="40"
                        height="40"
                        className="me-3"
                    />
                    <h5 className="me-3">{application.user?.last_name} {application.user?.first_name}</h5>
                    <Button variant="outline-success" className='mb-2' size="sm" onClick={() => handleChat(application.user)}>
                        <FaComments className="me-1" />
                        Chat
                    </Button>
                </div>
            </Card.Header>

            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                        <Card.Title className="h5 mb-2 text-dark d-flex align-items-center">
                            <FiFileText className="me-2" />
                            {application.title}
                        </Card.Title>
                        {/* <div className="mb-2">
                            {getStatusBadge(application.status)}
                        </div> */}
                    </div>
                </div>

                <Card.Text className="text-muted mb-3 flex-grow-1">
                    {application.description}
                </Card.Text>

                <div className="d-flex align-items-center text-muted small mb-3">
                    <FiCalendar className="me-2" />
                    <span>Nộp lúc: {formatDate(application.created_at)}</span>
                </div>

                <Row className="g-2">
                    <Col>
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="w-100"
                            onClick={() => onViewCV(application.cv_file, application.title)}
                        >
                            <FiEye className="me-2" />
                            Xem CV
                        </Button>
                    </Col>
                    {application.status === 'PE' ? (
                        <>
                            <Col>
                                <Button
                                    variant="success"
                                    size="sm"
                                    className="w-100"
                                    onClick={() => onApprove(application.id)}
                                >
                                    <FiCheck className="me-2" />
                                    Chấp nhận
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="w-100"
                                    onClick={() => onReject(application.id)}
                                >
                                    <FiX className="me-2" />
                                    Từ chối
                                </Button>
                            </Col>
                        </>
                    ) : (
                        <Col>
                            <div className="mb-2">
                                {getStatusBadge(application.status)}
                            </div>
                        </Col>
                    )}
                </Row>
            </Card.Body>
        </Card>
    );
};

export default ApplicationCard;