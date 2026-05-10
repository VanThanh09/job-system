import { useContext, useEffect, useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { MyUserContext } from "../../configs/MyContexts";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { FiPlus } from "react-icons/fi";
import JobCard from "../ui/homePage/JobCard";
import CompanyDetail from "../ui/companyPage/CompanyDetail";

const MyCompanyDetail = () => {
    const { id } = useParams();
    const [companyData, setCompanyData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);

    const [user,] = useContext(MyUserContext);
    const nav = useNavigate();

    const loadCompany = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoints['myComDetail'](id));

            if (res.status === 200)
                setCompanyData(res.data);
            console.log(res.data)

        } catch (ex) {
            console.log("Lỗi tải MyComDetail", ex);
        } finally {
            setLoading(false);
        }
    }

    const loadJobs = async () => {
        try {
            let res = await Apis.get(endpoints['companyJobs'](id));

            if (res.status === 200)
                setJobs(res.data.results);

        } catch (ex) {
            console.log(ex);
        } finally {
        }
    }

    useEffect(() => {
        loadCompany();
        loadJobs();
    }, [])

    if (!user || user === null) {
        return (
            <Container className="my-5 text-center">
                <h5>Bạn cần đăng nhập để tiếp tục</h5>
                <Button variant="success" size="sm" className="mt-2" onClick={() => nav("/login")}>
                    Đăng nhập
                </Button>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" variant="success" size="md" />
            </Container>
        );
    }

    return (
        <div>
            <Container>
                {/* Company info */}
                <CompanyDetail companyData={companyData} />

                {/* Jobs of company */}
                {companyData?.status === "AP" ? <>
                    <div className="d-flex align-items-center gap-3 pb-4">
                        <h3 className="text-dark fw-bold">Các bài đăng ứng tuyển</h3>
                        <Button variant="outline-success" className="w-auto px-3 align-items-center d-flex" onClick={() => nav(`/addposting?companyId=${companyData.id}`)}>
                            <FiPlus size={20} className="me-1" />
                            Đăng tin tuyển dụng
                        </Button>
                    </div>
                    {jobs.map(job => <div className="pb-4">
                        <JobCard job={job} isOwner={true} key={job.id} loadJobs={loadJobs} />
                    </div>
                    )}
                </> : <>
                    <p className='text-success text-center' style={{ fontWeight: '500' }}>Khi công ty được duyệt bạn có thể đăng bài</p>
                </>}

            </Container>
        </div>
    )
}

export default MyCompanyDetail;