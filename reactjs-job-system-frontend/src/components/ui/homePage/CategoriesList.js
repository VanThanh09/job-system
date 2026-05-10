import { Card, Col, Row } from "react-bootstrap";
import { BiSolidCategory } from 'react-icons/bi';

const CategoriesList = ({ categories, handleCateClick }) => {
    return (
        <div className="py-4">
            <div className="text-center mb-4">
                <h1 className="fw-bold text-dark mb-3 d-flex justify-content-center align-items-center" style={{ fontSize: '2rem' }}>
                    <BiSolidCategory className="me-2 text-dark" />
                    Khám phá các lĩnh vực
                </h1>
                <p className="lead text-muted">
                    Tìm việc với các lĩnh vực khác nhau nhanh chóng
                </p>
            </div>
            <Row xs={1} sm={2} md={2} lg={5} className="g-4">
                {categories.map((cat, idx) => (
                    <Col key={idx}>
                        <Card className="shadow-sm h-100 p-2 custom-card" style={{ cursor: 'pointer' }} onClick={() => handleCateClick(cat)}>
                            <Card.Body>
                                <img
                                    src={cat.logo}
                                    alt={cat.name}
                                    style={{ width: 90, height: 90, objectFit: 'contain', margin: -20 }}
                                />
                                <Card.Text className="mt-3" style={{ fontWeight: '500', fontSize: '1.2rem' }}>{cat.name}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default CategoriesList;