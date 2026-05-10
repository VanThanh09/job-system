import { Card, Col, Row, Badge, Button, Container } from 'react-bootstrap';
import { FaBuilding, FaCalendarAlt, FaIdCard, FaMapMarkerAlt, FaFileAlt, FaClock, FaTimes, FaCheckCircle } from 'react-icons/fa';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';

const CompanyList = ({ companies }) => {
    const nav = useNavigate();

    const getStatusConfig = (status) => {
        switch (status) {
            case 'PE':
                return {
                    variant: 'warning',
                    icon: <FaClock className="me-1" />,
                    text: 'Đang chờ duyệt',
                    textClass: 'text-warning'
                };
            case 'RE':
                return {
                    variant: 'danger',
                    icon: <FaTimes className="me-1" />,
                    text: 'Đã từ chối',
                    textClass: 'text-danger'
                };
            case 'AP':
                return {
                    variant: 'success',
                    icon: <FaCheckCircle className="me-1" />,
                    text: 'Đang hoạt động',
                    textClass: 'text-success'
                };
            default:
                return {
                    variant: 'secondary',
                    icon: null,
                    text: 'Không xác định',
                    textClass: 'text-muted'
                };
        }
    };

    return (
        <>
            <Container className='mt-3 p-0 border-top pt-3'>
                <div className="d-flex align-items-center mb-4">
                    <FaBuilding className="text-dark me-3" size={28} />
                    <h2 className="mb-0 text-dark fw-bold">Công ty của bạn</h2>
                </div>

                <Row xs={1} lg={12} xl={12} className="g-4">
                    {companies.map(company => {
                        const statusConfig = getStatusConfig(company.status);

                        return (
                            <Col key={company.id}>
                                <Card
                                    className="border shadow-sm company-card mt-4"
                                    style={{
                                        transition: 'all 0.3s ease',
                                        borderRadius: '12px'
                                    }}
                                >
                                    <Card.Body className="p-4">
                                        {/* Header with company name and status */}
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="flex-grow-1 me-3">
                                                <h5 className="fw-bold text-dark mb-1 company-name" style={{ paddingLeft: '0.8rem' }}>
                                                    {company.name}
                                                </h5>
                                            </div>
                                            <Badge
                                                bg={statusConfig.variant}
                                                className="status-badge d-flex align-items-center"
                                                style={{ fontSize: '0.75rem' }}
                                            >
                                                {statusConfig.icon}
                                                {statusConfig.text}
                                            </Badge>
                                        </div>

                                        {/* Company details */}
                                        <div className="company-details mb-3">
                                            <div className="detail-item mb-2">
                                                <div className="d-flex align-items-center mb-1">
                                                    <FaIdCard className="text-muted me-2" size={14} />
                                                    <span className="detail-label">Mã số thuế</span>
                                                </div>
                                                <div className="detail-value">{company.tax_id}</div>
                                            </div>

                                            <div className="detail-item mb-2">
                                                <div className="d-flex align-items-center mb-1">
                                                    <FaMapMarkerAlt className="text-muted me-2" size={14} />
                                                    <span className="detail-label">Địa chỉ</span>
                                                </div>
                                                <div className="detail-value">{company.address}</div>
                                            </div>

                                            <div className="detail-item mb-2">
                                                <div className="d-flex align-items-center mb-1">
                                                    <FaCalendarAlt className="text-muted me-2" size={14} />
                                                    <span className="detail-label">Ngày tạo</span>
                                                </div>
                                                <div className="detail-value">
                                                    {moment(company.createdAt).format("DD/MM/YYYY")}
                                                </div>
                                            </div>

                                            <div className="detail-item">
                                                <div className="d-flex align-items-center mb-1">
                                                    <FaFileAlt className="text-muted me-2" size={14} />
                                                    <span className="detail-label">Mô tả</span>
                                                </div>
                                                <div className="detail-value description">
                                                    {company.description.length > 120
                                                        ? company.description.slice(0, 120) + '...'
                                                        : company.description
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="d-flex gap-2 mt-auto">
                                            <Row className='gap-2'>
                                                {company.status === "AP" &&
                                                    <Col xs={12} sm={'auto'} >
                                                        <Button size="sm" style={{ borderWidth: '1px', backgroundColor: '#fff', borderColor: '#198754', color: '#198754' }} className="w-auto align-self-start" onClick={() => nav(`/addposting?companyId=${company.id}`)}>
                                                            Đăng tin tuyển dụng
                                                        </Button>
                                                    </Col>
                                                }
                                                <Col xs={'auto'} sm={'auto'}>
                                                    <div className='d-flex align-items-center justify-content-between gap-2 w-100'>
                                                        <Button variant="success" size="sm" className="w-auto align-self-start">
                                                            <Link to={`/mycompany/${company.id}`} className='text-decoration-none align-items-center d-flex text-white' style={{ fontSize: '0.8rem', fontWeight: '500' }}>Xem chi tiết</Link>
                                                        </Button>
                                                        {company.status !== "AP" &&
                                                            <p className='text-muted pt-1' style={{ fontSize: '0.85rem', fontWeight: '500' }}>Khi công ty được duyệt bạn có thể đăng bài</p>
                                                        }
                                                        {company.status === "RE" &&
                                                            <p className='text-danger pt-1' style={{ fontSize: '0.85rem', fontWeight: '500' }}>Công ty này đã bị từ chối. Liên hệ Admin để biết chi tiết.</p>
                                                        }
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
            <style>{`
        .company-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
        
        .company-name {
          color: #2c3e50;
          font-size: 1.1rem;
          line-height: 1.3;
        }
        
        .detail-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          font-size: 0.9rem;
          font-weight: 500;
          color: #495057;
          line-height: 1.4;
        }
        
        .description {
          font-size: 0.85rem !important;
          color: #6c757d !important;
          font-weight: 400 !important;
        }
        
        .status-badge {
          border-radius: 20px;
          padding: 0.4rem 0.8rem;
          font-weight: 600;
        }
        
        .btn-action {
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }
        
        .btn-action:hover {
          transform: translateY(-1px);
        }
        
        .company-details {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
        }
        
        .detail-item:last-child {
          margin-bottom: 0 !important;
        }
      `}</style>
        </>
    );
};

export default CompanyList;