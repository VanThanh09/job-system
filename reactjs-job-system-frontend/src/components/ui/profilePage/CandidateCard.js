import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Badge, Button, Card } from "react-bootstrap";
import { FaClock, FaComments, FaEnvelope, FaFileDownload, FaPhone, FaUser } from "react-icons/fa";
import { authApis, endpoints } from "../../../configs/Apis";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyUserContext } from "../../../configs/MyContexts";

const CandidateCard = ({ user, candidate, similarity }) => {
    const nav = useNavigate();
    const [myUser,] = useContext(MyUserContext);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDownloadCV = (cvUrl) => {
        window.open(cvUrl, '_blank');
    };

    const handleChat = async (id) => {
        try {
            if (!id)
                return;

            let res = await authApis().get(endpoints['info_user'](id));

            if (res.data.id === myUser.id) {
                alert("Bạn không thể chat với chính mình");
                return;
            }

            nav('/chatv2', {
                state: {
                    isNew: true,
                    receiverUser: res.data,
                }
            });
        } catch (ex) {
            console("Lỗi load người để chat", ex);
        }
    };

    return <>
        <Card className="candidate-card h-100 shadow-sm border-0">
            <Card.Body className="p-4">
                <div className="d-flex align-items-start mb-3">
                    <div className="avatar-container me-3">
                        <img
                            src={user.avatar}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="avatar"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=007bff&color=fff&size=80`;
                            }}
                        />
                    </div>
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <h4 className="candidate-name mb-1">
                                <FaUser className="me-2 text-dark" size={20} />
                                {user.first_name} {user.last_name}
                            </h4>

                            <Button variant="outline-success" size="sm" onClick={() => handleChat(user.id)}>
                                <FaComments className="me-1" />
                                Chat
                            </Button>

                        </div>
                        <div className="candidate-info">
                            {similarity && (
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <span className="fw-semibold text-muted">Độ phù hợp:</span>

                                    {similarity > 0.4 && (
                                        <Badge bg="success" className="d-flex align-items-center gap-1 px-2 py-1">
                                            Cao
                                        </Badge>
                                    )}

                                    {similarity > 0.3 && similarity <= 0.4 && (
                                        <Badge bg="warning" className="d-flex align-items-center gap-1 px-2 py-1">
                                            Trung bình
                                        </Badge>
                                    )}

                                    {similarity <= 0.3 && (
                                        <Badge bg="secondary" className="d-flex align-items-center gap-1 px-2 py-1">
                                            Thấp
                                        </Badge>
                                    )}
                                </div>
                            )}
                            <p className="info-item mb-2">
                                <FaEnvelope className="me-2 text-muted" />
                                <span>{user.email}</span>
                            </p>
                            <p className="info-item mb-2">
                                <FaPhone className="me-2 text-muted" />
                                <span>{user.phone_number}</span>
                            </p>
                            <p className="info-item mb-3">
                                <FaClock className="me-2 text-muted" />
                                <small className="text-muted">
                                    Cập nhật: {formatDate(candidate.updated_at)}
                                </small>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card-actions">
                    <Button
                        variant="success"
                        size="sm"
                        className="download-btn w-100"
                        onClick={() => handleDownloadCV(candidate.cv, `${user.first_name} ${user.last_name}`)}
                    >
                        <FaFileDownload className="me-2" />
                        Xem/Tải CV
                    </Button>
                </div>
            </Card.Body>
        </Card>
    </>
}

export default CandidateCard;