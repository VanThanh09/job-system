import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaFileDownload, FaClock, FaBriefcase, FaComments } from 'react-icons/fa';
import './Candidates.css';
import { useEffect, useState } from 'react';
import Paginator from '../ui/Paginator';
import Apis, { endpoints } from '../../configs/Apis';
import CandidateCard from '../ui/profilePage/CandidateCard';

const Candidates = () => {
    const [page, setPage] = useState(1);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(0);

    const loadCandidates = async () => {
        try {
            setLoading(true);

            let url = `${endpoints['candidates']}?page=${page}`;

            let res = await Apis.get(url);

            if (res.status === 200) {
                setCandidates(res.data.results);
                setTotalPage(Math.ceil(res.data.count / 9));
            }
        } catch (ex) {
            console.log(ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCandidates();
    }, [])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        loadCandidates();
    }, [page]);


    return (
        <div className="app-container">
            <Container fluid className="py-2">
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <div className="header-section mb-3">
                            <h1 className="display-6 fw-bold text-center mb-3">
                                <FaBriefcase className="me-3 text-success" />
                                Danh Sách Ứng Viên
                            </h1>
                            <p className="lead text-center text-muted">
                                Quản lý và xem thông tin chi tiết các ứng viên
                            </p>
                        </div>

                        {loading ? <>
                            <div className="py-5 d-flex justify-content-center min-vh-100">
                                <Spinner animation="border" variant="success" />
                            </div>
                        </> : <>
                            <Row className="g-4 mb-4">
                                {candidates.map((candidate, index) => {
                                    const { user } = candidate;
                                    return (
                                        <Col lg={4} key={user.id}>
                                            <CandidateCard user={user} candidate={candidate} />
                                        </Col>
                                    );
                                })}
                            </Row>

                            <Paginator page={page} totalPage={totalPage} setPage={setPage} />
                        </>}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Candidates;