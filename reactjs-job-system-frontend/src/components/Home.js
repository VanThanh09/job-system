import { Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../configs/Apis";
import { useEffect, useState } from "react";
import CategoriesList from "./ui/homePage/CategoriesList";
import JobList from "./ui/homePage/JobList";
import HireView from "./ui/homePage/HireList";

const Home = () => {
    const nav = useNavigate();
    const [categories, setCategories] = useState([]);
    const [jobs, setJobs] = useState([]);
    // const [loading, setLoading] = useState(false);

    const loadCate = async () => {
        try {
            let res = await Apis.get(endpoints['categories']);
            setCategories(res.data);
        } catch (ex) {
            console.log("Không thể load cate: ", ex);
        } finally {

        }
    }

    const loadJobs = async () => {
        try {
            let res = await Apis.get(endpoints['posting']);
            setJobs(res.data.results.slice(0, 6));
            // console.log(res.data.results);
        } catch (ex) {
            console.log("Không thể load jobs: ", ex);
        } finally {

        }
    }

    const clickCate = (cate) => {
        nav(`/jobs?categoryId=${cate.id}`);
    }

    useEffect(() => {
        loadCate();
        loadJobs();
    }, [])

    return (
        <Container className="mt-4">
            {/* Banner  */}
            <img
                src="https://res.cloudinary.com/drzc4fmxb/image/upload/v1754070145/C%C6%A1_h%E1%BB%99i_kh%C3%B4ng_ch%E1%BB%9D_%C4%91%E1%BB%A3i_valmlu.png"
                alt="Banner Cơ hội không chờ đợi"
                className="img-fluid shadow mb-5"
                style={{ borderRadius: '1rem' }}
            />

            {/* List categories  */}
            <CategoriesList categories={categories} handleCateClick={clickCate} />

            {/* List 4 jobs */}
            <JobList jobs={jobs} isHomePage={true} />

            {/* Hire banner */}
            <HireView />

        </Container>
    )
}

export default Home;