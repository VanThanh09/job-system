import { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Row, Col, Card, Carousel, Pagination, Spinner } from 'react-bootstrap';
import { FaStar, FaCalendarAlt, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import { BsBuilding } from 'react-icons/bs';
import RatingCard from './RatingCard';
import StatusBadge from './StatusBadge';
import Apis, { endpoints } from '../../../configs/Apis';

const CompanyDetail = ({ companyData }) => {
    const [page, setPage] = useState(1);

    const [totalPage, setTotalPage] = useState(0);
    const [ratings, setRatings] = useState([]);
    const { images } = companyData;

    const loadRating = useCallback(async () => {
        try {
            let url = `${endpoints['getRatingOfCompany'](companyData.id)}?pageRating=${page}`;
            let res = await Apis.get(url);
            if (res.status === 200) {
                setRatings(res.data.ratings);
                setTotalPage(res.data.totalPage);
            }
        } catch (ex) {
            console.log("Lỗi tải rating: ", ex);
        } finally {
        }
    }, [page, companyData]);

    useEffect(() => {
        loadRating();
    }, [loadRating])

    const cardBodyRef = useRef(null);

    useEffect(() => {
        if (cardBodyRef.current) {
            cardBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [page]); // khi trang thay đổi cuộn về đầu

    if (!companyData) {
        return (
            <Container className="text-center py-5">
                <h4>Không tìm thấy dữ liệu công ty</h4>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            {/* Company Header */}
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="d-flex align-items-center">
                                    <BsBuilding className="me-2 text-dark" size={24} />
                                    <h2 className="mb-0 text-dark">{companyData.name}</h2>
                                </div>
                                <StatusBadge status={companyData.status} />
                            </div>

                            <p className="text-muted mb-3" style={{ lineHeight: '1.6' }}>
                                {companyData.description}
                            </p>

                            <Row className="g-3">
                                <Col md={6}>
                                    <div className="d-flex align-items-center text-muted">
                                        <FaIdCard className="me-2" />
                                        <span><strong>Mã số thuế:</strong> {companyData.taxId}</span>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center text-muted">
                                        <FaMapMarkerAlt className="me-2" />
                                        <span><strong>Địa chỉ:</strong> {companyData.address}</span>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center text-muted">
                                        <FaCalendarAlt className="me-2" />
                                        <span><strong>Ngày tạo:</strong> {new Date(companyData.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {/* Images Section */}
                <Col lg={7} className="mb-4">
                    <Card className="shadow border-0 h-100">
                        <Card.Header className="bg-light border-0">
                            <h5 className="mb-0 text-dark fw-semibold">Hình ảnh công ty ({images?.length})</h5>
                        </Card.Header>
                        <Card.Body className="p-0" style={{ maxHeight: 'auto', overflowY: 'auto' }}>
                            {images && images.length > 0 ? (
                                <Carousel interval={2000}>
                                    {images.map((image) => (
                                        <Carousel.Item key={image.id} className='p-2'>
                                            <img
                                                className="d-block w-100"
                                                src={image.image}
                                                alt={`Company ${image.id}`}
                                                style={{
                                                    height: '400px',
                                                    objectFit: 'cover',
                                                    borderRadius: '0 0 0.375rem 0.375rem'
                                                }}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <BsBuilding size={48} className="mb-3" />
                                    <p>Chưa có hình ảnh</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Ratings Section */}
                <Col lg={5} className="mb-4">

                    <Card className="shadow border-0">
                        <Card.Header className="bg-light border-0 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-dark fw-semibold">Đánh giá ({ratings?.length || 0})</h5>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }} ref={cardBodyRef} >
                            {ratings && ratings.length > 0 ? (
                                <div className="d-flex flex-column gap-3">
                                    {ratings.map((rating) => (
                                        <RatingCard key={rating.id} rating={rating} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <FaStar size={48} className="mb-3" />
                                    <p>Chưa có đánh giá nào</p>
                                </div>
                            )}
                        </Card.Body>

                        {totalPage > 1 && (
                            <Card.Footer className="bg-light border-0">
                                <div className="d-flex justify-content-center">
                                    <Pagination size="sm" className="mb-0">
                                        <Pagination.First
                                            onClick={() => setPage(1)}
                                            disabled={page === 1}
                                        />
                                        <Pagination.Prev
                                            onClick={() => setPage(prev => prev - 1)}
                                            disabled={page === 1}
                                        />

                                        {[...Array(totalPage)].map((_, index) => {
                                            const currentPage = index + 1;
                                            return (
                                                <Pagination.Item
                                                    key={currentPage}
                                                    active={page === currentPage}
                                                    onClick={() => setPage(currentPage)}
                                                >
                                                    {currentPage}
                                                </Pagination.Item>
                                            );
                                        })}

                                        <Pagination.Next
                                            onClick={() => {
                                                setPage(prev => prev + 1);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            disabled={page === totalPage}
                                        />
                                        <Pagination.Last
                                            onClick={() => setPage(totalPage)}
                                            disabled={page === totalPage}
                                        />
                                    </Pagination>
                                </div>
                            </Card.Footer>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CompanyDetail;