import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Building2, MapPin, DollarSign, Clock, FileText, Briefcase, Send, AlertCircle, Tag } from 'lucide-react';
import Apis, { authApis, endpoints } from '../../configs/Apis';
import { useSearchParams } from 'react-router-dom';

const AddPosting = () => {
    const [job, setJob] = useState({
        title: '',
        description: '',
        salary: '',
        work_time: '',
        address: '',
        company: '',
        category: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [companies, setCompanies] = useState([]);
    const [params] = useSearchParams();
    const [categories, setCategories] = useState([]);

    const loadCate = async () => {
        try {
            let res = await Apis.get(endpoints['categories']);
            if (res.status === 200) {
                setCategories(res.data);
            }
        } catch (ex) {
            console.error("Lỗi load danh sách danh mục", ex);
        }
    }

    const loadCompanies = async () => {
        try {
            let res = await authApis().get(endpoints['myCompanies']);
            if (res.status === 200) {
                let companyValid = res.data.filter(com => (com.status === "AP"));
                setCompanies(companyValid);
            }
        } catch (ex) {
            console.error("Lỗi load danh sách công ty", ex);
        } finally {

        }
    }

    useEffect(() => {
        loadCompanies();
        loadCate();
    }, []);

    useEffect(() => {
        const selectedCompanyId = params.get("companyId");
        if (selectedCompanyId) {
            setJob(prev => ({
                ...prev,
                company: selectedCompanyId
            }));
        }
    }, [params]);

    const validateForm = () => {
        const newErrors = {};

        if (!job.title.trim()) {
            newErrors.title = 'Tiêu đề công việc là bắt buộc';
        }

        if (!job.description.trim()) {
            newErrors.description = 'Mô tả công việc là bắt buộc';
        } else if (job.description.length < 50) {
            newErrors.description = 'Mô tả phải có ít nhất 50 ký tự';
        }

        if (!job.salary) {
            newErrors.salary = 'Mức lương là bắt buộc';
        } else if (isNaN(Number(job.salary)) || Number(job.salary) <= 0) {
            newErrors.salary = 'Mức lương phải là số dương';
        }

        if (!job.work_time) {
            newErrors.work_time = 'Thời gian làm việc là bắt buộc';
        } else if (isNaN(Number(job.work_time)) || Number(job.work_time) <= 0 || Number(job.work_time) > 168) {
            newErrors.work_time = 'Thời gian làm việc phải từ 1-168 giờ/tuần';
        }

        if (!job.address.trim()) {
            newErrors.address = 'Địa chỉ làm việc là bắt buộc';
        }

        if (!job.company) {
            newErrors.company = 'Vui lòng chọn công ty';
        }

        if (!job.category) {
            newErrors.category = 'Vui lòng chọn danh mục';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJob(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            // Create URLSearchParams for form data
            let formData = new FormData();

            for (let key in job) {
                formData.append(key, job[key]);
            }

            // console.log("Dữ liệu gửi đi:");
            // for (let pair of formData.entries()) {
            //     console.log(pair[0] + ": ", pair[1]);
            // }

            let res = await authApis().post(endpoints['posting'], formData);

            if (res.status === 201) {
                setSubmitSuccess(true);
                if (res.data.checkout_url)
                    window.location.href = res.data.checkout_url;
            }
            if (res.status === 401) {
                setSubmitError('Bạn không có quyền để đăng tin tuyển dụng.');
            }
        } catch (error) {
            console.log(error);
            if (error.response.data.error) {
                setSubmitError(error.response.data.error);
            } else {
                setSubmitError('Có lỗi kết nối. Vui lòng thử lại sau.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light py-4">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        {/* Header */}
                        <div className="text-center mb-3">
                            <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-2"
                                style={{ width: '50px', height: '50px' }}>
                                <Briefcase size={25} className="text-success" />
                            </div>
                            <h4 className="fw-bold text-dark mb-2">Tạo Tin Tuyển Dụng Mới</h4>
                            <p className="lead text-muted" style={{ fontSize: '1.2rem' }}>Đăng tin tuyển dụng để tìm kiếm ứng viên phù hợp</p>
                        </div>

                        {/* Main Form Card */}
                        <Card className="shadow-lg border-0">
                            <Card.Body className="p-4 p-md-5">
                                {/* Success Alert */}
                                {submitSuccess && (
                                    <Alert variant="success" className="d-flex align-items-center mb-4">
                                        <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                                            <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                                        </div>
                                        <div>
                                            <strong>Thành công!</strong> Tin tuyển dụng đã được tạo thành công!
                                        </div>
                                    </Alert>
                                )}

                                {/* Error Alert */}
                                {submitError && (
                                    <Alert variant="danger" className="d-flex align-items-center mb-4">
                                        <AlertCircle size={20} className="me-3" />
                                        <div>{submitError}</div>
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    {/* Company Selection */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <Building2 size={16} className="me-2" />
                                            Công ty
                                        </Form.Label>
                                        <Form.Select
                                            name="company"
                                            value={job.company}
                                            onChange={handleInputChange}
                                            isInvalid={!!errors.company}
                                        >
                                            <option value="">Chọn công ty</option>
                                            {companies.map(company => (
                                                <option key={company.id} value={company.id}>
                                                    {company.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.company}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Job Title */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <FileText size={16} className="me-2" />
                                            Tiêu đề công việc
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={job.title}
                                            onChange={handleInputChange}
                                            placeholder="Ví dụ: Senior Frontend Developer"
                                            isInvalid={!!errors.title}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.title}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Row>
                                        {/* Salary */}
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-semibold">
                                                    <DollarSign size={16} className="me-2" />
                                                    Mức lương (VNĐ)
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="salary"
                                                    value={job.salary}
                                                    onChange={handleInputChange}
                                                    placeholder="Ví dụ: 20000000"
                                                    isInvalid={!!errors.salary}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.salary}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        {/* Work Time */}
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-semibold">
                                                    <Clock size={16} className="me-2" />
                                                    Thời gian làm việc (giờ/tuần)
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="work_time"
                                                    value={job.work_time}
                                                    onChange={handleInputChange}
                                                    placeholder="Ví dụ: 40"
                                                    min="1"
                                                    max="168"
                                                    isInvalid={!!errors.work_time}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.work_time}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Address */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <MapPin size={16} className="me-2" />
                                            Địa chỉ làm việc
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={job.address}
                                            onChange={handleInputChange}
                                            placeholder="Ví dụ: 123 Đường ABC, Quận 1, TP.HCM"
                                            isInvalid={!!errors.address}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.address}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Job Description */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <FileText size={16} className="me-2" />
                                            Mô tả công việc
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={6}
                                            name="description"
                                            value={job.description}
                                            onChange={handleInputChange}
                                            placeholder="Mô tả chi tiết về công việc, yêu cầu, quyền lợi..."
                                            isInvalid={!!errors.description}
                                            style={{ resize: 'none' }}
                                        />
                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            {errors.description ? (
                                                <Form.Control.Feedback type="invalid" className="d-block">
                                                    {errors.description}
                                                </Form.Control.Feedback>
                                            ) : (
                                                <Form.Text className="text-muted">Tối thiểu 50 ký tự</Form.Text>
                                            )}
                                            <Form.Text className="text-muted">{job.description.length} ký tự</Form.Text>
                                        </div>
                                    </Form.Group>

                                    {/* Job Category*/}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <Tag size={16} className="me-2" />
                                            Danh mục công việc
                                        </Form.Label>
                                        <Form.Select
                                            name="category"
                                            value={job.category}
                                            onChange={handleInputChange}
                                            isInvalid={!!errors.category}
                                        >
                                            <option value="" className="text-muted">Chọn danh mục...</option>
                                            {categories.map(cate => (
                                                <option key={cate.id} value={cate.id}>
                                                    {cate.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.category}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Submit Button */}
                                    <div className="pt-3 border-top d-flex justify-content-center">
                                        <Button
                                            type="submit"
                                            variant="success"
                                            size="sm"
                                            disabled={isSubmitting}
                                            className="py-2 fw-semibold"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        className="me-2"
                                                    />
                                                    Đang tạo tin tuyển dụng...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={20} className="me-2 text-success text-white" />
                                                    Xác nhận và thanh toán
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AddPosting;