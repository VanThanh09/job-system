import { useEffect, useState } from 'react';
import { Container, Row, Col, Pagination, Spinner } from 'react-bootstrap';
import { FiUsers, FiBriefcase } from 'react-icons/fi';
import ApplicationStats from '../ui/applyPage/ApplicationStats';
import ApplicationCard from '../ui/applyPage/ApplicationCard';
import CVModal from '../ui/applyPage/CVModal';
import Apis, { authApis, endpoints } from '../../configs/Apis';
import { useParams } from 'react-router-dom';
import Paginator from '../ui/Paginator';
import CandidateCard from '../ui/profilePage/CandidateCard';

function JobRecommendations() {
    const { jobId } = useParams();
    const [job, setJob] = useState({});
    const [candidateInfo, setCandidateInfo] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showCVModal, setShowCVModal] = useState(false);
    const [selectedCV, setSelectedCV] = useState({ url: '', title: '' });

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const loadApply = async () => {
        try {
            setLoading(true);
            let params = new URLSearchParams();

            params.append('page', page);

            let url = `${endpoints['recommendations'](jobId)}&${params.toString()}`;
            let res = await authApis().get(url);

            if (res.status === 200) {
                setCandidateInfo(res.data.results);

                setTotalPages(Math.ceil(res.data.count / 12));
            }

            let resJob = await Apis.get(endpoints['job'](jobId));

            if (resJob.status === 200) {
                setJob(resJob.data);
            }
        } catch (ex) {
            console.log("Không tải được đề xuất ứng viên", ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const el = document.querySelector('.scroll-to-here');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
        loadApply();
    }, [page]);

    const handleViewCV = (cvUrl, title) => {
        setSelectedCV({ url: cvUrl, title });
        setShowCVModal(true);
    };



    return (
        <div className="min-vh-100 bg-light">
            <div className="bg-success text-white py-4 mb-4">
                <Container>
                    <Row className="align-items-center">
                        <Col>
                            <div className="d-flex align-items-center">
                                <FiBriefcase size={32} className="me-3" />
                                <div>
                                    <h1 className="h3 mb-1">{job.title}</h1>
                                    <p className="mb-0 opacity-75">
                                        <FiUsers className="me-2" />
                                        Xem danh sách ứng viên phù hợp
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container>
                {loading ? <>
                    <div className='d-flex justify-content-center mt-5'>
                        <Spinner variant='success' size='lg' />
                    </div>
                </> : <>
                    <Row className="g-5">
                        {candidateInfo.map((c, index) => {
                            const { user } = c.candidate_info;
                            const candidate = c.candidate_info;
                            const { similarity } = c;

                            return (
                                <Col key={index} sm={12} md={6} lg={6}>
                                    <CandidateCard user={user} candidate={candidate} similarity={similarity} />
                                </Col>
                            )
                        })}
                    </Row>

                    {candidateInfo.length === 0 && (
                        <div className="text-center py-5">
                            <FiUsers size={64} className="text-muted mb-3" />
                            <h4 className="text-muted">Không có ứng viên phù hợp</h4>
                            <p className="text-muted">Hiện tại chưa có hồ sơ nào phù hợp cho công việc của bạn.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Paginator page={page} totalPage={totalPages} setPage={setPage} />
                    )}
                </>}
            </Container>

            <CVModal
                show={showCVModal}
                onHide={() => setShowCVModal(false)}
                cvUrl={selectedCV.url}
                title={selectedCV.title}
            />
        </div>
    );
}

export default JobRecommendations;