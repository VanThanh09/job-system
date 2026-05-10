import { useState, useRef, useContext } from "react";
import { Container, Form, Button, Alert, Card, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../../configs/MyContexts";
import { FaBuilding, FaUpload, FaTimes, FaFileAlt, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import { BsImageFill, BsPlus } from 'react-icons/bs';
import { authApis, endpoints } from "../../configs/Apis";

const AddCompany = () => {
    const [error, setError] = useState("");

    const [images, setImages] = useState([]);
    const [company, setCompany] = useState({});
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const [user,] = useContext(MyUserContext);

    const handleInputCompany = (e) => {
        const { name, value } = e.target;
        setCompany({ ...company, [name]: value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...previews]);
    };

    const handleRemoveImage = (index) => {
        const newImages = [...images];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const validate = () => {
        if (images.length < 1) {
            setError("Vui lòng chọn ít nhất 1 hình ảnh.");
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            try {
                setLoading(true);
                setError("");

                const formData = new FormData();
                for (let key in company) {
                    formData.append(key, company[key]);
                }

                images.forEach(({ file }) => {
                    formData.append("images", file);
                });

                for (let pair of formData.entries()) {
                    console.log(pair[0] + ": ", pair[1]);
                }

                let res = await authApis().post(endpoints['addCompany'], formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 201)
                    nav("/profile");
            } catch (ex) {
                console(ex);
            } finally {
                setLoading(false);
            }
        }
    };

    if (!user || user == null) {
        return (
            <Container className="my-5 text-center">
                <h5>Bạn cần đăng nhập để tiếp tục</h5>
                <Button variant="success" size="sm" className="mt-2" onClick={() => nav("/login")}>
                    Đăng nhập
                </Button>
            </Container>
        );
    }

    if (user.user_role !== "EM") {
        return (
            <Container className="my-5 text-center">
                <h5>Bạn không thể thực hiện hành động này</h5>
            </Container>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4">
            <Container className="max-w-4xl">
                <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                        <div className="text-center">
                            <FaBuilding className="h-12 w-12 mx-auto mb-3" />
                            <h2 className="h3 mb-0 fw-bold">ĐĂNG KÝ CÔNG TY</h2>
                            <p className="mb-0 opacity-90">Hoàn thiện thông tin để đăng ký công ty của bạn</p>
                        </div>
                    </div>

                    <Card.Body className="p-5">
                        <Form onSubmit={handleSubmit}>
                            {error && (
                                <Alert variant="danger" className="d-flex align-items-center rounded-3">
                                    <FaTimes className="me-2" />
                                    {error}
                                </Alert>
                            )}

                            {/* Image Upload Section */}
                            <Card className="mb-4 border-0 bg-light rounded-3">
                                <Card.Body className="p-2">
                                    <div className="d-flex align-items-center mb-3">
                                        <BsImageFill className="text-dark me-2 h-5 w-5" />
                                        <Form.Label className="mb-0 fw-semibold">
                                            Hình ảnh công ty
                                            <span className="ms-2 text-xs text-danger">
                                                *
                                            </span>
                                        </Form.Label>
                                    </div>

                                    <Row className="g-3">
                                        {images.map((img, idx) => (
                                            <Col xs={6} sm={4} md={3} key={idx}>
                                                <div className="position-relative image-container">
                                                    <img
                                                        src={img.preview}
                                                        alt="preview"
                                                        className="w-100 rounded-3 shadow-sm"
                                                        style={{
                                                            height: '140px',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="position-absolute top-0 end-0 rounded-circle p-1 shadow-sm"
                                                        onClick={() => handleRemoveImage(idx)}
                                                        style={{
                                                            transform: 'translate(25%, -25%)',
                                                            width: '28px',
                                                            height: '28px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <FaTimes size={12} />
                                                    </Button>
                                                </div>
                                            </Col>
                                        ))}

                                        <Col xs={6} sm={4} md={3}>
                                            <div
                                                className="image-dropzone rounded-3 shadow-sm d-flex flex-column align-items-center justify-content-center"
                                                onClick={() => fileInputRef.current.click()}
                                                style={{
                                                    height: '140px',
                                                    border: '2px dashed #ddd',
                                                    backgroundColor: '#f8f9ff',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <BsPlus size={32} className="text-secondary mb-1" />
                                                <small className="text-secondary fw-medium">Thêm ảnh</small>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Form.Control
                                        type="file"
                                        name="images"
                                        multiple
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="d-none"
                                    />
                                </Card.Body>
                            </Card>

                            {/* Company Information */}
                            <Row className="g-4 p-2">
                                <Col md={12}>
                                    <div className="input-group-custom">
                                        <div className="d-flex align-items-center mb-2">
                                            <FaBuilding className="text-dark me-2" />
                                            <Form.Label className="mb-0 fw-semibold">
                                                Tên công ty
                                                <span className="text-danger ms-1">*</span>
                                            </Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={company.name || ""}
                                            onChange={handleInputCompany}
                                            placeholder="Nhập tên công ty"
                                            className="rounded-3 border-2 py-2"
                                            required
                                        />
                                    </div>
                                </Col>

                                <Col md={12}>
                                    <div className="input-group-custom">
                                        <div className="d-flex align-items-center mb-2">
                                            <FaFileAlt className="text-dark me-2" />
                                            <Form.Label className="mb-0 fw-semibold">
                                                Mô tả công ty
                                                <span className="text-danger ms-1">*</span>
                                            </Form.Label>
                                        </div>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="description"
                                            value={company.description || ""}
                                            onChange={handleInputCompany}
                                            placeholder="Mô tả về hoạt động và dịch vụ của công ty"
                                            className="rounded-3 border-2"
                                            required
                                        />
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="input-group-custom">
                                        <div className="d-flex align-items-center mb-2">
                                            <FaIdCard className="text-dark me-2" />
                                            <Form.Label className="mb-0 fw-semibold">
                                                Mã số thuế
                                                <span className="text-danger ms-1">*</span>
                                            </Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="tax_id"
                                            value={company.tax_id || ""}
                                            onChange={handleInputCompany}
                                            placeholder="Nhập mã số thuế"
                                            className="rounded-3 border-2 py-2"
                                            required
                                        />
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="input-group-custom">
                                        <div className="d-flex align-items-center mb-2">
                                            <FaMapMarkerAlt className="text-dark me-2" />
                                            <Form.Label className="mb-0 fw-semibold">
                                                Địa chỉ
                                                <span className="text-danger ms-1">*</span>
                                            </Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={company.address || ""}
                                            onChange={handleInputCompany}
                                            placeholder="Nhập địa chỉ công ty"
                                            className="rounded-3 border-2 py-2"
                                            required
                                        />
                                    </div>
                                </Col>
                            </Row>

                            {/* Warning Message */}
                            <Alert variant="warning" className="mt-4 rounded-3 border-0">
                                <div className="d-flex align-items-start">
                                    <FaFileAlt className="text-warning me-2 mt-1 flex-shrink-0" />
                                    <small>
                                        <strong>Lưu ý:</strong> Vui lòng xác nhận thông tin trên là chính xác.
                                        Chúng tôi sẽ từ chối yêu cầu khi thấy thông tin không phù hợp.
                                    </small>
                                </div>
                            </Alert>

                            {/* Submit Button */}
                            <div className="text-center mt-4">
                                {loading ? (
                                    <Button
                                        disabled
                                        variant="success"
                                        className="px-5 py-2 rounded-3 fw-semibold"
                                        style={{ minWidth: '140px' }}
                                    >
                                        <Spinner animation="border" variant="light" size="sm" /> Đang xử lý...
                                    </Button>
                                ) : (
                                    <Button
                                        variant="success"
                                        type="submit"
                                        className="px-5 py-2 rounded-3 fw-semibold shadow-sm"
                                        style={{ minWidth: '140px' }}
                                    >
                                        <FaUpload className="me-2" />
                                        Gửi đăng ký
                                    </Button>
                                )}
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Custom Styles */}
                <style>{`
          .spin {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .image-dropzone:hover {
            background-color: #e7f1ff !important;
            border-color: #0056b3 !important;
            transform: translateY(-2px);
          }

          .image-container {
            transition: transform 0.3s ease;
          }

          .image-container:hover {
            transform: translateY(-3px);
          }

          .input-group-custom .form-control:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          }

          .card {
            transition: all 0.3s ease;
          }

          .btn {
            transition: all 0.3s ease;
          }

          .btn:hover {
            transform: translateY(-1px);
          }

          .h-5 { height: 1.25rem; }
          .w-5 { width: 1.25rem; }
          .h-12 { height: 3rem; }
          .w-12 { width: 3rem; }
          .text-xs { font-size: 0.75rem; }
          .max-w-4xl { max-width: 56rem; }
          .rounded-4 { border-radius: 1rem !important; }
        `}</style>
            </Container>
        </div>
    );
};

export default AddCompany;