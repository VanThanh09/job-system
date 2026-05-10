import { useContext, useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown, Image } from 'react-bootstrap';
import { FaHome, FaInfoCircle, FaServicestack, FaEnvelope, FaPhone, FaBars } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import './styles.css';
import { Link, useNavigate } from "react-router-dom";
import { BiSolidLogIn } from 'react-icons/bi';
import { MyUserContext } from '../../configs/MyContexts';
import cookie, { load } from 'react-cookies';
import { MdWork } from 'react-icons/md';
import NotificationDropdown from '../ui/header/NotificationDropdown';
import { IoChatbubbleEllipses } from "react-icons/io5";

const Header = () => {
    const [expanded, setExpanded] = useState(false);
    const nav = useNavigate();
    const [user, dispatch] = useContext(MyUserContext);

    const handleLoginPress = () => {
        nav("/login");
    }

    const handleLogoutPress = () => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
        if (confirmed) {
            cookie.remove('token');

            dispatch({
                type: 'logout'
            });

            nav("/");
        }
    }

    const handleProfilePress = () => {
        nav("/profile");
    }

    const handleJobPress = () => {
        nav("/jobs");
    }

    const handleCandidatePress = () => {
        nav("/candidates");
    }

    const handleChatPress = () => {
        nav("/chatv2");
    }

    return (
        <Navbar
            expand="lg"
            className="custom-navbar shadow-sm"
            fixed="top"
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
        >
            <Container>
                <Navbar.Brand className="brand-logo">
                    <Link to={"/"} className='brand-text text-success text-decoration-none'>VĂN THÀNH</Link>
                </Navbar.Brand>

                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    className="border-0"
                >
                    {expanded ? <IoMdClose size={24} /> : <FaBars size={20} />}
                </Navbar.Toggle>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {/* <Nav.Link href="#home" className="nav-item-custom">
                            <FaHome className="me-1" />
                            Trang chủ
                        </Nav.Link>
                        <Nav.Link href="#about" className="nav-item-custom">
                            <FaInfoCircle className="me-1" />
                            Giới thiệu
                        </Nav.Link>
                        <Nav.Link href="#services" className="nav-item-custom">
                            <FaServicestack className="me-1" />
                            Dịch vụ
                        </Nav.Link> */}
                        <Nav.Link className="nav-item-custom" onClick={() => handleCandidatePress()}>
                            <MdWork className="me-1" />
                            Ứng viên
                        </Nav.Link>

                        <Nav.Link className="nav-item-custom" onClick={() => handleJobPress()}>
                            <MdWork className="me-1" />
                            Công việc
                        </Nav.Link>

                        <Nav.Link className="nav-item-custom" onClick={() => handleChatPress()}>
                            <IoChatbubbleEllipses className="me-1" size={22} />
                            Trò chuyện
                        </Nav.Link>

                        <Nav className='me-1'>
                            <NotificationDropdown />
                        </Nav>

                        {user ? <>
                            <Dropdown drop='end' className='ms-2'>
                                <Dropdown.Toggle as="div" className="custom-toggle" style={{ cursor: 'pointer', borderRadius: '50%', borderWidth: "3px" }}>
                                    <Image src={user.avatar} roundedCircle width="30" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item className='no-highlight' onClick={() => handleProfilePress()}>
                                        <div className='text-decoration-none align-items-center d-flex' style={{ fontWeight: '500', fontSize: '15px' }}>Tài khoản của tôi</div>
                                    </Dropdown.Item>
                                    {/* {user.userRole === 'ROLE_EMPLOYER' &&
                                        <Dropdown.Item className='no-highlight' onClick={() => handleCompany()}>
                                            <div className='text-decoration-none align-items-center d-flex' style={{ fontWeight: '500', fontSize: '15px' }}>Quản lý tuyển dụng</div>
                                        </Dropdown.Item>
                                    } */}
                                    <Dropdown.Item className='no-highlight' onClick={() => handleLogoutPress()}>
                                        <div className='text-decoration-none align-items-center d-flex' style={{ fontWeight: '500', fontSize: '15px' }}>Đăng xuất</div>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </> : <>
                            <Button variant="outline-light" className="nav-item-custom" onClick={handleLoginPress}>
                                <BiSolidLogIn className="me-1" />
                                Đăng nhập
                            </Button>
                        </>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;