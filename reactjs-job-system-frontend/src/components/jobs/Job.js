import { useContext, useEffect, useState } from "react";
import { Container, Spinner, Row, Col, Card, Badge, Button, Image, Modal, Form, Alert } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { FaMapMarkerAlt, FaClock, FaBuilding, FaPhone, FaEnvelope, FaHeart, FaPaperPlane, FaCalendarAlt, FaTag, FaMoneyBillAlt, FaComments, FaUser, FaTimes, FaUpload } from 'react-icons/fa';
import "./styles.css"
import { MyUserContext } from "../../configs/MyContexts";

const Job = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [job, setJob] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [applicationData, setApplicationData] = useState({
        title: '',
        description: '',
        cv_file: null,
        job_posting: 0,
    });
    const [user,] = useContext(MyUserContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const nav = useNavigate();

    const [isFollow, setIsFollow] = useState(false);

    const loadJob = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['job'](id));

            if (res.status === 200) {
                setJob(res.data);
            }
        } catch (ex) {
            console.error("Không thể tải job", ex);
        } finally {
            setLoading(false);
        }
    }

    const checkFollow = async () => {
        try {
            let res = await authApis().get(endpoints['job'](id));

            if (res.status === 200) {
                setIsFollow(res.data.is_following);
            }
        } catch (ex) {
            console.error("Không thể tải job", ex);
        } finally {
        }
    }

    useEffect(() => {
        loadJob();
        checkFollow();
    }, [])

    useEffect(() => {
        checkFollow();
    }, [job])

    const formatSalary = (salary) => {
        return (salary / 1000000).toLocaleString('vi-VN') + ' triệu VNĐ';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setApplicationData({
            title: '',
            description: '',
            cv_file: null
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setApplicationData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setApplicationData(prev => ({
            ...prev,
            cv_file: file
        }));
    };

    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            let formData = new FormData();

            for (let key in applicationData) {
                formData.append(key, applicationData[key]);
            }

            formData.append("job_posting", job.id);

            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            let res = await authApis().post(endpoints['application'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (res.status === 201) {
                alert('Ứng tuyển thành công! Vui lòng chờ công ty xét duyệt bạn.');
                handleCloseModal();
            }
        } catch (ex) {
            if (ex.response) {
                if (ex.response.status === 400) {
                    alert('Bạn đã ứng tuyển cho vị trí này rồi.');
                } else if (ex.response.status === 500) {
                    alert('Hệ thống đang gặp sự cố, vui lòng thử lại sau.');
                } else {
                    alert(`Có lỗi xảy ra (mã lỗi: ${ex.response.status}).`);
                }
            } else {
                console.error("Lỗi không xác định:", ex);
                alert("Không thể kết nối tới server.");
            }
            handleCloseModal();
            console.log("Lỗi ứng tuyển", ex);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleFollow = async () => {
        if (!user) {
            setShowModal(true);
            return;
        }

        try {
            let res = await authApis().post(endpoints['follow'], {
                "company": job.company.id
            })

            if (res.status == 201) {
                checkFollow();
            }
        } catch (ex) {
            console.log("Lỗi khi follow", ex);
        }
    };

    const handleUnFollow = async () => {
        try {
            let res = await authApis().delete(endpoints['unfollow'](isFollow.id))

            if (res.status == 204) {
                checkFollow();
            }
        } catch (ex) {
            console.log("Lỗi khi unfollow", ex);
        }
    };

    const handleChat = (receiverUser) => {
        if (!user) {
            setShowModal(true);
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


    const handleApply = () => {
        if (user.user_role !== "CA") {
            alert("Chỉ ứng viên mới có thể ứng tuyển!!");
            return;
        }
        setShowModal(true);
    };

    return (
        <Container>
            {loading ? <>
                <div className="py-5 d-flex justify-content-center">
                    <Spinner animation="border" variant="success" />
                </div>
            </> : <>
                <Row>
                    <Col lg={8}>
                        {/* Job Header */}
                        <Card className="mb-4 shadow-sm">
                            <Card.Body>
                                <div className="justify-content-between align-items-start mb-3">
                                    <div className="flex-grow-1">
                                        <h1 className="h3 text-dark">{job.title}</h1>

                                    </div>

                                    <div className="d-flex gap-3 mb-2">
                                        <Badge
                                            bg="success"
                                            text="light"
                                            className="d-flex align-items-center p-2"
                                        >
                                            <FaTag className="me-1" />
                                            {/* <Image
                                                    src={cat.logo}
                                                    width={40}
                                                    height={40}
                                                    className="me-1"
                                                    alt={cat.name}
                                                /> */}
                                            {job.category?.name}
                                        </Badge>
                                    </div>

                                    <div className="d-flex flex-wrap gap-3 mb-3">
                                        <div className="d-flex align-items-center text-muted">
                                            <FaBuilding className="me-2" />
                                            <span>{job.company?.name}</span>
                                        </div>
                                        <div className="d-flex align-items-center text-muted">
                                            <FaMapMarkerAlt className="me-2" />
                                            <span>{job.address}</span>
                                        </div>
                                    </div>

                                </div>

                                <Row className="g-3 mb-4">
                                    <Col sm={6} md={3}>
                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <FaMoneyBillAlt className="text-success me-3 fs-5" />
                                            <div>
                                                <div className="small text-muted">Mức lương</div>
                                                <div className="fw-bold">{formatSalary(job.salary)}</div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={6} md={3}>
                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <FaClock className="text-info me-3 fs-5" />
                                            <div>
                                                <div className="small text-muted">Giờ làm việc</div>
                                                <div className="fw-bold">{job.work_time} giờ/tuần</div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={6} md={3}>
                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <FaCalendarAlt className="text-warning me-3 fs-5" />
                                            <div>
                                                <div className="small text-muted">Ngày đăng</div>
                                                <div className="fw-bold">{formatDate(job.created_at)}</div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={6} md={3}>
                                        <div className="d-flex align-items-center p-3 bg-light rounded">
                                            <div className={`rounded-circle me-3 ${job.is_active ? 'bg-success' : 'bg-danger'}`}
                                                style={{ width: '12px', height: '12px' }}></div>
                                            <div>
                                                <div className="small text-muted">Trạng thái</div>
                                                <div className="fw-bold">
                                                    {job.is_active ? 'Đang tuyển' : 'Đã đóng'}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <div className="text-center">
                                    <Button
                                        variant="outline-success"
                                        size="lg"
                                        className="px-5 py-2"
                                        onClick={handleApply}
                                        disabled={!job.is_active}
                                    >
                                        <FaPaperPlane className="me-2" />
                                        Ứng tuyển ngay
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Job Description */}
                        <Card className="mb-4 shadow-sm">
                            <Card.Header className="bg-white">
                                <h4 className="mb-0 text-dark">Mô tả công việc</h4>
                            </Card.Header>
                            <Card.Body>
                                <div className="job-description" style={{ lineHeight: '1.8' }}>
                                    {job.description}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        {/* Company Information */}
                        <Card className="mb-4 shadow-sm">
                            <Card.Header style={{ backgroundColor: "white" }}>
                                <h5 className="mb-0">
                                    <FaBuilding className="me-2" />
                                    Thông tin công ty
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="text-center mb-3">
                                    <Image
                                        src={job.company?.user.avatar}
                                        roundedCircle
                                        width="100"
                                        height="100"
                                        className="mb-3"
                                    />
                                    <h5 className="">{job.company?.name}</h5>
                                    <div className="d-flex justify-content-center gap-2 mb-3">
                                        <Button variant="outline-success" size="sm" onClick={() => handleChat(job.company.user)}>
                                            <FaComments className="me-1" />
                                            Chat
                                        </Button>
                                        {isFollow ?
                                            <Button variant="outline-info" size="sm" onClick={handleUnFollow}>
                                                <FaHeart className="me-1" />
                                                Bỏ theo dõi
                                            </Button>
                                            :
                                            <Button variant="outline-info" size="sm" onClick={handleFollow}>
                                                <FaHeart className="me-1" />
                                                Theo dõi
                                            </Button>
                                        }


                                    </div>
                                </div>

                                <div className="company-info">
                                    <div className="text-muted">
                                        <div className="mb-1">
                                            <strong>Mô tả công ty:</strong> {job.company?.description}
                                        </div>
                                        <div className="mb-1">
                                            <strong>Mã số thuế:</strong> {job.company?.tax_id}
                                        </div>
                                        <div>
                                            <strong>Ngày thành lập:</strong> {formatDate(job.company?.created_at)}
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="contact-info">
                                        <h6 className="text-success mb-2">Thông tin liên hệ</h6>

                                        <div className="mb-1 d-flex align-items-center">
                                            <FaUser className="text-muted me-2" />
                                            <span>
                                                {job.company?.user.first_name} {job.company?.user.last_name}
                                            </span>
                                        </div>

                                        <div className="mb-1 d-flex align-items-center">
                                            <FaPhone className="text-muted me-2" />
                                            <div>
                                                {job.company?.user.phone_number}
                                            </div>
                                        </div>

                                        <div className="mb-1 d-flex align-items-center">
                                            <FaEnvelope className="text-muted me-2" />
                                            <div>
                                                {job.company?.user.email}
                                            </div>
                                        </div>

                                        <div className="mb-1 d-flex align-items-center">
                                            <FaMapMarkerAlt className="text-muted me-2" />
                                            <span>{job.company?.address}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Application Modal */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                    {user ? <>
                        <Modal.Header className="bg-success text-white d-flex">
                            <Modal.Title className='flex-grow-1' >
                                <FaPaperPlane className="me-2" />
                                Ứng tuyển: {job.title}
                            </Modal.Title>
                            <Button
                                variant="link"
                                className="text-white border-0"
                                onClick={handleCloseModal}
                            >
                                <FaTimes size={20} />
                            </Button>
                        </Modal.Header>
                        <Modal.Body className="p-4">
                            <div className="mb-4">
                                <div className="d-flex align-items-center mb-2">
                                    <Image
                                        src={job.company?.user.avatar}
                                        roundedCircle
                                        width="40"
                                        height="40"
                                        className="me-3"
                                    />
                                    <div>
                                        <h6 className="mb-0 text-dark">{job.company?.name}</h6>
                                        <small className="text-muted">{job.address}</small>
                                    </div>
                                </div>
                            </div>

                            <Form onSubmit={handleSubmitApplication}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">
                                        Tiêu đề ứng tuyển <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={applicationData.title}
                                        onChange={handleInputChange}
                                        placeholder="Ví dụ: Ứng tuyển vị trí..."
                                        required
                                        maxLength={255}
                                    />
                                    <Form.Text className="text-muted">
                                        {applicationData.title.length}/255 ký tự
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">
                                        Thư giới thiệu <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={6}
                                        name="description"
                                        value={applicationData.description}
                                        onChange={handleInputChange}
                                        placeholder="Hãy viết một thư giới thiệu ngắn gọn về bản thân, kinh nghiệm và lý do bạn muốn ứng tuyển vào vị trí này..."
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Tối thiểu 10 ký tự ({applicationData.description.length} ký tự)
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">
                                        Tải lên CV <span className="text-danger">*</span>
                                    </Form.Label>
                                    <div className="border rounded p-3 bg-light">
                                        <Form.Control
                                            type="file"
                                            name="cv_file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx"
                                            required
                                            className="mb-2"
                                        />
                                        <div className="d-flex align-items-center text-muted">
                                            <FaUpload className="me-2" />
                                            <small>
                                                Chấp nhận file PDF, DOC, DOCX. Tối đa 5MB.
                                                {/* {applicationData.cv_file && (
                                            <span className="text-success ms-2">
                                                ✓ {applicationData.cv_file.name}
                                            </span>
                                        )} */}
                                            </small>
                                        </div>
                                    </div>
                                </Form.Group>

                                <div className="bg-light p-3 rounded mb-4">
                                    <h5 className="text-dark mb-2">Liên hệ</h5  >
                                    <div className="row">
                                        <div className="col-md-6">
                                            <small className="text-muted d-block">Email liên hệ:</small>
                                            <strong>{job.company?.user.email}</strong>
                                        </div>
                                        <div className="col-md-6">
                                            <small className="text-muted d-block">Số điện thoại:</small>
                                            <strong>{job.company?.user.phone_number}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={handleCloseModal}
                                        disabled={isSubmitting}
                                    >
                                        Hủy bỏ
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={isSubmitting || applicationData.description.length < 10}
                                        className="px-4"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane className="me-2" />
                                                Gửi ứng tuyển
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </> : <>
                        <Modal.Body >
                            <div className="text-center h5">Hãy đăng nhập !!!</div>

                            <div className="d-flex justify-content-center mt-4">
                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => { nav("/login") }}
                                >
                                    Đăng nhập
                                </Button>
                            </div>
                        </Modal.Body>
                    </>}
                </Modal>
            </>}
        </Container>
    )
}

export default Job;