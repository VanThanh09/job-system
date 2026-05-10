import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { Container, Spinner } from "react-bootstrap";
import Filter from "../ui/jobPage/Filter";
import { useSearchParams } from "react-router-dom";
import JobList from "../ui/homePage/JobList";
import Paginator from "../ui/Paginator";

const Jobs = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [jobs, setJobs] = useState([]);


    const [searchParams, setSearchParams] = useSearchParams();
    const categoryId = searchParams.get('categoryId');

    const [filters, setFilters] = useState({});

    const loadCate = async () => {
        try {
            let res = await Apis.get(endpoints["categories"]);
            setCategories(res.data);
        } catch (ex) {
            console.log("Không thể load cate: ", ex);
        } finally {

        }
    }

    const loadJobs = async () => {
        try {
            setLoading(true);

            let url = `${endpoints['posting']}?page=${page}`;

            if (searchParams) {
                url += `&${searchParams.toString()}`;
            }

            let res = await Apis.get(url);

            setJobs(res.data.results);
            setTotalPage(Math.ceil(res.data.count / 12));
        } catch (ex) {
            console.log("Không thể load job: ", ex);
        } finally {
            setLoading(false);
        }
    }

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleClearFilters = () => {
        setFilters({});
        if (page !== 1)
            setPage(1);
        else
            loadJobs();
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (filters.categoryId || filters.salaryFrom || filters.salaryTo || filters.address || filters.workTime) {
            if (page !== 1)
                setPage(1);
            else
                loadJobs();
            return
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        loadJobs();
    }, [page]);

    useEffect(() => {
        setSearchParams({ ...filters }, { replace: true });
    }, [filters])

    useEffect(() => {
        loadCate();
        loadJobs();
        if (categoryId) {
            handleFilterChange('categoryId', categoryId);
        }
    }, []);

    return (
        <Container style={{ minHeight: '100vh' }}>
            <Filter filters={filters} categories={categories} handleFilterChange={handleFilterChange} handleClearFilters={handleClearFilters} handleSearch={handleSearch} />

            {loading ? <>
                <div className="py-5 d-flex justify-content-center min-vh-100">
                    <Spinner animation="border" variant="success" />
                </div>
            </> : <>
                <JobList jobs={jobs} />

                <Paginator page={page} totalPage={totalPage} setPage={setPage} />
            </>}

        </Container>
    )
}

export default Jobs;