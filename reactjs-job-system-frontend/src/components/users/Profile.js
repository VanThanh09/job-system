import { useContext } from "react";
import { MyUserContext } from "../../configs/MyContexts";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { FaEnvelope, FaPhone, FaCalendarAlt, FaBriefcase, FaUserTie } from "react-icons/fa";
import moment from "moment";
import CandidateInfo from "./CandidateInfo";
import EmployeeInfo from "./EmployeeInfo";

const Profile = () => {
    const nav = useNavigate();

    const [user,] = useContext(MyUserContext);

    if (!user || user === null) {
        return (
            <Container className="my-5 text-center">
                <h5>Bạn cần đăng nhập để tiếp tục</h5>
                <Button variant="success" size="sm" className="mt-2" onClick={() => nav("/login")}>
                    Đăng nhập
                </Button>
            </Container>
        );
    }

    return <div>
        <Container className="my-3">
            {/* Profile Header Card */}
            <div
                className="mb-4"
                style={{
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                    border: '1px solid #e9ecef',
                    overflow: 'hidden',
                }}
            >
                {/* Header banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    height: '80px',
                }} />

                <div className="px-4 pb-4">
                    <Row className="align-items-end g-3" style={{ marginTop: '-48px' }}>
                        {/* Avatar */}
                        <Col xs="auto">
                            <div style={{
                                width: '96px',
                                height: '96px',
                                borderRadius: '50%',
                                border: '4px solid #fff',
                                boxShadow: '0 2px 12px rgba(25,135,84,0.25)',
                                overflow: 'hidden',
                                background: '#f8f9fa',
                            }}>
                                <Image
                                    src={user.avatar}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </Col>

                        {/* Name + role badge */}
                        <Col>
                            <div className="mt-3">
                                <h5 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>
                                    {user.first_name} {user.last_name}
                                </h5>
                                <span
                                    style={{
                                        background: user?.user_role === 'EM'
                                            ? 'linear-gradient(135deg, #1a1a2e, #16213e)'
                                            : 'linear-gradient(135deg, #198754, #20c997)',
                                        color: '#fff',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        padding: '3px 12px',
                                        borderRadius: '20px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                    }}
                                >
                                    {user?.user_role === 'EM'
                                        ? <><FaUserTie size={11} /> Nhà tuyển dụng</>
                                        : <><FaBriefcase size={11} /> Ứng viên</>}
                                </span>
                            </div>
                        </Col>
                    </Row>

                    {/* Info row */}
                    <div
                        className="d-flex flex-wrap gap-4 mt-4"
                        style={{ borderTop: '1px solid #f1f3f5', paddingTop: '16px' }}
                    >
                        <div className="d-flex align-items-center gap-2" style={{ color: '#495057', fontSize: '0.875rem' }}>
                            <FaEnvelope size={13} color="#198754" />
                            <span>{user?.email}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2" style={{ color: '#495057', fontSize: '0.875rem' }}>
                            <FaPhone size={13} color="#198754" />
                            <span>{user?.phone_number || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2" style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                            <FaCalendarAlt size={12} color="#adb5bd" />
                            <span>Tham gia {moment(user.createdAt).utcOffset(7).format('DD/MM/YYYY')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {user.user_role === "EM" ? <>
                <EmployeeInfo />
            </> : <>
                <CandidateInfo cv_info={user.candidate_info} />
            </>}
        </Container>
    </div>
}

export default Profile;