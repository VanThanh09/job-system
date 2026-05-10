import { Card, Row, Col } from 'react-bootstrap';
import { FiClock, FiCheck, FiX, FiFileText } from 'react-icons/fi';

const ApplicationStats = ({ setStatus, count }) => {
    return (
        <Row className="g-3 mb-4">
            <Col sm={6} lg={3} style={{ cursor: 'pointer' }} onClick={() => setStatus('')}>
                <Card className="text-center border-0 bg-light">
                    <Card.Body>
                        <div className="d-flex align-items-center justify-content-center mb-2">
                            <FiFileText size={24} className="text-primary" />
                        </div>
                        <h3 className="mb-1">{count.total}</h3>
                        <p className="text-muted small mb-0">Tổng ứng tuyển</p>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm={6} lg={3} style={{ cursor: 'pointer' }} onClick={() => setStatus('PE')}>
                <Card className="text-center border-0 bg-warning bg-opacity-10">
                    <Card.Body>
                        <div className="d-flex align-items-center justify-content-center mb-2">
                            <FiClock size={24} className="text-warning" />
                        </div>
                        <h3 className="mb-1">{count.pending}</h3>
                        <p className="text-muted small mb-0">Đang chờ xét duyệt</p>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm={6} lg={3} style={{ cursor: 'pointer' }} onClick={() => setStatus('AP')}>
                <Card className="text-center border-0 bg-success bg-opacity-10">
                    <Card.Body>
                        <div className="d-flex align-items-center justify-content-center mb-2">
                            <FiCheck size={24} className="text-success" />
                        </div>
                        <h3 className="mb-1">{count.approved}</h3>
                        <p className="text-muted small mb-0">Đã chấp nhận</p>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm={6} lg={3} style={{ cursor: 'pointer' }} onClick={() => setStatus('RE')}>
                <Card className="text-center border-0 bg-danger bg-opacity-10">
                    <Card.Body>
                        <div className="d-flex align-items-center justify-content-center mb-2">
                            <FiX size={24} className="text-danger" />
                        </div>
                        <h3 className="mb-1">{count.rejected}</h3>
                        <p className="text-muted small mb-0">Đã từ chối</p>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ApplicationStats;