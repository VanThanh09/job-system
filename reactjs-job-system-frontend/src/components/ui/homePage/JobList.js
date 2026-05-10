import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import JobCard from './JobCard';
import { FaBriefcase } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const JobList = ({ jobs, isHomePage }) => {
    if (!jobs || jobs.length === 0) {
        return (
            <Container className="mt-5">
                <Alert variant="light" className="text-center">
                    <FaBriefcase className="me-2" />
                    Không tìm thấy công việc phù hợp.
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            {isHomePage &&
                <div className="text-center mb-4">
                    <h1 className="fw-bold text-dark mb-3 d-flex justify-content-center align-items-center" style={{ fontSize: '1.8rem' }}>
                        <FaBriefcase className="me-2 text-dark" />
                        Danh sách công việc
                    </h1>
                    <p className="lead text-muted">
                        Khám phá cơ hội nghề nghiệp hấp dẫn đang chờ đón bạn
                    </p>
                </div>
            }

            <Row className="g-4">
                {jobs.map((job) => (
                    <Col key={job.id} lg={6} xl={4}>
                        <JobCard job={job} />
                    </Col>
                ))}
            </Row>

            {isHomePage &&
                <div className="justify-content-center d-flex">
                    <Link to="/jobs">
                        <Button variant="success" size="sm" className="px-3 mt-4 px-4">
                            Xem thêm
                        </Button>
                    </Link>
                </div>
            }
        </Container>
    );
};

export default JobList;