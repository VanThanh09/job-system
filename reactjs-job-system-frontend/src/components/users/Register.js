import { useRef, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { GrUserWorker } from "react-icons/gr";
import { CgWorkAlt } from "react-icons/cg";
import { IoArrowBack } from "react-icons/io5";
import Apis, { endpoints } from "../../configs/Apis";

const Register = () => {
    const info = [{
        "title": "Số điện thoại",
        "field": "phone_number",
        "type": "tel"
    }, {
        "title": "Email",
        "field": "email",
        "type": "email"
    }, {
        "title": "Tên đăng nhập",
        "field": "username",
        "type": "text"
    }, {
        "title": "Mật khẩu",
        "field": "password",
        "type": "password"
    }, {
        "title": "Xác nhận mật khẩu",
        "field": "confirm",
        "type": "password"
    }];

    const nav = useNavigate();
    const [step, setStep] = useState(1);
    const [userRole, setUserRole] = useState('');
    const [user, setUser] = useState({});
    const avatar = useRef();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [registered, setRegistered] = useState(false);

    const validate = () => {
        if (user.confirm === null || user.password === null || user.confirm !== user.password) {
            setMsg("Xác nhập mật khẩu không đúng !!!")
            return false;
        }

        return true;
    }

    const register = async (e) => {
        e.preventDefault();

        if (validate()) {
            try {
                setLoading(true);
                setMsg("");

                let formData = new FormData();

                for (let key in user) {
                    if (key !== 'confirm')
                        formData.append(key, user[key]);
                }

                if (avatar.current.files.length > 0) {
                    formData.append("avatar", avatar.current.files[0]);
                }

                if (userRole) {
                    formData.append("user_role", userRole);
                }

                // for (let [key, value] of formData.entries()) {
                //     console.log(key, value);
                // }

                let res = await Apis.post(endpoints['register'], formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 201) {
                    setRegistered(true);
                }

            } catch (ex) {
                console.log(ex);

                if (ex.response) {
                    const status = ex.response.status;

                    if (status === 400) {
                        let data = ex.response.data;
                        if (data) {
                            if (data.username) setMsg("Tên đăng nhập đã tồn tại");
                            if (data.phone_number) setMsg("Số điện thoại đã tồn tại");
                            if (data.email) setMsg("Email đã tồn tại");
                        } else {
                            setMsg("Thông tin không hợp lệ");
                        }
                    } else if (status === 500) {
                        setMsg("Lỗi server. Vui lòng thử lại sau");
                    } else {
                        setMsg(`Lỗi không xác định`);
                    }
                } else {
                    setMsg("Không thể kết nối đến máy chủ");
                }
            } finally {
                setLoading(false);
            }
        }
    }

    if (registered) {
        return (
            <div style={{
                marginTop: "100px",
                background: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                    maxWidth: '460px',
                    width: '100%'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✉️</div>
                    <h4 style={{ color: '#198754', fontWeight: 700, marginBottom: '12px' }}>
                        Đăng ký thành công!
                    </h4>
                    <p style={{ color: '#444', marginBottom: '8px' }}>
                        Chúng tôi đã gửi mail xác thực cho bạn.<br />
                        Vui lòng kiểm tra Gmail để xác thực tài khoản.
                    </p>
                    <Button variant="success" className="mt-3" onClick={() => nav("/login")}>
                        Chuyển đến đăng nhập
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col lg={7} md={11} xs={11}>

                        {step === 1 && <>
                            <h4 className="text-center m-4">Tham gia với tư cách nhà tuyển dụng hoặc ứng viên</h4>

                            <Row className="g-3 justify-content-center mt-4">
                                <Col md={11} lg={5}>
                                    <Card
                                        className={`p-3 border-2 ${userRole === 'CA' ? 'border-success' : 'border-dark'}`}
                                        onClick={() => setUserRole('CA')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div><GrUserWorker style={{ fontSize: '1.5rem' }} /></div>
                                                <Form.Check
                                                    type="radio"
                                                    name="role"
                                                    checked={userRole === 'CA'}
                                                    readOnly
                                                />
                                            </div>
                                            <Card.Text className="mt-3 fw-bold">
                                                Tôi là người làm việc, đang tìm việc.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col md={11} lg={5}>
                                    <Card
                                        className={`p-3 border-2 ${userRole === 'EM' ? 'border-success' : 'border-dark'}`}
                                        onClick={() => setUserRole('EM')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div><CgWorkAlt style={{ fontSize: '1.5rem' }} /></div>
                                                <Form.Check
                                                    type="radio"
                                                    name="role"
                                                    checked={userRole === 'EM'}
                                                    readOnly
                                                />
                                            </div>
                                            <Card.Text className="mt-3 fw-bold">
                                                Tôi là nhà tuyển dụng, đang tuyển dụng.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-center align-items-center mb-3">
                                {userRole ? <>
                                    <Button variant="success" size="md" className="mt-5 mb-2" onClick={() => setStep(2)}>
                                        {userRole === 'CA' ? 'Đăng ký là ứng viên' : 'Đăng ký là nhà tuyển dụng'}
                                    </Button>
                                </> : <>
                                    <Button variant="secondary" size="md" className="mt-5 mb-2" disabled>
                                        Đăng ký
                                    </Button>
                                </>}
                            </div>
                        </>}

                        {step === 2 && <>
                            <div className="d-flex align-items-center position-relative" style={{ height: '60px' }}>
                                <div className="position-absolute start-0 rounded-circle border" style={{ cursor: 'pointer' }}>
                                    <IoArrowBack size={24} onClick={() => setStep(1)} className="m-2" />
                                </div>
                                <h4 className="mx-auto m-0">
                                    {userRole === 'candidate' ? 'Đăng ký là ứng viên' : 'Đăng ký là nhà tuyển dụng'}
                                </h4>
                            </div>

                            {msg ? <>
                                <Alert variant='danger'>
                                    {msg}
                                </Alert>
                            </> : <>
                            </>}

                            <Row className="g-3 justify-content-center">
                                <Col xs={12} md={12}>
                                    <Form onSubmit={register} className="p-4">
                                        <Row className="mb-3">
                                            <Col>
                                                <Form.Group controlId="first_name">
                                                    <Form.Label>Tên</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        name="first_name"
                                                        value={user['first_name']}
                                                        onChange={e => setUser({ ...user, 'first_name': e.target.value })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group controlId="last_name">
                                                    <Form.Label>Họ</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        name="last_name"
                                                        value={user['last_name']}
                                                        onChange={e => setUser({ ...user, 'last_name': e.target.value })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {info.map(i =>
                                            <Form.Group controlId={i.field} className="mb-3" key={i.field}>
                                                <Form.Label>{i.title}</Form.Label>
                                                <Form.Control
                                                    required
                                                    type={i.type}
                                                    name={i.field}
                                                    value={user[i.field]}
                                                    onChange={e => setUser({ ...user, [i.field]: e.target.value })}
                                                />
                                            </Form.Group>
                                        )}

                                        <Form.Group controlId='avatar' className="mb-3">
                                            <Form.Label>Ảnh đại diện</Form.Label>
                                            <Form.Control type="file" ref={avatar} required />
                                        </Form.Group>

                                        <div className="d-flex justify-content-center align-items-center">
                                            {!loading ? <>
                                                <Button type="submit" variant="success" size="md" className="mt-2 mb-2" onClick={() => setStep(2)} style={{ width: '250px' }}>
                                                    Đăng ký
                                                </Button>
                                            </> : <>
                                                <Button variant="success" size="md" className="mt-2 mb-2" disabled style={{ width: '250px' }}>
                                                    <Spinner animation="border" variant="light" size="sm" />
                                                </Button>
                                            </>}

                                        </div>

                                    </Form>
                                </Col>
                            </Row>
                        </>}

                        <p className="text-center">
                            Bạn đã có tài khoản? <Link to="/login" className="text-success">Đăng nhập</Link>
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Register;