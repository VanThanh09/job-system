import { Button } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const nav = useNavigate();

    const sessionId = searchParams.get("session_id");
    const postingId = searchParams.get("posting_id");

    const viewPosting = () => {
        nav(`/job/${postingId}`);
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4 text-success">
                Thanh toán thành công!
            </h2>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md pb-4">
                <p><strong>Mã giao dịch:</strong> {sessionId}</p>
            </div>
            <Button onClick={viewPosting} size="sm" variant="success" >
                Xem bài đăng
            </Button>
        </div >
    );
}

export default PaymentSuccess;
