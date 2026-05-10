import { Badge } from 'react-bootstrap';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'AP':
                return {
                    bg: 'success',
                    text: 'Đã duyệt',
                    icon: <FaCheckCircle className="me-1" />
                };
            case 'PE':
                return {
                    bg: 'warning',
                    text: 'Chờ duyệt',
                    icon: <FaClock className="me-1" />
                };
            case 'RE':
                return {
                    bg: 'danger',
                    text: 'Từ chối',
                    icon: <FaTimesCircle className="me-1" />
                };
            default:
                return {
                    bg: 'secondary',
                    text: 'Không xác định',
                    icon: null
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <Badge bg={config.bg} className="px-3 py-2 fs-6 fw-normal">
            {config.icon}
            {config.text}
        </Badge>
    );
};

export default StatusBadge;