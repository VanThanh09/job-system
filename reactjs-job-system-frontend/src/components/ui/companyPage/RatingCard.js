import { Card, Image } from 'react-bootstrap';
import { FaStar, FaRegStar } from 'react-icons/fa';

const RatingCard = ({ rating }) => {
    const renderStars = (ratingValue) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= ratingValue ? (
                    <FaStar key={i} className="text-warning me-1" size={16} />
                ) : (
                    <FaRegStar key={i} className="text-muted me-1" size={16} />
                )
            );
        }
        return stars;
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card className="border-start border-1 bg-light">
            <Card.Body className="py-3 px-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center">
                        <Image src={rating.reviewerId.avatar} roundedCircle width="30" />
                        <span className="ms-2 fw-semibold text-dark">{rating.reviewerId.firstName} {rating.reviewerId.lastName}</span>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center">
                        {renderStars(rating.rating)}
                        <span className="ms-2 fw-semibold text-dark">{rating.rating}/5</span>
                    </div>
                    <small className="text-muted">
                        {formatDate(rating.createdAt)}
                    </small>
                </div>
                <p className="mb-0 text-dark" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {rating.comment}
                </p>
            </Card.Body>
        </Card>
    );
};

export default RatingCard;