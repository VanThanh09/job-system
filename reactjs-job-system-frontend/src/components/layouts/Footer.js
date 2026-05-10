import { Container, Row, Col } from 'react-bootstrap';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaClock,
    FaHeart
} from 'react-icons/fa';
import './styles.css';

const Footer = () => {
    return (
        <footer className="custom-footer">
            <Container>
                <Row className="py-5">
                    <Col lg={4} md={6} className="mb-4">
                        <h5 className="footer-title">VĂN THÀNH</h5>
                        <p className="footer-description">
                            Chúng tôi cam kết mang đến những dịch vụ tốt nhất và trải nghiệm
                            tuyệt vời nhất cho khách hàng của mình.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link">
                                <FaFacebookF />
                            </a>
                            <a href="#" className="social-link">
                                <FaTwitter />
                            </a>
                            <a href="#" className="social-link">
                                <FaInstagram />
                            </a>
                            <a href="#" className="social-link">
                                <FaLinkedinIn />
                            </a>
                        </div>
                    </Col>

                    <Col lg={2} md={6} className="mb-4">
                        <h6 className="footer-subtitle">Liên kết</h6>
                        <ul className="footer-links">
                            <li><a href="#home">Trang chủ</a></li>
                            <li><a href="#about">Giới thiệu</a></li>
                            <li><a href="#services">Dịch vụ</a></li>
                            <li><a href="#portfolio">Portfolio</a></li>
                            <li><a href="#blog">Blog</a></li>
                        </ul>
                    </Col>

                    <Col lg={3} md={6} className="mb-4">
                        <h6 className="footer-subtitle">Dịch vụ</h6>
                        <ul className="footer-links">
                            <li><a href="#">Thiết kế Website</a></li>
                            <li><a href="#">Phát triển App</a></li>
                            <li><a href="#">Digital Marketing</a></li>
                            <li><a href="#">Tư vấn IT</a></li>
                            <li><a href="#">Hỗ trợ kỹ thuật</a></li>
                        </ul>
                    </Col>

                    <Col lg={3} md={6} className="mb-4">
                        <h6 className="footer-subtitle">Liên hệ</h6>
                        <div className="contact-info">
                            <div className="contact-item">
                                <FaMapMarkerAlt className="contact-icon" />
                                <span>Đại học Mở Thành phố Hồ Chí Mình</span>
                            </div>
                            <div className="contact-item">
                                <FaPhone className="contact-icon" />
                                <span>+84 345 067 145</span>
                            </div>
                            <div className="contact-item">
                                <FaEnvelope className="contact-icon" />
                                <span>2251052115thanh@ou.edu.vn</span>
                            </div>
                            <div className="contact-item">
                                <FaClock className="contact-icon" />
                                <span>T2-T6: 8:00 - 18:00</span>
                            </div>
                        </div>
                    </Col>
                </Row>

                <hr className="footer-divider" />

                <Row className="py-3">
                    <Col md={6}>
                        <p className="copyright-text">
                            © 2025 Van Thanh. Tất cả quyền được bảo lưu.
                        </p>
                    </Col>
                    <Col md={6} className="text-md-end">
                        <p className="made-with-love">
                            Made with <FaHeart className="heart-icon" size={12} /> in Vietnam
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;