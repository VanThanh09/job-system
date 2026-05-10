import { Button, Container } from "react-bootstrap";
import { BsFillPeopleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const HireView = () => {
    const nav = useNavigate();
    const handleCandidatePress = () => {
        nav("/candidates");
    }

    return (

        <Container className="pb-4 pt-2">
            {/* <div className="text-center mb-2">
                <h1 className="fw-bold text-dark mb-3 d-flex justify-content-center align-items-center" style={{ fontSize: '1.8rem' }}>
                    <BsFillPeopleFill className="me-2 text-dark" />
                    Tìm kiếm ứng viên
                </h1>
            </div> */}

            <div
                style={{
                    background: "linear-gradient(90deg, #6cac30ff, #00bb1fff)",
                    borderRadius: "1rem",
                    padding: "4rem 1rem",
                    textAlign: "center",
                    color: "white",
                }}
            >
                <h2 className="fw-bold mb-4">
                    Tìm kiếm ứng viên phù hợp cho công việc của bạn
                </h2>
                <Button variant="light" className="px-4 py-2 fw-medium" onClick={handleCandidatePress}>
                    Khám phá ứng viên
                </Button>
            </div>

        </Container>
    );
};

export default HireView;