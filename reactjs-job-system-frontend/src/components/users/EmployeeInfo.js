import { useEffect, useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CompanyList from "../ui/companyPage/CompanyList";
import { authApis, endpoints } from "../../configs/Apis";

const EmployeeInfo = () => {
    const nav = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleAddCompany = () => {
        nav("/addcompany");
    }

    const loadMyCompanies = async () => {
        try {
            setLoading(true);

            let res = await authApis().get(endpoints['myCompanies']);

            if (res.status === 200) {
                setCompanies(res.data);
            }
        } catch (ex) {
            console.error("Lỗi load danh sách công ty", ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMyCompanies();
    }, [])

    return (
        <Container className="my-5">
            <div className="d-flex flex-column justify-content-center align-items-between">
                <Button
                    variant="success"
                    onClick={handleAddCompany}
                    className="d-flex align-items-center gap-2 w-auto align-self-start"
                >
                    <FaPlus /> Thêm công ty
                </Button>
                <div>
                    <small className="text-muted">Tạo công ty để bắt đầu đăng tin tuyển dụng</small>
                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="success" size="md" />
                </div>
            ) : (
                <CompanyList companies={companies} />
            )}
        </Container>
    )
}

export default EmployeeInfo;