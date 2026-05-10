import { useContext, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import cookie from 'react-cookies'
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/MyContexts";

const Login = () => {
    const info = [{
        "title": "Tên đăng nhập",
        "field": "username",
        "type": "text"
    }, {
        "title": "Mật khẩu",
        "field": "password",
        "type": "password"
    }];

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const nav = useNavigate();
    const [q] = useSearchParams();
    const [, dispatch] = useContext(MyUserContext);

    const login = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            let res = await Apis.post(endpoints['login'], {
                ...user,
                'client_id': 'G1gA0t0nIsAJqyBSc1iyNb1Daur3qktL7VxDyIAq',
                'client_secret': 'lqSXDmiqwSfVlKgRqYpl7mUofyAwZuUS3dmzkVMWx44T1PjndgQ2iZAOsJwouFCgy7B3frcdCq6DXVqhnrQlcUWChDrPGqYlmY3fh44tKVpFTg2xmqNayS3wspzFUFgM',
                'grant_type': 'password'
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            cookie.save('token', res.data.access_token);

            let u = await authApis().get(endpoints['profile']);
            dispatch({
                "type": "login",
                "payload": u.data
            })

            // console.log(u.data)

            let next = q.get('next');
            nav(next ? `/${next}` : "/");
        } catch (ex) {
            console.error(ex);

            if (ex.response) {
                const status = ex.response.status;

                if (status === 400) {
                    setMsg("Sai thông tin đăng nhập");
                } else if (status === 500) {
                    setMsg("Lỗi");
                } else {
                    setMsg(`Lỗi không xác định`);
                }
            } else {
                setMsg("Không thể kết nối đến máy chủ");
            }

        } finally {
            setLoading(false)
        }
    }

    const loginG = () => {
        alert("Tính năng đang phát triển.");
    }

    const loginF = () => {
        alert("Tính năng đang phát triển.");
    }

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: '100vh', background: '#fff' }}
        >
            <Container className="mb-5">
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="p-4 shadow border-0">
                            <Card.Body>
                                <h4 className="text-center mb-4">Đăng nhập</h4>

                                {msg ? <>
                                    <p className='text-danger' style={{ fontSize: '0.9rem' }}>
                                        * {msg}
                                    </p>
                                </> : <>

                                </>}

                                <Form onSubmit={login}>
                                    {info.map(i =>
                                        <Form.Group key={i.field} className="mb-4" controlId={i.field}>
                                            <Form.Control
                                                type={i.type}
                                                placeholder={i.title}
                                                onChange={e => setUser({ ...user, [i.field]: e.target.value })}
                                                value={user[i.field]}
                                                required
                                            />
                                        </Form.Group>
                                    )}
                                    {loading ? <Button
                                        variant="success"
                                        className="w-100 mb-3"
                                    >
                                        <Spinner animation="border" variant="light" size="sm" />
                                    </Button> : <Button
                                        variant="success"
                                        type="submit"
                                        className="w-100 mb-3"
                                    >
                                        Đăng nhập
                                    </Button>
                                    }
                                </Form>

                                <div className="d-flex align-items-center my-3">
                                    <hr className="flex-grow-1" />
                                    <span className="px-2 text-muted">or</span>
                                    <hr className="flex-grow-1" />
                                </div>

                                {/* <Button
                                    variant="outline-dark"
                                    className="w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                                    onClick={loginG}
                                >
                                    <img
                                        src="/icons/google.png"
                                        alt="Google icon"
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    Đăng nhập với Google
                                </Button>

                                <Button
                                    variant="outline-primary"
                                    className="w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
                                    onClick={loginF}
                                >
                                    <img
                                        src="/icons/facebook.png"
                                        alt="Google icon"
                                        style={{ width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '2px' }}
                                    />
                                    Đăng nhập với Facebook
                                </Button> */}

                                {/* <hr className="flex-grow-1" /> */}

                                <div className="text-center text-muted">
                                    Bạn chưa có tài khoản?
                                </div>
                                <div className="text-center mt-2">
                                    <Button variant="outline-success" size="sm" className="pe-4 ps-4 register-btn" onClick={() => nav("/register")}>
                                        Đăng ký
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;